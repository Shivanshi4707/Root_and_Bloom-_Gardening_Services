# GreenThumb Services — System Architecture

> **Course:** Digital Business Systems | ECD223-3  
> **Assessment:** CIA III — Working Digital Business System  
> **Business Scenario:** Gardening Services & E-Commerce Platform  
> **Repository:** `docs/architecture.md`  
> **Last Updated:** June 2026

---

## Table of Contents

1. [Business Problem and Target Users](#1-business-problem-and-target-users)
2. [Technology Stack](#2-technology-stack)
3. [Current System Architecture Diagram](#3-current-system-architecture-diagram)
4. [System Components](#4-system-components)
5. [Data Flow Between Major Components](#5-data-flow-between-major-components)
6. [Database Design](#6-database-design)
7. [Business Algorithm](#7-business-algorithm)
8. [Current Hosting and Deployment](#8-current-hosting-and-deployment)
9. [Proposed Cloud Deployment Architecture](#9-proposed-cloud-deployment-architecture)
10. [Scalability to 1 Million and 5 Million Users](#10-scalability-to-1-million-and-5-million-users)
11. [Quantitative Scalability Analysis](#11-quantitative-scalability-analysis)
12. [Security](#12-security)
13. [Failure and Recovery](#13-failure-and-recovery)

---

## 1. Business Problem and Target Users

### Business Problem

Urban homeowners, housing societies, and commercial establishments in India need reliable, professional gardening and plant care services but have no structured, technology-enabled platform to find, book, and manage these services. The existing market is dominated by informal, unverified individual gardeners who offer no quality guarantees, no transparency, and no digital convenience.

GreenThumb Services solves this by providing a unified digital platform where customers can:
- Book professional gardening services (maintenance, landscaping, pest control, soil treatment)
- Purchase gardening products (tools, fertilizers, pesticides, seeds, ornaments)
- Manage subscriptions, track gardener arrivals, and review completed work — all digitally

Additionally, business managers need a dashboard to monitor service operations, manage gardeners, track inventory, process orders, and view key business performance indicators.

### Target Users

| User Role | Description | System Access |
|---|---|---|
| **Customer** | Homeowners, housing societies, corporate offices, hotels | Customer portal — booking, shopping, account management |
| **Manager / Admin** | Business operations team, service coordinators | Admin dashboard — operations, KPIs, staff, inventory |

---

## 2. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 + TypeScript | Component-based, type-safe UI |
| **Build Tool** | Vite | Fast development and production builds |
| **Styling** | Tailwind CSS | Utility-first responsive design |
| **UI Components** | shadcn/ui + Lucide React | Accessible component library and icons |
| **Routing** | React Router v6 | Client-side navigation |
| **Form Handling** | React Hook Form | Form state and validation |
| **Backend / API** | Node.js + Express.js | RESTful API, business logic layer |
| **Authentication** | JWT (JSON Web Tokens) | Stateless, role-based session management |
| **Database** | PostgreSQL | Relational persistent data storage |
| **ORM** | Prisma | Type-safe database queries and schema management |
| **File Storage** | AWS S3 (planned) / Local (current) | Store before/after service images |
| **Payment Gateway** | Razorpay | Online payments for bookings and product orders |
| **Email Notifications** | EmailJS / NodeMailer | Booking confirmations and alerts |
| **Maps Integration** | Google Maps Embed API | Location display on contact page |
| **Version Control** | Git + GitHub | Source code management |
| **Hosting (Current)** | Lovable (Frontend) + Render (Backend) | Preview and development deployment |

---

## 3. Current System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│                                                                 │
│   ┌──────────────────────┐    ┌──────────────────────────────┐  │
│   │   Customer Portal    │    │     Manager / Admin Panel    │  │
│   │  (React + Tailwind)  │    │      (React + Tailwind)      │  │
│   │                      │    │                              │  │
│   │ • Home / Landing     │    │ • Dashboard + KPIs           │  │
│   │ • Services Listing   │    │ • Booking Management         │  │
│   │ • Product Shop       │    │ • Order Management           │  │
│   │ • Service Booking    │    │ • Gardener Management        │  │
│   │ • Account / History  │    │ • Inventory Control          │  │
│   └──────────┬───────────┘    └──────────────┬───────────────┘  │
└──────────────┼──────────────────────────────┼───────────────────┘
               │  HTTPS Requests              │  HTTPS Requests
               ▼                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                           │
│                                                                 │
│                   Node.js + Express.js API                      │
│                                                                 │
│   ┌────────────┐  ┌─────────────┐  ┌──────────────────────┐    │
│   │    Auth    │  │  Business   │  │   Route Controllers   │    │
│   │  Module    │  │  Algorithm  │  │                       │    │
│   │  (JWT)     │  │  (Gardener  │  │  /api/bookings        │    │
│   │            │  │  Matching + │  │  /api/products        │    │
│   │  • Login   │  │  Priority   │  │  /api/orders          │    │
│   │  • Register│  │  Scoring)   │  │  /api/users           │    │
│   │  • RBAC    │  │             │  │  /api/admin           │    │
│   └────────────┘  └─────────────┘  └──────────────────────┘    │
│                                                                 │
└───────────────────────────┬─────────────────────────────────────┘
                            │  Prisma ORM Queries
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                               │
│                                                                 │
│              PostgreSQL Relational Database                      │
│                                                                 │
│   Tables: Users | Services | Bookings | Products |             │
│           Orders | OrderItems | Gardeners | Inventory |         │
│           Reviews | Payments                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            │
               ┌────────────┴────────────┐
               ▼                         ▼
┌──────────────────────┐    ┌────────────────────────────────┐
│   External Services  │    │       File Storage             │
│                      │    │                                │
│  • Razorpay (Payments│    │  Service before/after photos   │
│  • Google Maps API   │    │  Product images                │
│  • EmailJS (Email)   │    │  (Local filesystem / AWS S3)   │
│  • WhatsApp Link     │    │                                │
└──────────────────────┘    └────────────────────────────────┘
```

---

## 4. System Components

### 4.1 Frontend — Customer Portal

The customer-facing interface built in React with Tailwind CSS. Communicates with the backend exclusively through REST API calls over HTTPS.

| Page / Component | Function |
|---|---|
| Home (`/`) | Hero banner, service overview cards, testimonials, CTA |
| Services (`/services`) | Full service catalog with pricing tiers and filter |
| Shop (`/shop`) | Product grid with category filter, cart drawer |
| Product Detail (`/shop/:id`) | Single product view with add-to-cart |
| Booking (`/booking`) | Multi-step form: service → date/time → details → confirm |
| My Account (`/account`) | Booking history, order history, subscription status |
| Contact (`/contact`) | Inquiry form, Google Maps embed, WhatsApp link |
| Gallery (`/gallery`) | Before/after project photos |

**User Operations (minimum 3):**
1. Book a gardening service (select service → pick time slot → confirm and pay)
2. Purchase products from the e-commerce shop (add to cart → checkout → pay)
3. View and manage booking/order history from the account dashboard

### 4.2 Frontend — Manager / Admin Panel

Role-protected admin dashboard accessible only to users with the `MANAGER` role (enforced by JWT role claim + backend middleware).

**Management Operations (minimum 3):**
1. View and manage all incoming bookings — approve, assign gardener, mark complete
2. Manage product inventory — update stock levels, add new products, flag low stock
3. View business KPIs — daily revenue, active bookings count, customer satisfaction average

**KPI Indicators (minimum 2):**
- **Total Revenue (Daily / Weekly / Monthly)** — aggregated from confirmed order and booking payments
- **Average Service Rating** — mean rating from all post-service customer reviews

### 4.3 Backend — Node.js + Express API

Stateless RESTful API handling all business logic, authentication, and database interaction.

| API Route Group | Key Endpoints | Function |
|---|---|---|
| `/api/auth` | POST /register, POST /login | JWT issuance, role assignment |
| `/api/bookings` | GET, POST, PUT, DELETE | Full CRUD on service bookings |
| `/api/products` | GET, POST, PUT, DELETE | Product catalog management |
| `/api/orders` | GET, POST, PUT | Order placement and status management |
| `/api/users` | GET, PUT | Customer profile management |
| `/api/admin` | GET /dashboard, GET /kpis | Manager-only aggregated data endpoints |
| `/api/gardeners` | GET, POST, PUT | Gardener profile and assignment management |
| `/api/reviews` | POST, GET | Customer post-service reviews |

### 4.4 Authentication & Authorisation

- **Registration:** User submits email + password → password hashed with `bcrypt` → stored in `Users` table with role (`CUSTOMER` or `MANAGER`)
- **Login:** Credentials verified → JWT issued containing `userId`, `email`, `role`, and expiry (24h)
- **Authorisation:** Every protected API route validates the JWT via middleware. Role-based access control (RBAC) restricts admin endpoints to `MANAGER` role only. Customers cannot access `/api/admin` routes.

### 4.5 Database — PostgreSQL

Persistent relational storage managed via Prisma ORM. All data survives server restarts.

### 4.6 External Services

| Service | Integration Point | Purpose |
|---|---|---|
| Razorpay | Order + Booking checkout | Secure online payment processing |
| Google Maps Embed | Contact page | Show office location visually |
| EmailJS / NodeMailer | Post-booking trigger | Send confirmation emails to customers |
| WhatsApp Business | Contact CTA button | Instant chat for customer queries |

---

## 5. Data Flow Between Major Components

### 5.1 Service Booking Flow

```
Customer fills Booking Form (React)
        │
        │  POST /api/bookings  { serviceId, date, time, customerId }
        ▼
Express Route Controller receives request
        │
        │  Validates JWT token → checks role = CUSTOMER
        ▼
Business Algorithm: Gardener Matching + Priority Scoring
        │
        │  Queries available gardeners → scores by proximity + specialization + rating
        │  Selects best-match gardener → assigns to booking
        ▼
Prisma: INSERT INTO Bookings (customerId, serviceId, gardenerId, date, status='PENDING')
        │
        ▼
PostgreSQL stores booking record
        │
        ▼
API returns booking confirmation { bookingId, gardenerName, confirmedTime }
        │
        ▼
Frontend shows confirmation screen to customer
        │
        ▼
EmailJS sends confirmation email to customer
```

### 5.2 Product Order Flow

```
Customer clicks "Add to Cart" → Cart state updated in React (useCart hook)
        │
Customer proceeds to Checkout → fills delivery details
        │
        │  POST /api/orders  { items[], deliveryAddress, paymentMethod }
        ▼
Express validates request → checks stock availability in Inventory table
        │
Razorpay payment initiated → payment verified via webhook
        │
Prisma: INSERT INTO Orders + OrderItems → UPDATE Inventory (decrement stock)
        │
API returns { orderId, estimatedDelivery }
        │
Frontend shows order success → EmailJS sends order confirmation
```

### 5.3 Admin Dashboard Data Flow

```
Manager logs in → JWT issued with role = MANAGER
        │
        │  GET /api/admin/kpis
        ▼
Express middleware verifies JWT role = MANAGER (rejects CUSTOMER tokens with 403)
        │
Prisma aggregation queries:
  - SUM(payments.amount) WHERE date = today → Daily Revenue
  - AVG(reviews.rating) WHERE createdAt > 30 days ago → Avg Rating
  - COUNT(bookings) WHERE status = 'PENDING' → Active Bookings
        │
        ▼
JSON response returned → React admin dashboard renders KPI cards + tables
```

---

## 6. Database Design

### 6.1 Entity–Relationship Overview

The database contains **10 entities** with **5+ meaningful relationships**.

```
Users ────────────< Bookings >──────── Services
  │                    │
  │                    └──────────── Gardeners
  │
  └────────────< Orders >──────── OrderItems >──── Products
                                                        │
                                                    Inventory

Users ──────────< Reviews >──────── Services
Bookings ──────< Payments
```

### 6.2 Core Tables

**Users**
```
userId       INT PRIMARY KEY AUTO_INCREMENT
name         VARCHAR(100)   NOT NULL
email        VARCHAR(150)   UNIQUE NOT NULL
passwordHash VARCHAR(255)   NOT NULL
phone        VARCHAR(15)
role         ENUM('CUSTOMER','MANAGER')  DEFAULT 'CUSTOMER'
address      TEXT
createdAt    TIMESTAMP      DEFAULT NOW()
```

**Services**
```
serviceId    INT PRIMARY KEY AUTO_INCREMENT
name         VARCHAR(100)   NOT NULL
description  TEXT
category     ENUM('MAINTENANCE','LANDSCAPING','PEST_CONTROL','SOIL_TREATMENT')
basePrice    DECIMAL(10,2)  NOT NULL
durationMins INT
isActive     BOOLEAN        DEFAULT TRUE
```

**Bookings**
```
bookingId    INT PRIMARY KEY AUTO_INCREMENT
customerId   INT  FOREIGN KEY → Users(userId)
serviceId    INT  FOREIGN KEY → Services(serviceId)
gardenerId   INT  FOREIGN KEY → Gardeners(gardenerId)
scheduledAt  DATETIME  NOT NULL
status       ENUM('PENDING','CONFIRMED','IN_PROGRESS','COMPLETED','CANCELLED')
totalAmount  DECIMAL(10,2)
notes        TEXT
createdAt    TIMESTAMP  DEFAULT NOW()
```

**Products**
```
productId    INT PRIMARY KEY AUTO_INCREMENT
name         VARCHAR(150)  NOT NULL
description  TEXT
category     ENUM('TOOLS','FERTILIZERS','PESTICIDES','SEEDS','ORNAMENTS')
price        DECIMAL(10,2) NOT NULL
imageUrl     VARCHAR(255)
isActive     BOOLEAN       DEFAULT TRUE
```

**Orders**
```
orderId      INT PRIMARY KEY AUTO_INCREMENT
customerId   INT  FOREIGN KEY → Users(userId)
totalAmount  DECIMAL(10,2)  NOT NULL
status       ENUM('PLACED','PROCESSING','SHIPPED','DELIVERED','CANCELLED')
deliveryAddr TEXT
createdAt    TIMESTAMP DEFAULT NOW()
```

**OrderItems**
```
itemId       INT PRIMARY KEY AUTO_INCREMENT
orderId      INT  FOREIGN KEY → Orders(orderId)
productId    INT  FOREIGN KEY → Products(productId)
quantity     INT  NOT NULL
unitPrice    DECIMAL(10,2) NOT NULL
```

**Gardeners**
```
gardenerId   INT PRIMARY KEY AUTO_INCREMENT
name         VARCHAR(100)  NOT NULL
phone        VARCHAR(15)
specialization VARCHAR(100)
rating       DECIMAL(3,2)  DEFAULT 5.00
isAvailable  BOOLEAN       DEFAULT TRUE
zone         VARCHAR(50)
```

**Inventory**
```
inventoryId  INT PRIMARY KEY AUTO_INCREMENT
productId    INT  FOREIGN KEY → Products(productId)  UNIQUE
stockQty     INT  NOT NULL DEFAULT 0
reorderPoint INT  DEFAULT 10
lastUpdated  TIMESTAMP DEFAULT NOW()
```

**Reviews**
```
reviewId     INT PRIMARY KEY AUTO_INCREMENT
customerId   INT  FOREIGN KEY → Users(userId)
bookingId    INT  FOREIGN KEY → Bookings(bookingId)
rating       INT  CHECK (rating BETWEEN 1 AND 5)
comment      TEXT
createdAt    TIMESTAMP DEFAULT NOW()
```

**Payments**
```
paymentId       INT PRIMARY KEY AUTO_INCREMENT
bookingId       INT  FOREIGN KEY → Bookings(bookingId)  NULLABLE
orderId         INT  FOREIGN KEY → Orders(orderId)      NULLABLE
amount          DECIMAL(10,2) NOT NULL
status          ENUM('PENDING','SUCCESS','FAILED','REFUNDED')
razorpayId      VARCHAR(100)
transactedAt    TIMESTAMP DEFAULT NOW()
```

---

## 7. Business Algorithm

### Gardener Matching and Priority Scoring

**Problem Being Solved:**
When a customer books a service, the system must automatically select the best available gardener. Assigning any random available gardener results in poor-quality service and low ratings. The algorithm selects the optimal match based on multiple weighted criteria.

**Inputs:**
- `serviceId` — the type of service requested (e.g., LANDSCAPING, PEST_CONTROL)
- `scheduledAt` — requested date and time slot
- `customerZone` — the customer's locality/zone (derived from their address)

**Processing Logic:**
1. Query all gardeners where `isAvailable = TRUE`
2. Filter to gardeners whose `specialization` matches the requested service category
3. Filter to gardeners not already assigned a booking in the same time slot
4. For each remaining gardener, compute a **Priority Score**:

```
Priority Score = (Rating Weight × gardener.rating)
               + (Zone Weight × zoneMatch)
               + (Workload Weight × (1 - dailyJobCount / maxDailyJobs))

Where:
  Rating Weight  = 0.5
  Zone Weight    = 0.3   (1 if gardener.zone = customerZone, else 0)
  Workload Weight = 0.2
  maxDailyJobs   = 6
```

5. Select the gardener with the **highest Priority Score**
6. Assign that gardener to the booking and set `isAvailable = FALSE` for that slot

**Output:**
- `gardenerId` of the selected gardener
- Booking record created with `gardenerId` assigned and `status = 'CONFIRMED'`

**Pseudocode:**
```
FUNCTION matchGardener(serviceId, scheduledAt, customerZone):
  candidates = DB.query(
    "SELECT * FROM Gardeners
     WHERE isAvailable = TRUE
     AND specialization = getCategory(serviceId)
     AND gardenerId NOT IN (
       SELECT gardenerId FROM Bookings
       WHERE scheduledAt = scheduledAt AND status != 'CANCELLED'
     )"
  )

  IF candidates is empty:
    RETURN error "No gardeners available for this slot"

  FOR each gardener IN candidates:
    zoneMatch = IF gardener.zone == customerZone THEN 1 ELSE 0
    dailyJobs = DB.count(Bookings WHERE gardenerId = gardener.id AND date = today)
    score = (0.5 × gardener.rating)
          + (0.3 × zoneMatch)
          + (0.2 × (1 - dailyJobs / 6))
    gardener.score = score

  bestGardener = candidate with MAX(score)
  RETURN bestGardener.gardenerId
```

**Where Implemented:** `src/algorithms/gardenerMatching.js` — called from `POST /api/bookings` controller

**Example Input:**
```json
{
  "serviceId": 3,
  "scheduledAt": "2026-06-15T10:00:00",
  "customerZone": "Koramangala"
}
```

**Example Output:**
```json
{
  "gardenerId": 7,
  "gardenerName": "Ravi Kumar",
  "score": 4.35,
  "zone": "Koramangala",
  "rating": 4.8
}
```

---

## 8. Current Hosting and Deployment

| Component | Current Host | URL |
|---|---|---|
| Frontend (React) | Lovable | Auto-generated preview URL |
| Backend (Node.js API) | Render (free tier) | `https://greenthumb-api.onrender.com` |
| Database (PostgreSQL) | Render Postgres / Supabase | Managed instance |
| File Storage | Local filesystem (dev) | Migrating to AWS S3 |

### Deployment Flow

```
Developer pushes code to GitHub (main branch)
        │
        ├──► Lovable detects push → rebuilds React frontend → live in ~60 seconds
        │
        └──► Render detects push → rebuilds Node.js API → live in ~2 minutes
```

### Build Commands

```bash
# Frontend
npm run dev          # Development server → localhost:5173
npm run build        # Production build → /dist folder
npm run preview      # Preview production build locally

# Backend
npm run start        # Start Express server → localhost:3000
npm run dev          # Start with nodemon (auto-restart on file change)
npx prisma migrate dev   # Apply database schema changes
npx prisma studio        # Visual database browser
```

---

## 9. Proposed Cloud Deployment Architecture

For production at scale, GreenThumb would be deployed on **Amazon Web Services (AWS)** using the following architecture:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            USERS (Global)                               │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    AWS CloudFront (CDN)                                 │
│         Global edge caching — serves static React build files           │
│         from 400+ edge locations worldwide → low latency for all users  │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌─────────────────────┐           ┌───────────────────────┐
│   AWS S3 (Static)   │           │  AWS Route 53 (DNS)   │
│  React build files  │           │  Domain management    │
│  Product images     │           │  Health-check routing │
│  Service photos     │           └───────────┬───────────┘
└─────────────────────┘                       │
                                              ▼
                              ┌───────────────────────────┐
                              │  AWS Application Load     │
                              │  Balancer (ALB)           │
                              │  Distributes API traffic  │
                              │  across EC2 instances     │
                              └──────────────┬────────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    ▼                        ▼                        ▼
          ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
          │  EC2 Instance 1  │    │  EC2 Instance 2  │    │  EC2 Instance N  │
          │  Node.js API     │    │  Node.js API     │    │  Node.js API     │
          │  (Auto Scaling)  │    │  (Auto Scaling)  │    │  (Auto Scaling)  │
          └────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘
                   └────────────────┬───────────────────────────────┘
                                    │
                    ┌───────────────┴──────────────────┐
                    ▼                                  ▼
        ┌───────────────────────┐        ┌─────────────────────────┐
        │  AWS RDS PostgreSQL   │        │  AWS ElastiCache        │
        │  Primary (Write)      │        │  (Redis)                │
        │  Read Replicas ×3     │        │  Session caching        │
        │  Multi-AZ Failover    │        │  Query result caching   │
        └───────────────────────┘        │  Rate limiting data     │
                                         └─────────────────────────┘
```

### AWS Services Used

| AWS Service | Purpose |
|---|---|
| **CloudFront** | Global CDN — cache and serve static frontend from edge nodes near users |
| **S3** | Store React build files, product images, service before/after photos |
| **Route 53** | DNS management, health-check-based routing, failover configuration |
| **Application Load Balancer** | Distribute incoming API requests across multiple EC2 instances |
| **EC2 + Auto Scaling Group** | Host Node.js API instances; automatically add/remove instances based on CPU/request load |
| **RDS PostgreSQL** | Managed relational database — Multi-AZ deployment, automated backups, read replicas |
| **ElastiCache (Redis)** | In-memory caching for frequent queries (KPI dashboards, product listings), session storage |
| **SES (Simple Email Service)** | Send booking confirmations and order notifications at scale |
| **WAF (Web Application Firewall)** | Block SQL injection, XSS, DDoS at the network edge |
| **CloudWatch** | Application monitoring, performance metrics, error alerting |
| **AWS Secrets Manager** | Securely store and rotate API keys, DB credentials, JWT secrets |

---

## 10. Scalability to 1 Million and 5 Million Users

### Scaling to 1,000,000 Users

| Layer | Scaling Strategy |
|---|---|
| **Frontend** | CloudFront CDN serves all static assets from global edge nodes. React build is cached — no server load for page views. |
| **Application** | EC2 Auto Scaling Group maintains 10–20 Node.js instances. ALB distributes traffic. New instances launch automatically when CPU > 70%. |
| **Database** | RDS PostgreSQL with 3 read replicas. All GET queries (product listings, booking history) routed to read replicas. Only writes go to the primary instance. |
| **Caching** | ElastiCache Redis caches popular product listings, KPI aggregations, and gardener availability for 5 minutes. Eliminates repetitive database queries. |
| **Traffic Management** | ALB with health checks. Unhealthy instances removed automatically. Route 53 with latency-based routing directs users to the nearest AWS region. |
| **Storage** | S3 with CloudFront — unlimited scalable file storage for images. No storage bottleneck. |
| **Security** | AWS WAF filters malicious traffic before it reaches EC2. Rate limiting via Redis prevents API abuse. |

### Scaling to 5,000,000 Users

| Layer | Additional Scaling at 5M |
|---|---|
| **Multi-Region** | Deploy across 3 AWS regions (Mumbai, Singapore, Frankfurt). Route 53 geolocation routing sends each user to their nearest region. |
| **Database** | Migrate to Amazon Aurora PostgreSQL — up to 15 read replicas, 5× throughput vs. standard RDS, auto-scaling storage. Horizontal sharding by customer geography. |
| **Microservices** | Break monolithic Express API into independent microservices: `booking-service`, `product-service`, `payment-service`, `user-service`. Each scales independently. Deploy on AWS ECS (Fargate containers). |
| **Message Queue** | Introduce AWS SQS for async processing — booking confirmation emails, inventory updates, and review processing handled in background queues, not in the API request cycle. |
| **Caching** | Expanded Redis cluster with replication. Cache product catalogs, gardener availability grids, and aggregated KPIs with smart invalidation. |
| **CDN** | S3 + CloudFront with aggressive caching rules. All product images, thumbnails, and static assets cached at edge for 30 days. |
| **Monitoring** | CloudWatch dashboards + AWS X-Ray distributed tracing. Automatic alerting on error rate spikes, latency degradation, and database connection pool exhaustion. |
| **Backup** | RDS automated daily snapshots retained for 35 days. Point-in-time recovery to any second within the retention window. Cross-region backup replication. |

---

## 11. Quantitative Scalability Analysis

### 11.1 User Growth Projection (25% per year, starting 10,000 users)

**Formula:** Users(n) = Initial × (1 + growth_rate)^n

| Year | Formula | Calculation | Registered Users |
|---|---|---|---|
| Year 0 (Now) | 10,000 | Baseline | **10,000** |
| Year 1 | 10,000 × 1.25^1 | 10,000 × 1.25 | **12,500** |
| Year 2 | 10,000 × 1.25^2 | 10,000 × 1.5625 | **15,625** |
| Year 3 | 10,000 × 1.25^3 | 10,000 × 1.9531 | **19,531** |
| Year 4 | 10,000 × 1.25^4 | 10,000 × 2.4414 | **24,414** |
| Year 5 | 10,000 × 1.25^5 | 10,000 × 3.0518 | **30,518** |

**Interpretation:** At 25% annual growth, the user base triples from 10,000 to ~30,500 in 5 years. This growth is manageable on current infrastructure but signals the need for a database migration plan around Year 3–4.

---

### 11.2 Peak Concurrent Users (10% of registered users active simultaneously)

**Formula:** Peak Concurrent Users = Registered Users × 0.10

| Registered Users | Formula | Peak Concurrent Users |
|---|---|---|
| 100,000 | 100,000 × 0.10 | **10,000** |
| 500,000 | 500,000 × 0.10 | **50,000** |
| 1,000,000 | 1,000,000 × 0.10 | **100,000** |
| 5,000,000 | 5,000,000 × 0.10 | **500,000** |

**Interpretation:** At 1 million registered users, 100,000 users are active simultaneously during peak (e.g., Sunday morning booking rush). This requires a load-balanced, auto-scaling API layer. At 5 million users, 500,000 concurrent users demand multi-region deployment and microservices architecture to maintain response times under 200ms.

---

### 11.3 Requests Per Minute and Per Second (5 requests/user/minute during peak)

**Formula:**
- Requests Per Minute (RPM) = Active Users × 5
- Requests Per Second (RPS) = RPM ÷ 60

| Active Users | RPM Formula | RPM | RPS Formula | RPS |
|---|---|---|---|---|
| 10,000 | 10,000 × 5 | 50,000 RPM | 50,000 ÷ 60 | **~833 RPS** |
| 50,000 | 50,000 × 5 | 250,000 RPM | 250,000 ÷ 60 | **~4,167 RPS** |
| 100,000 | 100,000 × 5 | 500,000 RPM | 500,000 ÷ 60 | **~8,333 RPS** |
| 500,000 | 500,000 × 5 | 2,500,000 RPM | 2,500,000 ÷ 60 | **~41,667 RPS** |

**Interpretation:**

- **833 RPS (10,000 active users):** Comfortably handled by 2–3 Node.js EC2 instances. A single EC2 t3.medium handles ~500–1,000 RPS.
- **4,167 RPS (50,000 active users):** Requires 8–10 EC2 instances with load balancing and Redis caching for database query offload.
- **8,333 RPS (100,000 active users):** Demands auto-scaling EC2 group (15–20 instances), aggressive caching, and read replicas on the database to prevent query bottlenecks.
- **41,667 RPS (500,000 active users):** Requires a full microservices architecture across multiple AWS regions, Aurora database with sharding, a CDN-first static serving strategy, and an async message queue for non-critical operations.

---

## 12. Security

| # | Security Mechanism | Component | Purpose | Threat Addressed |
|---|---|---|---|---|
| 1 | **JWT Authentication** | Backend API | Verifies user identity on every request; stateless token expires in 24h | Unauthorised access, session hijacking |
| 2 | **Role-Based Access Control (RBAC)** | Backend middleware | Restricts admin endpoints to MANAGER role; customers cannot access admin routes | Privilege escalation, unauthorised data access |
| 3 | **Password Hashing (bcrypt)** | Auth module | Passwords hashed with salt rounds=12 before storage; never stored in plaintext | Credential theft from database breach |
| 4 | **HTTPS / TLS Encryption** | Network layer | All client-server communication encrypted in transit | Man-in-the-middle attacks, data interception |
| 5 | **Environment Variables for Secrets** | Deployment config | API keys, JWT secret, DB credentials stored in `.env` / AWS Secrets Manager — never hardcoded | Credential exposure in source code |
| 6 | **SQL Injection Prevention** | Prisma ORM | Parameterised queries used exclusively — user input never concatenated into raw SQL | SQL injection attacks on the database |
| 7 | **AWS WAF (Web Application Firewall)** | Cloud network | Filters XSS, SQLi, and volumetric DDoS traffic before it reaches application servers | Cross-site scripting, injection, DDoS |
| 8 | **Rate Limiting (Redis)** | API middleware | Each IP limited to 100 requests/minute; Razorpay webhook endpoints limited to verified source IPs | Brute-force login attacks, API abuse |
| 9 | **Database Backup & Recovery** | RDS | Automated daily snapshots with 35-day retention; point-in-time recovery enabled | Data loss from corruption or accidental deletion |
| 10 | **Audit Logging (CloudWatch)** | Application + infrastructure | All admin actions, login events, and payment transactions logged with timestamp and user ID | Insider threats, regulatory compliance, forensics |

---

## 13. Failure and Recovery

| Failure Type | Failure Scenario | Impact | Detection | Recovery |
|---|---|---|---|---|
| **Application / Server** | EC2 instance crashes due to memory leak or unhandled exception | Portion of API requests begin failing (502 errors for affected instance) | AWS ALB health checks mark instance unhealthy within 30 seconds; CloudWatch alarm fires | ALB automatically stops routing traffic to failed instance; Auto Scaling Group launches replacement EC2 within 3–5 minutes; zero manual intervention required |
| **Database** | PostgreSQL primary instance fails (disk corruption or hardware fault) | All write operations fail; read operations continue via read replicas | RDS Multi-AZ health check detects failure within 60 seconds; CloudWatch metric `DatabaseConnections` drops to 0 | RDS automatically promotes standby instance in secondary AZ to primary; DNS endpoint updated; reconnection within 60–120 seconds; zero data loss due to synchronous replication |
| **Network** | AWS Availability Zone network outage | Services hosted in that AZ become unreachable for affected users | Route 53 health checks fail for affected endpoint within 10 seconds; ALB stops routing to affected AZ | Route 53 failover routing redirects traffic to healthy AZ automatically; EC2 Auto Scaling adds instances in healthy AZs; cross-region deployment (at 5M scale) provides regional failover |
| **Storage** | S3 bucket accidentally emptied (human error deletes product images) | Product pages display broken images; customer trust impacted | CloudWatch S3 object count metric drops sharply; error logs show 404s for image URLs | S3 Versioning enabled — deleted objects recoverable from previous version within minutes; S3 Cross-Region Replication provides backup copy in secondary region; restore from version history via AWS Console or CLI |
| **Security** | JWT secret compromised — attacker generates valid admin tokens | Unauthorised admin access; potential data exfiltration or record manipulation | Anomalous admin API activity detected by CloudWatch; unusual volume of admin reads at odd hours triggers alert | Immediately rotate JWT secret in AWS Secrets Manager → all existing tokens invalidated instantly → all users forced to re-authenticate → audit logs reviewed to identify actions taken with compromised tokens → affected records audited and corrected |

---

*GreenThumb Services Pvt. Ltd. — CIA III | ECD223-3 | Digital Business Systems*
