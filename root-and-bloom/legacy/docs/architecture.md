# Root & Bloom — Implementation and System Architecture

## 1. Purpose and reference implementation

Root & Bloom is a customer-first gardening platform combining horticultural services, a plant and gardening-products marketplace, plant-care assistance, garden visualisation and operations management in one web application.

This document describes the implementation represented by the AI Studio reference experience:

<https://ai.studio/apps/60f18f14-122d-4548-acfe-c87f6b77a637>

The reference implementation is located at:

```text
root-&-bloom (1) (2)/root-&-bloom (1) (2)/
```

The repository root also contains an earlier React/TanStack prototype. It is retained for project history; the nested implementation is the source of truth for the AI Studio experience described here.

## 2. Product scope and user roles

### Customer

- Browse gardening services, products and landscaping options.
- Create an account, sign in and recover a password.
- Book maintenance, plant-doctor and landscaping services.
- Add products to a cart, check stock, complete checkout and use UPI payment.
- Track orders, bookings, loyalty information and personal garden activity.
- Ask Flora/Dr. Flora for plant-care advice.
- Upload a garden image and generate a proposed visual design.
- View weather-aware recommendations, FAQs and contact information.

### Manager and horticultural operations staff

- Authenticate through the protected manager portal.
- Review operational KPIs and customer activity.
- Manage bookings, order fulfilment and dispatch information.
- Monitor products, stock and low-inventory conditions.
- Manage horticultural operations across delivery hubs.

## 3. Implemented technology stack

| Layer | Implementation | Responsibility |
|---|---|---|
| UI | React 19 + TypeScript | Pages, reusable components and interaction states |
| Build | Vite 6 | Development server and production browser bundle |
| Styling | Tailwind CSS 4 and CSS | Responsive botanical visual system |
| Icons and motion | `lucide-react`, `motion` | Icons, transitions and feedback |
| HTTP server | Express 4 + `tsx` | API endpoints and Vite middleware |
| AI integration | `@google/genai` | Plant diagnosis and conversational support |
| Client state | `AppContext` and React state | Navigation, sessions, cart, modals and UI state |
| Server state | In-memory Maps | Prototype customers, managers and sessions |
| Media generation | Canvas utilities and optional Gemini API | Garden visualizer output |
| Payments | Simulated UPI checkout | Demonstration payment flow |

The implementation is a full-stack prototype. It is not yet a production system because users, sessions, orders and payments are not persisted in a database.

## 4. Repository implementation structure

```text
root-&-bloom (1) (2)/root-&-bloom (1) (2)/
├── server.ts                         Express API and prototype stores
├── index.html                        Browser document shell
├── package.json                      Scripts and dependencies
├── vite.config.ts                    Vite/Tailwind configuration
└── src/
    ├── App.tsx                       Application shell and page switching
    ├── main.tsx                      React entry point
    ├── context/AppContext.tsx        Shared client state and actions
    ├── data/mockData.ts              Seed catalog and business data
    ├── types.ts                      Shared domain types
    ├── components/
    │   ├── Navbar.tsx                Customer navigation and account controls
    │   ├── Footer.tsx                Site footer and links
    │   ├── home/                     Landing page sections
    │   ├── services/                 Service catalogue and booking modal
    │   ├── shop/                     Product catalogue and product details
    │   ├── cart/                     Cart, checkout and UPI payment
    │   ├── auth/                     Customer authentication
    │   ├── admin/                    Manager authentication and portal
    │   ├── dashboard/                My Garden customer dashboard
    │   ├── visualizer/               Garden image transformation workflow
    │   ├── plantai/                  Plant AI interface
    │   ├── landscaping/              Landscaping design workflow
    │   ├── faq/ and contact/          Support content and contact journey
    │   └── LiveChatWidget.tsx        Floating Flora support chat
    ├── services/
    │   ├── geminiService.ts          Client AI request and fallback handling
    │   └── weatherService.ts         Weather request and fallback data
    └── utils/
        ├── imageUtils.ts             Image and botanical fallback assets
        └── visualizerEngine.ts       Canvas-based visualizer transformation
```

## 5. High-level architecture

```text
 Customer browser                         Manager browser
        |                                         |
        +---------------- HTTPS -----------------+
                          |
                   Express + Vite server
                          |
          +---------------+----------------+
          |                                |
   React application                    API layer
          |                                |
   AppContext and UI              +--------+---------+
          |                        |                  |
   local UI/session state     Auth endpoints     AI endpoints
          |                        |                  |
   mockData and workflows    in-memory Maps     Gemini / fallback KB
          |
   Cart, booking, checkout,
   visualizer and dashboard
```

### Runtime responsibilities

1. `main.tsx` mounts `App`.
2. `App` creates `AppProvider` and renders `AppShell`.
3. `AppShell` protects the manager portal and mounts the customer shell.
4. `AppContext` owns cross-page state such as the active page, role, user, cart, bookings, orders, modal visibility and notifications.
5. Components render feature pages and call context actions.
6. AI and weather features call Express endpoints through the browser.
7. Express validates requests, invokes Gemini when configured, and returns a deterministic fallback response when the external service is unavailable.

## 6. Application navigation and feature boundaries

The application uses a single-page navigation model controlled by `page` in `AppContext`. Manager access is additionally recognised through `#manager`, `#admin`, `#portal`, `?role=manager` and `?view=manager`.

| Page/state | Main component | Primary capability |
|---|---|---|
| Home | `HeroSection`, `ServiceCardsSection`, `BestsellersSection` | Product and service discovery |
| Services | `ServicesPage`, `BookingModal` | Select and book a service |
| Shop | `ShopPage`, `ProductDetailModal` | Browse and inspect products |
| Cart | `CartDrawer`, `CheckoutModal` | Validate cart and place an order |
| Payment | `UPIPaymentModal` | Simulated UPI confirmation |
| Visualizer | `GardenVisualizerPage` | Upload and transform a garden image |
| Plant AI | `PlantAIPage` | Botanical diagnosis and recommendations |
| Landscaping | `LandscapingPage` | Design preferences and consultation |
| My Garden | `MyGardenPage` | Account, orders, bookings and care information |
| Manager | `ManagerPortal` | Operations, inventory and performance |
| Support | `FAQPage`, `ContactPage`, `LiveChatWidget` | Self-service and conversational support |

## 7. Core data model

The current prototype seeds domain records in `src/data/mockData.ts` and stores authenticated prototype records in server memory.

```text
Customer 1 ──────── * Booking * ──────── 1 Service
Customer 1 ──────── * Order   1 ──────── * OrderItem * ──────── 1 Product
Customer 1 ──────── * GardenProfile
Booking  0..1 ───── 1 Gardener
Product  1 ──────── 1 InventoryRecord
Customer 1 ──────── * ChatSession
```

### Recommended persistent entities

| Entity | Important fields |
|---|---|
| Customer | id, name, email, phone, address, tier, loyaltyPoints |
| Manager | id, name, email, hub, role, staffBadgeId |
| Service | id, name, category, price, duration, description |
| Gardener | id, name, specialties, zone, rating, availability |
| Booking | id, customerId, serviceId, gardenerId, slot, address, status |
| Product | id, name, category, price, description, image, active |
| Inventory | productId, availableQuantity, reorderPoint, updatedAt |
| Order | id, customerId, items, subtotal, deliveryFee, status, paymentStatus |
| GardenProfile | id, customerId, location, light, plants, imageUrl |
| ChatMessage | id, customerId, sessionId, sender, text, createdAt |

## 8. API contract implemented by `server.ts`

| Endpoint | Purpose |
|---|---|
| `GET /api/health` | Health check and application identity |
| `POST /api/plant-ai` | Plant diagnosis with Gemini or botanical fallback |
| `POST /api/chat` | Flora support chat with Gemini or fallback replies |
| `POST /api/auth/customer/signup` | Create a customer account |
| `POST /api/auth/customer/login` | Authenticate a customer |
| `POST /api/auth/customer/forgot-password` | Issue a prototype reset code |
| `POST /api/auth/customer/reset-password` | Complete password reset |
| `POST /api/auth/customer/profile` | Update customer profile details |
| `POST /api/auth/customer/change-password` | Change a customer password |
| `POST /api/auth/manager/login` | Authenticate a manager |
| `POST /api/auth/manager/register` | Register a manager account |
| `GET /api/auth/customer/me` | Resolve a customer session |
| `GET /api/auth/manager/verify` | Verify a manager session |
| `GET /api/manager/customers` | Return manager-authorized customer data |

The remaining business operations currently run through client-side context actions. A production implementation should expose authenticated booking, catalogue, inventory, order and payment APIs rather than trusting browser state.

## 9. Main user flows

### Booking

```text
Browse services
  -> choose service and slot
  -> provide customer/contact details
  -> validate request
  -> create booking
  -> show confirmation and My Garden status
```

### Retail order

```text
Browse/search products
  -> inspect product details
  -> add quantity to cart
  -> validate stock at checkout
  -> select delivery/payment details
  -> confirm UPI simulation
  -> create order and show tracking state
```

### AI assistance

```text
Customer question and optional garden context
  -> browser POST request
  -> Express validates payload
  -> Gemini response when GEMINI_API_KEY exists
  -> deterministic local fallback otherwise
  -> formatted answer shown in Plant AI or Flora chat
```

### Garden visualizer

```text
Upload image
  -> choose design style
  -> call transformation service when configured
  -> use canvas/fallback rendering when unavailable
  -> display proposed design
```

## 10. Authentication and security implementation

The prototype already demonstrates several useful boundaries:

- Customer and manager credentials are kept separate.
- Passwords are salted and hashed with PBKDF2 before storage in memory.
- Password hashes and salts are removed by `sanitizeCustomer` and `sanitizeManager` before response bodies are returned.
- Random session tokens are generated with Node `crypto`.
- Manager pages are blocked until a manager session is present.
- Input presence, email format and minimum password length are validated.
- API keys are read from environment variables rather than bundled into the browser application.

### Required production hardening

- Replace in-memory accounts and tokens with PostgreSQL and Redis.
- Use secure, HTTP-only, same-site cookies instead of response-body tokens.
- Add CSRF protection, rate limiting, request-size limits and audit logs.
- Never return password-reset codes in API responses.
- Use Argon2id or a managed identity provider for password storage.
- Enforce manager authorization on every server-side manager operation.
- Validate all payloads with a schema library and escape user-generated content.
- Keep payment processing on a PCI-compliant provider; do not store payment data.

## 11. Reliability, observability and recovery

### Current prototype behavior

- AI endpoints fall back to local knowledge when Gemini is unavailable.
- The UI shows toast feedback for success and failure states.
- Health checks expose basic server availability.
- The visualizer has a local rendering fallback.

### Production design

```text
CloudFront/WAF
      |
Static React assets ----> Object storage/CDN
      |
Load balancer ----------> Stateless API containers
                              |
               +--------------+----------------+
               |              |                |
          PostgreSQL       Redis          Object storage
          transactions     sessions       garden images
               |
        Queue/workers -> notifications, AI jobs, fulfilment
```

Recommended controls include structured logs, request IDs, error tracking, metrics for booking and checkout latency, database backups, point-in-time recovery, object versioning and alerts for failed payments or fulfilment.

## 12. Deployment model

### Development

```bash
bun install
bun run dev
```

The Express server starts the Vite development middleware. Set `GEMINI_API_KEY` through the environment when AI responses are required.

### Production prototype build

```bash
bun run build
bun run start
```

Do not commit `.env` files or real credentials.

### Recommended production topology

- Build the React client into immutable static assets.
- Serve assets through a CDN with compression and cache headers.
- Run the Express API as multiple stateless containers.
- Use managed PostgreSQL for transactional data.
- Use Redis for sessions, rate limits and short-lived catalogue caches.
- Use object storage for user images and generated visualizer results.
- Process notifications, image generation and fulfilment asynchronously.

## 13. Scalability plan

### Up to 10,000 registered customers

The current modular monolith is sufficient after replacing in-memory stores with a single managed database and adding basic monitoring.

### Approximately 1 million customers

- Run multiple API instances behind a load balancer.
- Add read replicas and Redis caching for catalogue and dashboard reads.
- Put images and static assets behind a CDN.
- Add queue-backed AI, notifications and order fulfilment.
- Partition operational dashboards by hub and date range.

### Approximately 5 million customers

- Deploy across regions with a clear data-residency strategy.
- Split high-volume domains into identity, catalogue, orders, bookings, inventory, payments and AI services only when traffic justifies it.
- Use event-driven inventory and fulfilment updates.
- Add regional failover, stronger observability and tested disaster recovery.

A well-observed modular monolith should be preferred until measurements justify microservices.

## 14. Testing and acceptance criteria

### Automated tests to add

- Context actions for cart totals, quantity limits and state transitions.
- Authentication validation, password hashing and session expiry.
- Booking validation and duplicate-slot handling.
- Inventory reservation and overselling prevention.
- API fallback behavior when Gemini is absent or fails.
- Manager authorization for every operational mutation.

### Manual acceptance checklist

1. Customer can browse every main page from the navigation.
2. Invalid sign-in and booking input produces useful feedback.
3. Customer can add, update and remove products from the cart.
4. Checkout rejects unavailable stock and confirms a valid order.
5. Customer can view booking/order activity in My Garden.
6. Plant AI and Flora work both with and without a Gemini key.
7. Manager routes require authentication and show operational data.
8. Manager actions cannot be performed by a customer request.
9. Production data survives server restart after database migration.
10. No API key, password, reset code or payment secret appears in the client.

## 15. Known limitations and next implementation steps

1. Move customers, managers, sessions, bookings, orders and inventory from `Map` objects into PostgreSQL.
2. Add server-side APIs for all order, booking and inventory mutations.
3. Replace simulated UPI confirmation with a provider webhook workflow.
4. Store uploaded images in object storage and scan/limit uploads.
5. Add automated tests and CI checks for type safety, security and builds.
6. Add durable session expiry, logout/revocation and role-based authorization.
7. Add privacy consent, data deletion and retention policies.
8. Keep this file synchronized with the implementation and record changes in `docs/project-implementation.md`.

## 16. Summary

Root & Bloom is best implemented as a modular React and Express monolith with clear feature boundaries: customer commerce, service booking, horticultural AI, visualisation, support and manager operations. The current AI Studio version is suitable as a working demonstration because it includes graceful AI fallbacks and a complete customer journey. A production release requires durable persistence, server-authoritative business operations, real payments, secure sessions and automated verification.
