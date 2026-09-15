# 🌱 Root & Bloom

### Where Technology Meets Green Living 🌿

> **Grow it. Design it. Maintain it. Bloom with it.**

Root & Bloom is a digital gardening ecosystem that brings **professional gardening services, landscaping, and gardening products together in one platform**.

Instead of managing garden maintenance, landscaping requirements, and gardening purchases through different places, Root & Bloom connects them into one seamless digital experience.

🌱 **One Platform. One Account. One Garden Journey.**

## Website Link

[Open Root & Bloom in AI Studio](https://ai.studio/apps/563d6876-d918-4f31-9c5a-ff207e4cf586)

## 🌿 What is Root & Bloom?

Root & Bloom is a **hybrid gardening services and retail platform** designed for modern homeowners, businesses, cafes, hotels, offices, and housing communities.

The platform combines two worlds:

🪴 **Gardening Services**

- Garden maintenance
- Custom landscaping
- Professional garden care
- Seasonal maintenance
- Gardening consultation

🛒 **Gardening Marketplace**

- Gardening tools
- Fertilisers
- Pesticides
- Plants and garden essentials
- Garden ornaments

The real idea behind Root & Bloom is simple:

> **Your garden should not need five different places to grow.**

---

# ✨ Why Root & Bloom?

Traditional gardening services often operate separately from gardening product stores. That creates a fragmented experience.

A customer might:

- Find a gardener somewhere else
- Buy fertiliser from another store
- Contact a landscaper separately
- Track maintenance manually
- Search for products every time something runs out

Root & Bloom brings these needs together.

### 🌱 One customer → One account → One connected garden ecosystem

A maintenance customer can purchase gardening products.

A retail customer can discover landscaping services.

A landscaping customer can continue with maintenance after the project is completed.

This creates a **connected customer journey instead of disconnected transactions**.

---

# 🚀 Core Features

## 🏡 Garden Maintenance

Book professional garden maintenance based on your requirements.

The system can manage:

- Service scheduling
- Gardener assignment
- Recurring maintenance
- Service completion records
- Products used during service
- Follow-up requirements

---

## 🎨 Custom Landscaping

Turn your ideas into a garden design.

Customers can submit:

- Garden dimensions
- Budget range
- Reference images
- Style preferences
- Design requirements

The landscaping workflow can move from:

**Enquiry → Estimate → Site Visit → Proposal → Material Reservation → Installation → Completion**

---

## 🛍️ Gardening Marketplace

Everything needed to maintain a beautiful garden.

### Available categories include:

- 🧰 Gardening tools
- 🌱 Fertilisers
- 🪴 Plants and garden essentials
- 🧪 Pesticides
- 🏡 Garden ornaments

Customers can browse products independently or purchase them alongside a service.

---

# 🤖 AI-Powered Garden Visualization

### Imagine it before you build it.

Root & Bloom includes an **AI Visualizer** concept that allows users to provide an original garden or design image and explore a proposed transformation.

The goal is to help customers visualize:

**Current Space → Proposed Garden → Realistic Possibility**

Instead of trying to imagine a landscaping proposal from words alone, customers can get a visual representation of the idea.

---

# 📊 Smart Business Intelligence

Root & Bloom is not just a website. Behind the interface is a digital business information system.

The platform can connect:

**Customer Data** ↓<br>
**Service Data** ↓<br>
**Retail Data** ↓<br>
**Inventory Data** ↓<br>
**Business Intelligence** ↓<br>
**Better Decisions**

This creates a system where every transaction can contribute to better future decisions.

---

# 🧠 From Data → Information → Knowledge → Decisions

Root & Bloom follows a business-information approach.

### DATA

A fertiliser is sold.

↓

### INFORMATION

Fertiliser sales increase during a particular season.

↓

### KNOWLEDGE

The increase happens because of seasonal planting patterns.

↓

### DECISION

Stock more fertiliser before demand increases.

This turns ordinary business activity into actionable intelligence.

---

# ⚙️ Digital Business Systems

### 🔹 TPS — Transaction Processing System

Captures everyday transactions such as:

- Product purchases
- Service bookings
- Completed maintenance visits
- Landscaping enquiries

### 🔹 MIS — Management Information System

Provides management with information such as:

- Maintenance performance
- Product sales
- Inventory levels
- Landscaping enquiries
- Service status

### 🔹 DSS — Decision Support System

Supports decisions such as:

- Landscaping quotations
- Seasonal inventory forecasting
- Reorder decisions
- Resource planning

### 🔹 Integrated Operations System

Connects:

**Scheduling + Services + Inventory + Retail**

So the business can operate using one consistent picture of its operations.

---

# 🔄 How the System Works

### 👤 Customer

Browses services and products<br>
↓<br>
Submits a booking, order, or enquiry<br>
↓<br>
System processes the request<br>
↓<br>
📅 Service / 🛒 Order / 🎨 Landscaping workflow<br>
↓<br>
Inventory and records are updated<br>
↓<br>
Customer receives the service or product<br>
↓<br>
Data becomes available for future decisions

---

# 🌱 The Connected Garden Ecosystem

```text
                         👤 CUSTOMER
                                 │
               ┌───────────┼───────────┐
               ↓           ↓           ↓
         🏡 SERVICES   🛒 RETAIL   🎨 LANDSCAPING
               │           │           │
               └───────────┼───────────┘
                                 ↓
                   ⚙️ CENTRAL SYSTEM
                                 │
               ┌───────────┼───────────┐
               ↓           ↓           ↓
          📅 STAFF    📦 INVENTORY   💳 BILLING
                                 │
                                 ↓
                        📊 BUSINESS DATA
                                 │
                                 ↓
                      🧠 SMART DECISIONS
```

---

# 🛠️ Technology

- React 19 and TypeScript
- Vite 6
- Express 4
- Tailwind CSS 4
- Gemini AI for optional plant-care assistance
- Private backend API with rate limiting and origin validation
- Loopback-only backend binding for local development

## Run Locally

**Prerequisite:** Node.js

```bash
npm install
```

Copy `.env.example` to `.env` and add `GEMINI_API_KEY` if Gemini-backed responses are required. The application includes local fallback responses when no key is configured.

Start the public storefront and private backend together:

```bash
npm run dev
```

The storefront runs at `http://127.0.0.1:3000`. The backend runs privately at `http://127.0.0.1:3001` and is reached through the storefront proxy.

Build the production bundles with:

```bash
npm run lint
npm run build
```

See [docs/architecture.md](docs/architecture.md) for the system boundary and [docs/implementation.md](docs/implementation.md) for the implementation guide.
