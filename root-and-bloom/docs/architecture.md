# Root & Bloom — Architecture

## 1. Architectural goals

The application provides one digital experience for garden services, retail products, plant-care guidance and horticultural operations. The architecture keeps customer features modular while allowing the prototype to grow into a secure, persistent production platform.

## 2. Current architecture

```text
Customer browser                     Manager browser
   |                                     |
   +------------- HTTPS ----------------+
         |
       Public storefront :3000
         React + Vite + proxy
         |
         localhost-only API
         |
      Private backend :3001
         |
   +-----------------+-----------------+
   |                                   |
 Auth, AI and manager routes        In-memory prototype stores
   |                                   |
  Gemini API or local fallback       Sanitized responses
```

### Runtime sequence

1. `main.tsx` mounts `App`.
2. `App` creates `AppProvider` and renders `AppShell`.
3. `AppShell` selects the customer or manager experience.
4. `AppContext` coordinates navigation, sessions, cart, bookings, orders, modals and notifications.
5. Feature components render pages and invoke context actions.
6. AI and account features call Express endpoints.
7. The public storefront proxies `/api` requests to the private backend process.
8. The backend validates requests and uses Gemini or deterministic fallback logic.

The backend binds to `127.0.0.1` and is not directly reachable from the network. In production, only the public storefront or an equivalent reverse proxy is exposed.

## 3. Source architecture

```text
src/
├── App.tsx                       application shell and page switching
├── main.tsx                      React entry point
├── types.ts                      shared domain types
├── context/AppContext.tsx        shared client state and actions
├── data/mockData.ts              seeded catalog and business data
├── components/
│   ├── home/                     landing page
│   ├── services/                 services and booking
│   ├── shop/                     products and details
│   ├── cart/                     cart, checkout and payment
│   ├── auth/                     customer authentication
│   ├── admin/                    manager authentication and portal
│   ├── dashboard/                My Garden
│   ├── visualizer/               garden image design
│   ├── plantai/                  plant-care AI
│   ├── landscaping/              design consultation
│   ├── faq/ and contact/         customer support
│   └── LiveChatWidget.tsx        Flora chat
├── services/
│   ├── geminiService.ts          AI client and fallback handling
│   └── weatherService.ts         weather data and fallback handling
└── utils/
    ├── imageUtils.ts             image helpers and fallbacks
    └── visualizerEngine.ts       canvas visualizer engine
```

## 4. Domain model

```text
Customer 1 ───── * Booking * ───── 1 Service
Customer 1 ───── * Order   1 ───── * OrderItem * ───── 1 Product
Booking  0..1 ── 1 Gardener
Product  1 ───── 1 InventoryRecord
Customer 1 ───── * GardenProfile
Customer 1 ───── * ChatSession
```

Core entities are `Customer`, `Manager`, `Service`, `Gardener`, `Booking`, `Product`, `Inventory`, `Order`, `OrderItem`, `GardenProfile` and `ChatMessage`.

## 5. API boundary

| API | Responsibility |
|---|---|
| `GET /api/health` | Health check |
| `POST /api/plant-ai` | Plant diagnosis and recommendations |
| `POST /api/chat` | Conversational Flora support |
| `/api/auth/customer/*` | Customer account and session operations |
| `/api/auth/manager/*` | Manager account and verification operations |
| `GET /api/manager/customers` | Protected manager customer data |

The prototype still performs catalogue, booking, cart and order workflows in the client. Production must move these mutations to authenticated server APIs.

## 6. Security boundaries

Current controls include salted PBKDF2 password hashing, token generation with Node `crypto`, separate customer/manager stores, sanitized authentication responses, manager route protection, a 100 KB JSON body limit, an in-memory rate limit and an origin allow-list.

Production controls must include:

- PostgreSQL for durable transactional records.
- Redis or a managed identity provider for sessions.
- Secure HTTP-only cookies, CSRF protection and session expiry.
- Schema validation, rate limiting, request-size limits and audit logs.
- Provider-hosted payment collection and webhook verification.
- No API keys, passwords or reset codes in client bundles or production responses.
- Keep `BACKEND_PORT` bound to loopback and expose only the public storefront/reverse proxy.

## 7. Recommended production architecture

```text
Users
  |
CDN + WAF
  |
Static React assets -------- Object storage
  |
Load balancer
  |
Stateless Express API containers
  |             |              |
PostgreSQL   Redis       Object storage
  |             |              |
Queue/workers: notifications, AI jobs, fulfilment
  |
External providers: Gemini, weather, payments, email
```

### Responsibilities

- **CDN/WAF:** TLS termination, caching and request filtering.
- **React client:** presentation and optimistic interaction only.
- **Express API:** authorization, validation and business rules.
- **PostgreSQL:** customers, services, products, bookings, orders and inventory.
- **Redis:** sessions, rate limits and short-lived catalogue/dashboard caches.
- **Object storage:** customer garden images and visualizer results.
- **Queue workers:** notifications, image generation and fulfilment events.
- **Monitoring:** structured logs, metrics, traces, alerts and error tracking.

## 8. Scalability strategy

### Prototype scale

Use the modular monolith with one managed database, basic monitoring and CDN-hosted static assets.

### Around one million customers

Run multiple stateless API instances, add database read replicas, cache catalogue reads, use a CDN for images and process notifications and AI jobs asynchronously.

### Around five million customers

Use regional deployment, partition high-volume data, introduce event-driven inventory and fulfilment, and split identity, catalogue, booking, order, payment and AI workloads only when measured traffic requires it.

## 9. Reliability and recovery

- AI and visualizer features provide local fallbacks when external services fail.
- Health checks and structured server logs should be monitored.
- PostgreSQL requires automated backups and point-in-time recovery.
- Object storage should use versioning and lifecycle policies.
- Orders and payments must be idempotent so retries cannot duplicate transactions.
- Recovery procedures should be tested before production launch.

## 10. Architecture decisions

1. Keep the current system as a modular monolith while the product and data model are changing.
2. Keep AI behind server endpoints so keys and prompts remain private.
3. Treat the browser as untrusted for price, stock, role and payment decisions.
4. Use asynchronous workers for slow or retryable operations.
5. Split services only after monitoring identifies a real scaling or ownership boundary.
