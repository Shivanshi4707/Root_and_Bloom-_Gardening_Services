# 🌱 Root & Bloom

### Where Technology Meets Green Living 🌿

> **Grow it. Design it. Maintain it. Bloom with it.**

Root & Bloom is a digital gardening ecosystem that brings professional gardening services, landscaping, and gardening products together in one platform.

🌱 **One Platform. One Account. One Garden Journey.**

## Website

[Open Root & Bloom in AI Studio](https://ai.studio/apps/563d6876-d918-4f31-9c5a-ff207e4cf586)

## 🌿 What is Root & Bloom?

Root & Bloom is a hybrid gardening services and retail platform for homeowners, businesses, cafes, hotels, offices, and housing communities.

### 🪴 Gardening Services

- Garden maintenance
- Custom landscaping
- Professional garden care
- Seasonal maintenance
- Gardening consultation

### 🛒 Gardening Marketplace

- Gardening tools
- Fertilisers
- Pesticides
- Plants and garden essentials
- Garden ornaments

> **Your garden should not need five different places to grow.**

## 🚀 Core Features

### 🏡 Garden Maintenance

Book professional garden maintenance with service scheduling, gardener assignment, recurring maintenance, completion records, products used during service, and follow-up requirements.

### 🎨 Custom Landscaping

Submit garden dimensions, budget range, reference images, style preferences, and design requirements. The workflow can move from:

**Enquiry → Estimate → Site Visit → Proposal → Material Reservation → Installation → Completion**

### 🛍️ Gardening Marketplace

Browse tools, fertilisers, plants, garden essentials, pesticides, and ornaments independently or alongside a service booking.

### 🤖 AI-Powered Garden Visualization

The Garden Visualizer helps customers explore a proposed transformation from an original garden image:

**Current Space → Proposed Garden → Realistic Possibility**

### 📊 Smart Business Intelligence

The platform connects customer data, service data, retail data, and inventory data so ordinary transactions can support better operational decisions.

## ⚙️ Digital Business Systems

- **TPS:** captures purchases, bookings, maintenance visits, and landscaping enquiries.
- **MIS:** reports maintenance performance, sales, stock, enquiries, and service status.
- **DSS:** supports quotations, seasonal forecasting, reorders, and resource planning.
- **Integrated Operations:** connects scheduling, services, inventory, retail, staff, billing, and business data.

## 🌱 Connected Garden Ecosystem

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

## 🛠️ Technology

- React 19 and TypeScript
- Vite 6
- Express 4
- Tailwind CSS 4
- Gemini AI for optional plant-care assistance
- Private backend API with rate limiting and origin validation
- Loopback-only backend binding for local development

## Installation and Local Setup

### Prerequisites

Install [Node.js](https://nodejs.org/) 20 or newer. Confirm it is available:

```bash
node --version
npm --version
```

### Download the repository

```bash
git clone https://github.com/rsvethavarna/Root_and_Bloom-_Gardening_Services.git
cd Root_and_Bloom-_Gardening_Services/root-and-bloom
```

If you are downloading the project as a ZIP, extract it, open a terminal in the repository folder, and run `cd root-and-bloom`.

### Install dependencies

```bash
npm install
```

Copy the environment template:

```bash
copy .env.example .env
```

On macOS or Linux, use `cp .env.example .env` instead. Add `GEMINI_API_KEY` to `.env` to enable Gemini-backed answers. The website still runs with local fallback answers when no key is configured.

### Start the website

```bash
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000). The public storefront runs on port 3000 and proxies API requests to the private backend on port 3001.

### Build for production

```bash
npm run lint
npm run build
npm run start:backend
```

In a second terminal, start the public server with `npm run start`. For normal development, `npm run dev` starts both processes together.

## Documentation

- [Architecture](architecture.md)
- [Implementation Guide](implementation.md)
- [Documentation Index](docs/README.md)

The active application is inside [`root-and-bloom/`](root-and-bloom/). The `root-and-bloom/legacy/` directory contains archived prototype files and is not part of the active build.
