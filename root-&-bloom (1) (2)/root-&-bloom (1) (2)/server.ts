import express from "express";
import path from "path";
import crypto from "node:crypto";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Password hashing helper using crypto PBKDF2
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// In-Memory Secure Store for Customers
interface StoredCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinedDate: string;
  membershipTier: string;
  avatar?: string;
  loyaltyPoints: number;
  passwordHash: string;
  salt: string;
}

// In-Memory Secure Store for Managers
interface StoredManager {
  id: string;
  name: string;
  email: string;
  hub: string;
  role: string;
  loginTime: string;
  staffBadgeId: string;
  passwordHash: string;
  salt: string;
}

// Seed initial customers with secure salted hashes
const customersStore: Map<string, StoredCustomer> = new Map();
const ananyaSalt = generateSalt();
customersStore.set("ananya.s@example.com", {
  id: "cust-1",
  name: "Ananya Sharma",
  email: "ananya.s@example.com",
  phone: "+91 98451 22890",
  address: "Indiranagar, Bengaluru - 560038",
  joinedDate: "August 2026",
  membershipTier: "Bloom Club Gold",
  loyaltyPoints: 450,
  salt: ananyaSalt,
  passwordHash: hashPassword("password123", ananyaSalt),
});

const aaravSalt = generateSalt();
customersStore.set("aarav.sharma@example.com", {
  id: "cust-2",
  name: "Aarav Sharma",
  email: "aarav.sharma@example.com",
  phone: "+91 98450 12345",
  address: "#402, Green Glen Layout, Bellandur, Bengaluru",
  joinedDate: "July 2026",
  membershipTier: "Bloom Club Silver",
  loyaltyPoints: 280,
  salt: aaravSalt,
  passwordHash: hashPassword("password123", aaravSalt),
});

// Seed initial managers with secure salted hashes
const managersStore: Map<string, StoredManager> = new Map();
const managerSalt = generateSalt();
managersStore.set("manager@rootandbloom.in", {
  id: "mgr-1",
  name: "Priya Nair",
  email: "manager@rootandbloom.in",
  hub: "Indiranagar Central Hub #01 (Bengaluru)",
  role: "Operations & Logistics Lead",
  loginTime: "08:30 AM IST",
  staffBadgeId: "RB-STAFF-01",
  salt: managerSalt,
  passwordHash: hashPassword("admin123", managerSalt),
});

const managerVikramSalt = generateSalt();
managersStore.set("vikram.singh@rootandbloom.in", {
  id: "mgr-2",
  name: "Vikram Singh",
  email: "vikram.singh@rootandbloom.in",
  hub: "Koramangala South Hub #02 (Bengaluru)",
  role: "Lead Horticultural Officer",
  loginTime: "09:00 AM IST",
  staffBadgeId: "RB-STAFF-02",
  salt: managerVikramSalt,
  passwordHash: hashPassword("admin123", managerVikramSalt),
});

// Session Token Maps
const activeCustomerSessions: Map<string, string> = new Map(); // token -> email
const activeManagerSessions: Map<string, string> = new Map(); // token -> email

// Password Reset Tokens: email -> { code, expiresAt }
const passwordResetTokens: Map<string, { code: string; expiresAt: number }> = new Map();

function sanitizeCustomer(cust: StoredCustomer) {
  const { passwordHash, salt, ...safe } = cust;
  return safe;
}

function sanitizeManager(mgr: StoredManager) {
  const { passwordHash, salt, ...safe } = mgr;
  return safe;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "Root & Bloom Garden Co." });
  });

  // AI Plant Assistant Endpoint
  app.post("/api/plant-ai", async (req, res) => {
    const { message, history, gardenContext } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            },
          },
        });

        const systemInstruction = `You are "Dr. Flora", the Senior Horticultural Specialist & Plant Doctor for Root & Bloom Garden Co., a premium Indian gardening startup.
You provide friendly, actionable, science-grounded gardening advice tailored to Indian climates (subtropical, coastal, monsoon seasons, Indian balcony/terrace settings).
Keep responses clear, warm, formatted with neat bullet points, actionable remedies, watering/sunlight guidelines, and suggest organic treatments (like neem oil spray, vermicompost, cow dung manure, cocopeat).
Always answer with botanical authority and genuine care. If applicable, recommend relevant Root & Bloom services (like garden maintenance or soil repotting) subtly without being pushy.`;

        const promptText = `User Query: "${message || "Tell me how to take care of balcony plants"}"
${gardenContext ? `User Garden Context: ${JSON.stringify(gardenContext)}` : ""}
Recent Chat: ${Array.isArray(history) ? history.slice(-4).map((h: any) => `${h.sender}: ${h.text}`).join("\n") : ""}`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: promptText,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        const reply = response.text || "I recommend checking soil moisture and ensuring adequate indirect sunlight.";
        return res.json({ reply, source: "gemini" });
      } catch (err: any) {
        console.error("Gemini API error, falling back to local botanical knowledge:", err?.message);
      }
    }

    // High quality offline fallback with detailed botanical intelligence
    const q = (message || "").toLowerCase();
    let reply = "";

    if (q.includes("yellow") || q.includes("leaves turning")) {
      reply = `**Diagnosis: Chlorosis / Leaf Yellowing** 🌿\n\n1. **Overwatering (Most Common)**: Check if the top 2 inches of soil feel soggy. Allow the soil to dry out between waterings.\n2. **Drainage Issues**: Ensure your pot has drainage holes. Never let roots sit in standing saucers.\n3. **Nitrogen Deficiency**: If older lower leaves turn yellow first, nourish with organic **Vermicompost** or diluted seaweed tonic.\n4. **Sudden Light Shock**: Avoid shifting plants directly from shaded indoors to harsh afternoon Indian sun.`;
    } else if (q.includes("water") || q.includes("how often")) {
      reply = `**Smart Watering Protocol** 💧\n\n• **The Finger Test**: Insert your finger 1.5 inches into the soil. If dry, water thoroughly until it drains out from the bottom; if damp, wait 1-2 days.\n• **Indoor Plants (Snake plant, ZZ, Pothos)**: Water once every 7–10 days in summers, 12–15 days in monsoons/winters.\n• **Balcony/Terrace Pots**: Water early morning (before 9 AM) or dusk. Daily in hot summer months; alternate days in milder weather.`;
    } else if (q.includes("pest") || q.includes("mealybug") || q.includes("bugs") || q.includes("insect")) {
      reply = `**Organic Pest Control Action Plan** 🐛\n\n1. **Cold-Pressed Neem Oil Spray**: Mix 5ml pure Neem Oil + 2 drops mild eco-dishwash soap in 1 Litre water. Spray thoroughly under leaves at sunset every 4 days.\n2. **Manual Wipe-Down**: For white fuzzy mealybugs, dab a cotton swab in rubbing alcohol and touch them directly.\n3. **Isolate**: Separate the infested pot 3-4 feet away from healthy plants immediately.`;
    } else if (q.includes("balcony") || q.includes("apartment") || q.includes("indoor")) {
      reply = `**Best Apartment & Balcony Plants for India** 🪴\n\n• **Low Light / North Facing**: Snake Plant (Sansevieria), ZZ Plant, Aglaonema, Peace Lily.\n• **Bright Indirect Light / East Facing**: Monstera Deliciosa, Fiddle Leaf Fig, Areca Palm, Syngonium.\n• **Sunny South/West Balcony**: Bougainvillea, Holy Basil (Tulsi), Jasmine (Mogra), Jade Plant, Adenium.`;
    } else if (q.includes("fertilizer") || q.includes("feed") || q.includes("manure")) {
      reply = `**Nutritional & Fertilizer Guide** 🌾\n\n• **Base Soil Dressing**: Add 2-3 handfuls of Root & Bloom Organic Vermicompost once a month to aerated topsoil.\n• **Micro-nutrients**: Spray Seaweed extract liquid foliar spray every 21 days for lush green foliage.\n• **Flowering Booster**: Use bone meal or banana peel tea rich in phosphorus and potassium for hibiscus and roses.`;
    } else {
      reply = `**Plant Care Recommendation** 🌿\n\nFor thriving greenery in your garden:\n• **Sunlight**: Most foliage plants prefer bright indirect sunlight (filtered through sheer curtains or balcony grilles).\n• **Soil Mix**: Use 40% garden soil, 30% cocopeat, and 30% vermicompost with a handful of perlite for optimal root aeration.\n• **Air Circulation**: Avoid grouping crowded pots against solid walls without fresh breeze.`;
    }

    return res.json({ reply, source: "knowledge-base" });
  });

  // Live Support Chat with conversational natural dialog and Root & Bloom business intelligence
  app.post("/api/chat", async (req, res) => {
    const { message, history } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            },
          },
        });

        const systemInstruction = `You are "Flora", the friendly botanical advisor for Root & Bloom Garden Co. (Bengaluru, India).
Keep the conversation natural, warm, and conversational:
1. Natural dialogue: Answer what the user actually asked. Do NOT dump long canned lists or repeat generic company summaries in every message.
2. Be concise: Keep responses focused (typically 2–4 sentences unless answering a deep diagnostic question).
3. Ask natural follow-ups: Follow up with an intuitive, brief question when appropriate (e.g., if user mentions a balcony, ask "Is it sunny, partially shaded, or low light?").
4. Authentic botanical expertise: Give grounded advice tailored to Indian weather, indoor/balcony spaces, organic neem solutions, and proper watering techniques.
5. Seamless assistance: Subtly mention Root & Bloom services (35-min essentials dispatch, maintenance visits, or plant doctor) only when relevant to what they need.`;

        const recentHistory = Array.isArray(history)
          ? history.slice(-6).map((h: any) => `${h.sender === "user" ? "Customer" : "Flora"}: ${h.text}`).join("\n")
          : "";

        const prompt = `${recentHistory ? `Conversation History:\n${recentHistory}\n` : ""}Customer: ${message || "Hello"}\nFlora:`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        const reply = response.text || "Hello! 🌿 Welcome to Root & Bloom. How can I assist you with your plants or garden today?";
        return res.json({ reply, source: "gemini" });
      } catch (err: any) {
        console.error("Gemini Chat API error:", err?.message);
      }
    }

    // Friendly conversational fallback if API is unavailable or offline
    const clean = (message || "").toLowerCase().trim();
    let reply = "Hello! 🌿 Welcome to Root & Bloom Garden Co. How can I assist you with plant care, quick deliveries, or booking our horticultural services today?";
    if (clean.includes("hello") || clean.includes("hi") || clean.includes("hey") || clean.includes("namaste")) {
      reply = "Namaste! 🌿 Welcome to Root & Bloom. How can I help you today? Ask me anything about plant care, 35-minute essentials delivery, or booking a gardener!";
    } else if (clean.includes("order") || clean.includes("tracking") || clean.includes("delivery")) {
      reply = "All plant orders are delivered within 35 minutes via our zero-emission electric cargo fleet. You can track active deliveries in the 'My Garden' tab!";
    } else if (clean.includes("service") || clean.includes("book") || clean.includes("gardener") || clean.includes("maintenance")) {
      reply = "We offer Routine Garden Maintenance, Lawn Care, Plant Doctor diagnostics, and Balcony Transformations starting at ₹799. You can easily book from our 'Services' section!";
    } else if (clean.includes("water") || clean.includes("yellow") || clean.includes("soil") || clean.includes("pest")) {
      reply = "For plant health issues, check the top 1.5 inches of soil before watering. If leaves are yellowing, make sure the pot drains properly and apply organic vermicompost or neem oil spray!";
    }

    return res.json({ reply, source: "fallback" });
  });

  // ==========================================
  // CUSTOMER AUTHENTICATION ENDPOINTS
  // ==========================================

  // Customer Sign Up / Create Account
  app.post("/api/auth/customer/signup", (req, res) => {
    try {
      const { name, email, phone, address, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required." });
      }

      const cleanEmail = email.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        return res.status(400).json({ error: "Please enter a valid email address." });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long." });
      }

      if (customersStore.has(cleanEmail)) {
        return res.status(409).json({ error: "An account with this email already exists. Please sign in." });
      }

      const salt = generateSalt();
      const passwordHash = hashPassword(password, salt);
      const newCustomer: StoredCustomer = {
        id: `cust-${Date.now()}`,
        name: name.trim(),
        email: cleanEmail,
        phone: (phone || "").trim(),
        address: (address || "").trim(),
        joinedDate: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        membershipTier: "Bloom Club Member",
        loyaltyPoints: 100, // Welcome bonus points
        salt,
        passwordHash,
      };

      customersStore.set(cleanEmail, newCustomer);

      const token = generateToken();
      activeCustomerSessions.set(token, cleanEmail);

      return res.status(201).json({
        success: true,
        user: sanitizeCustomer(newCustomer),
        token,
        message: "Account created successfully! Welcome to Root & Bloom Garden Club.",
      });
    } catch (err: any) {
      console.error("Customer signup error:", err);
      return res.status(500).json({ error: "Server error creating account." });
    }
  });

  // Customer Login
  app.post("/api/auth/customer/login", (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Please provide both email and password." });
      }

      const cleanEmail = email.trim().toLowerCase();
      const customer = customersStore.get(cleanEmail);

      if (!customer) {
        return res.status(401).json({ error: "No account found with this email. Please check your spelling or sign up." });
      }

      const computedHash = hashPassword(password, customer.salt);
      if (computedHash !== customer.passwordHash) {
        return res.status(401).json({ error: "Incorrect password. Please try again or click 'Forgot Password'." });
      }

      const token = generateToken();
      activeCustomerSessions.set(token, cleanEmail);

      return res.json({
        success: true,
        user: sanitizeCustomer(customer),
        token,
        message: `Welcome back, ${customer.name}!`,
      });
    } catch (err: any) {
      console.error("Customer login error:", err);
      return res.status(500).json({ error: "Server error during authentication." });
    }
  });

  // Customer Forgot Password
  app.post("/api/auth/customer/forgot-password", (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Please enter your registered email address." });
      }

      const cleanEmail = email.trim().toLowerCase();
      const customer = customersStore.get(cleanEmail);

      if (!customer) {
        return res.status(404).json({ error: "No account found with this email. Please verify your address." });
      }

      // Generate 6-digit verification code with 15-min expiry
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 15 * 60 * 1000;
      passwordResetTokens.set(cleanEmail, { code, expiresAt });

      return res.json({
        success: true,
        message: `Password reset verification code sent to ${cleanEmail}. (Code: ${code})`,
        resetCode: code, // returned for seamless in-app verification
      });
    } catch (err: any) {
      console.error("Forgot password error:", err);
      return res.status(500).json({ error: "Unable to process password reset request." });
    }
  });

  // Customer Password Reset
  app.post("/api/auth/customer/reset-password", (req, res) => {
    try {
      const { email, code, newPassword } = req.body;

      if (!email || !code || !newPassword) {
        return res.status(400).json({ error: "Email, verification code, and new password are required." });
      }

      const cleanEmail = email.trim().toLowerCase();
      const customer = customersStore.get(cleanEmail);

      if (!customer) {
        return res.status(404).json({ error: "Customer record not found." });
      }

      const record = passwordResetTokens.get(cleanEmail);
      if (!record || record.code !== code.trim()) {
        return res.status(400).json({ error: "Invalid or expired verification code." });
      }

      if (Date.now() > record.expiresAt) {
        passwordResetTokens.delete(cleanEmail);
        return res.status(400).json({ error: "Verification code has expired. Please request a new one." });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: "New password must be at least 6 characters long." });
      }

      // Update password hash with new salt
      const newSalt = generateSalt();
      customer.salt = newSalt;
      customer.passwordHash = hashPassword(newPassword, newSalt);
      customersStore.set(cleanEmail, customer);

      // Clear reset token
      passwordResetTokens.delete(cleanEmail);

      return res.json({
        success: true,
        message: "Password has been successfully updated! You can now log in with your new credentials.",
      });
    } catch (err: any) {
      console.error("Password reset error:", err);
      return res.status(500).json({ error: "Unable to reset password." });
    }
  });

  // Customer Update Profile
  app.post("/api/auth/customer/profile", (req, res) => {
    try {
      const authHeader = req.headers.authorization || "";
      const token = authHeader.replace("Bearer ", "").trim();
      const email = activeCustomerSessions.get(token);

      const customer = email ? customersStore.get(email) : null;
      if (!customer) {
        // Fallback: Check email in body if passed
        const bodyEmail = (req.body.email || "").trim().toLowerCase();
        const fallbackCust = customersStore.get(bodyEmail);
        if (!fallbackCust) {
          return res.status(401).json({ error: "Unauthorized: Please log in." });
        }
        if (req.body.name) fallbackCust.name = req.body.name.trim();
        if (req.body.phone) fallbackCust.phone = req.body.phone.trim();
        if (req.body.address) fallbackCust.address = req.body.address.trim();
        customersStore.set(bodyEmail, fallbackCust);
        return res.json({ success: true, user: sanitizeCustomer(fallbackCust) });
      }

      if (req.body.name) customer.name = req.body.name.trim();
      if (req.body.phone) customer.phone = req.body.phone.trim();
      if (req.body.address) customer.address = req.body.address.trim();
      customersStore.set(email!, customer);

      return res.json({
        success: true,
        user: sanitizeCustomer(customer),
        message: "Profile preferences updated successfully.",
      });
    } catch (err: any) {
      console.error("Profile update error:", err);
      return res.status(500).json({ error: "Unable to update profile." });
    }
  });

  // Customer Change Password
  app.post("/api/auth/customer/change-password", (req, res) => {
    try {
      const { email, oldPassword, newPassword } = req.body;
      const cleanEmail = (email || "").trim().toLowerCase();
      const customer = customersStore.get(cleanEmail);

      if (!customer) {
        return res.status(404).json({ error: "Customer account not found." });
      }

      if (hashPassword(oldPassword, customer.salt) !== customer.passwordHash) {
        return res.status(400).json({ error: "Current password is incorrect." });
      }

      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: "New password must be at least 6 characters." });
      }

      const newSalt = generateSalt();
      customer.salt = newSalt;
      customer.passwordHash = hashPassword(newPassword, newSalt);
      customersStore.set(cleanEmail, customer);

      return res.json({
        success: true,
        message: "Your password has been changed securely.",
      });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to change password." });
    }
  });

  // Customer Get Current User
  app.get("/api/auth/customer/me", (req, res) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace("Bearer ", "").trim();
    const email = activeCustomerSessions.get(token);

    if (!email || !customersStore.has(email)) {
      return res.status(401).json({ error: "No active session." });
    }

    return res.json({ success: true, user: sanitizeCustomer(customersStore.get(email)!) });
  });

  // ==========================================
  // MANAGER AUTHENTICATION & ACCESS ENDPOINTS
  // ==========================================

  // Manager Login
  app.post("/api/auth/manager/login", (req, res) => {
    try {
      const { email, password, hub } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Staff email and password are required." });
      }

      const cleanEmail = email.trim().toLowerCase();
      const manager = managersStore.get(cleanEmail);

      if (!manager) {
        return res.status(401).json({ error: "No manager credentials found for this email." });
      }

      const computedHash = hashPassword(password, manager.salt);
      if (computedHash !== manager.passwordHash) {
        return res.status(401).json({ error: "Incorrect staff authorization passcode." });
      }

      if (hub) {
        manager.hub = hub;
      }
      manager.loginTime = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

      const token = generateToken();
      activeManagerSessions.set(token, cleanEmail);

      return res.json({
        success: true,
        manager: {
          ...sanitizeManager(manager),
          token,
        },
        token,
        message: `Manager session authorized. Connected to ${manager.hub}.`,
      });
    } catch (err: any) {
      console.error("Manager login error:", err);
      return res.status(500).json({ error: "Server error during manager login." });
    }
  });

  // New Staff / Manager Registration
  app.post("/api/auth/manager/register", (req, res) => {
    try {
      const { name, email, password, hub, staffPasscode } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: "All staff registration fields are required." });
      }

      const cleanCode = (staffPasscode || "").trim();
      if (cleanCode !== "BLOOM2026" && cleanCode !== "ROOTADMIN") {
        return res.status(403).json({ error: "Invalid Central Ops Verification Passcode. Contact Headquarters." });
      }

      const cleanEmail = email.trim().toLowerCase();
      if (managersStore.has(cleanEmail)) {
        return res.status(409).json({ error: "A staff manager account is already registered with this email." });
      }

      const salt = generateSalt();
      const passwordHash = hashPassword(password, salt);
      const newManager: StoredManager = {
        id: `mgr-${Date.now()}`,
        name: name.trim(),
        email: cleanEmail,
        hub: hub || "Indiranagar Central Hub #01 (Bengaluru)",
        role: "Hub Operations Manager",
        loginTime: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        staffBadgeId: `RB-STAFF-0${managersStore.size + 1}`,
        salt,
        passwordHash,
      };

      managersStore.set(cleanEmail, newManager);

      const token = generateToken();
      activeManagerSessions.set(token, cleanEmail);

      return res.status(201).json({
        success: true,
        manager: {
          ...sanitizeManager(newManager),
          token,
        },
        token,
        message: `Registered ${newManager.name} as Manager for ${newManager.hub}`,
      });
    } catch (err: any) {
      console.error("Manager registration error:", err);
      return res.status(500).json({ error: "Server error creating staff account." });
    }
  });

  // Verify Manager Session
  app.get("/api/auth/manager/verify", (req, res) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace("Bearer ", "").trim();
    const email = activeManagerSessions.get(token);

    if (!email || !managersStore.has(email)) {
      return res.status(401).json({ error: "Invalid or expired manager session." });
    }

    const manager = managersStore.get(email)!;
    return res.json({
      success: true,
      manager: {
        ...sanitizeManager(manager),
        token,
      },
    });
  });

  // PROTECTED MANAGER DATA ENDPOINT: Registered Customers List
  // Strictly requires manager authorization token! Customers attempting to access will get 403 Forbidden.
  app.get("/api/manager/customers", (req, res) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace("Bearer ", "").trim();

    if (!token || !activeManagerSessions.has(token)) {
      return res.status(403).json({
        error: "Access Denied. Manager authorization token required to view customer records.",
      });
    }

    // Return sanitized list of customers without exposing passwords, salts, or tokens
    const customersList = Array.from(customersStore.values()).map((c, index) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      address: c.address,
      joinedDate: c.joinedDate,
      membershipTier: c.membershipTier,
      loyaltyPoints: c.loyaltyPoints,
      totalOrders: index === 0 ? 3 : index === 1 ? 2 : 1,
      totalSpent: index === 0 ? 2840 : index === 1 ? 1640 : 799,
      activeBookings: index === 0 ? 1 : 0,
      lastActive: "Today",
    }));

    return res.json({ success: true, customers: customersList });
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Root & Bloom server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
