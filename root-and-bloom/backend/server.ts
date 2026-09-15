import express from "express";
import crypto from "node:crypto";
import { GoogleGenAI } from "@google/genai";
import rateLimit from "express-rate-limit";
import "dotenv/config";

const PORT = Number(process.env.BACKEND_PORT || 3001);
const EDITOR_INVITE_CODE = process.env.EDITOR_INVITE_CODE?.trim();

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

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

const customersStore = new Map<string, StoredCustomer>();
const managersStore = new Map<string, StoredManager>();
const activeCustomerSessions = new Map<string, string>();
const activeManagerSessions = new Map<string, string>();
const passwordResetTokens = new Map<string, { code: string; expiresAt: number }>();

function sanitizeCustomer(cust: StoredCustomer) {
  const { passwordHash, salt, ...safe } = cust;
  return safe;
}

function sanitizeManager(mgr: StoredManager) {
  const { passwordHash, salt, ...safe } = mgr;
  return safe;
}

function requireManager(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "").trim();
  const email = activeManagerSessions.get(token);

  if (!email || !managersStore.has(email)) {
    return res.status(401).json({ error: "Editor authorization required." });
  }

  res.locals.managerEmail = email;
  return next();
}

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

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "100kb" }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { error: "Too many requests. Please try again shortly." },
  }),
);

app.use((req, res, next) => {
  const allowedOrigin = process.env.PUBLIC_ORIGIN;
  const requestOrigin = req.headers.origin;
  if (allowedOrigin && requestOrigin && requestOrigin !== allowedOrigin) {
    return res.status(403).json({ error: "Origin is not allowed." });
  }
  return next();
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "Root & Bloom Garden Co." });
});

app.post("/api/plant-ai", async (req, res) => {
  const { message, history, gardenContext } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { "User-Agent": "aistudio-build" } },
      });

      const promptText = `User Query: "${message || "Tell me how to take care of balcony plants"}"
${gardenContext ? `User Garden Context: ${JSON.stringify(gardenContext)}` : ""}
Recent Chat: ${Array.isArray(history) ? history.slice(-4).map((h: any) => `${h.sender}: ${h.text}`).join("\n") : ""}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: promptText,
        config: {
          systemInstruction: `You are "Dr. Flora"...`,
          temperature: 0.7,
        },
      });

      return res.json({ reply: response.text || "I recommend checking soil moisture.", source: "gemini" });
    } catch (err: any) {
      console.error("Gemini API error:", err?.message);
    }
  }

  const q = (message || "").toLowerCase();
  let reply = "**Plant Care Recommendation** 🌿\n\nFor thriving greenery in your garden:\n• Sunlight: Most foliage plants prefer bright indirect sunlight.\n• Soil Mix: Use a balanced potting mix with compost and perlite.\n• Air Circulation: Avoid crowding plants against walls.";

  if (q.includes("yellow") || q.includes("leaves turning")) {
    reply = "**Diagnosis: Chlorosis / Leaf Yellowing** 🌿\n\n1. Check for overwatering.\n2. Ensure drainage is clear.\n3. Add organic compost or a nitrogen source.";
  } else if (q.includes("water") || q.includes("how often")) {
    reply = "**Smart Watering Protocol** 💧\n\nCheck the top 1.5 inches of soil before watering. Water deeply when dry, especially in summer.";
  }

  return res.json({ reply, source: "knowledge-base" });
});

app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { "User-Agent": "aistudio-build" } },
      });

      const recentHistory = Array.isArray(history)
        ? history.slice(-6).map((h: any) => `${h.sender === "user" ? "Customer" : "Flora"}: ${h.text}`).join("\n")
        : "";

      const prompt = `${recentHistory ? `Conversation History:\n${recentHistory}\n` : ""}Customer: ${message || "Hello"}\nFlora:`;
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: { systemInstruction: `You are Flora...`, temperature: 0.7 },
      });
      return res.json({ reply: response.text || "Hello! 🌿 Welcome to Root & Bloom.", source: "gemini" });
    } catch (err: any) {
      console.error("Gemini Chat API error:", err?.message);
    }
  }

  const clean = (message || "").toLowerCase().trim();
  let reply = "Hello! 🌿 Welcome to Root & Bloom Garden Co. How can I help with plant care or service booking today?";
  if (clean.includes("hello") || clean.includes("hi") || clean.includes("namaste")) {
    reply = "Namaste! 🌿 Welcome to Root & Bloom. Ask me about plant care, gardening help, or 35-minute essentials delivery.";
  } else if (clean.includes("service") || clean.includes("book") || clean.includes("gardener")) {
    reply = "We offer Routine Garden Maintenance, Plant Doctor diagnostics, and balcony transformations starting at ₹799.";
  }

  return res.json({ reply, source: "fallback" });
});

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
      return res.status(409).json({ error: "An account with this email already exists." });
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
      loyaltyPoints: 100,
      salt,
      passwordHash,
    };
    customersStore.set(cleanEmail, newCustomer);
    const token = generateToken();
    activeCustomerSessions.set(token, cleanEmail);

    return res.status(201).json({ success: true, user: sanitizeCustomer(newCustomer), token, message: "Account created successfully!" });
  } catch (err: any) {
    console.error("Customer signup error:", err);
    return res.status(500).json({ error: "Server error creating account." });
  }
});

app.post("/api/auth/customer/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Please provide both email and password." });
    }
    const cleanEmail = email.trim().toLowerCase();
    const customer = customersStore.get(cleanEmail);
    if (!customer) {
      return res.status(401).json({ error: "No account found with this email." });
    }
    const computedHash = hashPassword(password, customer.salt);
    if (computedHash !== customer.passwordHash) {
      return res.status(401).json({ error: "Incorrect password." });
    }
    const token = generateToken();
    activeCustomerSessions.set(token, cleanEmail);
    return res.json({ success: true, user: sanitizeCustomer(customer), token, message: `Welcome back, ${customer.name}!` });
  } catch (err: any) {
    console.error("Customer login error:", err);
    return res.status(500).json({ error: "Server error during authentication." });
  }
});

app.post("/api/auth/customer/forgot-password", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Please enter your registered email address." });
  }
  const cleanEmail = email.trim().toLowerCase();
  const customer = customersStore.get(cleanEmail);
  if (!customer) {
    return res.status(404).json({ error: "No account found with this email." });
  }
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 15 * 60 * 1000;
  passwordResetTokens.set(cleanEmail, { code, expiresAt });
  return res.json({ success: true, message: `Password reset verification code sent to ${cleanEmail}. (Code: ${code})`, resetCode: code });
});

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
      return res.status(400).json({ error: "Verification code has expired." });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters long." });
    }
    const newSalt = generateSalt();
    customer.salt = newSalt;
    customer.passwordHash = hashPassword(newPassword, newSalt);
    customersStore.set(cleanEmail, customer);
    passwordResetTokens.delete(cleanEmail);

    return res.json({ success: true, message: "Password has been successfully updated!" });
  } catch (err: any) {
    console.error("Password reset error:", err);
    return res.status(500).json({ error: "Unable to reset password." });
  }
});

app.post("/api/auth/customer/profile", (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace("Bearer ", "").trim();
    const email = activeCustomerSessions.get(token);
    const customer = email ? customersStore.get(email) : null;

    if (!customer) {
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

    return res.json({ success: true, user: sanitizeCustomer(customer), message: "Profile preferences updated successfully." });
  } catch (err: any) {
    console.error("Profile update error:", err);
    return res.status(500).json({ error: "Unable to update profile." });
  }
});

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

    return res.json({ success: true, message: "Your password has been changed securely." });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to change password." });
  }
});

app.get("/api/auth/customer/me", (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "").trim();
  const email = activeCustomerSessions.get(token);
  if (!email || !customersStore.has(email)) {
    return res.status(401).json({ error: "No active session." });
  }
  return res.json({ success: true, user: sanitizeCustomer(customersStore.get(email)!) });
});

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
    if (hub) manager.hub = hub;
    manager.loginTime = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    const token = generateToken();
    activeManagerSessions.set(token, cleanEmail);
    return res.json({ success: true, manager: { ...sanitizeManager(manager), token }, token, message: `Manager session authorized. Connected to ${manager.hub}.` });
  } catch (err: any) {
    console.error("Manager login error:", err);
    return res.status(500).json({ error: "Server error during manager login." });
  }
});

app.post("/api/auth/manager/register", (req, res) => {
  try {
    const { name, email, password, hub, staffPasscode } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All staff registration fields are required." });
    }
    if (!EDITOR_INVITE_CODE) {
      return res.status(503).json({ error: "Editor registration is disabled. Configure EDITOR_INVITE_CODE on the backend." });
    }
    const cleanCode = (staffPasscode || "").trim();
    if (cleanCode !== EDITOR_INVITE_CODE) {
      return res.status(403).json({ error: "Invalid editor invitation code." });
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
    return res.status(201).json({ success: true, manager: { ...sanitizeManager(newManager), token }, token, message: `Registered ${newManager.name} as Manager for ${newManager.hub}` });
  } catch (err: any) {
    console.error("Manager registration error:", err);
    return res.status(500).json({ error: "Server error creating staff account." });
  }
});

app.get("/api/auth/manager/verify", requireManager, (req, res) => {
  const token = (req.headers.authorization || "").replace("Bearer ", "").trim();
  const manager = managersStore.get(res.locals.managerEmail);
  return res.json({ success: true, manager: { ...sanitizeManager(manager!), token } });
});

app.get("/api/manager/customers", requireManager, (_req, res) => {
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

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Root & Bloom backend running on http://127.0.0.1:${PORT}`);
});

export default app;
