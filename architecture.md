# Root & Bloom — Architecture

## 1. Architectural goals

The application provides one digital experience for garden services, retail products, plant-care guidance, and horticultural operations. The architecture keeps customer features modular while allowing the prototype to grow into a secure, persistent production platform.

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
4. `AppContext` coordinates navigation, sessions, cart, bookings, orders, modals, and notifications.
5. Feature components render pages and invoke context actions.
6. AI and account features call Express endpoints.
7. The public storefront proxies `/api` requests to the private backend process.
8. The backend validates requests and uses Gemini or deterministic fallback logic.

The backend binds to `127.0.0.1` and is not directly reachable from the network. In production, only the public storefront or an equivalent reverse proxy is exposed.

## 3. Source architecture

```text
root-and-bloom/
├── server.ts                    public storefront and production proxy
├── backend/server.ts            private API, auth, AI, and manager routes
├── src/App.tsx                  application shell and page switching
├── src/main.tsx                 React entry point
├── src/types.ts                 shared domain types
├── src/context/AppContext.tsx   shared client state and actions
├── src/components/              customer and manager experiences
├── src/services/                AI and weather integrations
└── src/utils/                   image and visualizer utilities
```

## 4. API boundary

| API | Responsibility |
|---|---|
| `GET /api/health` | Health check |
| `POST /api/plant-ai` | Plant diagnosis and recommendations |
| `POST /api/chat` | Conversational Flora support |
| `/api/auth/customer/*` | Customer account and session operations |
| `/api/auth/manager/*` | Manager account and verification operations |
| `GET /api/manager/customers` | Protected manager customer data |

The prototype still performs catalogue, booking, cart, and order workflows in the client. Production must move these mutations to authenticated server APIs.

## 5. Security boundaries

Current controls include salted PBKDF2 password hashing, token generation with Node `crypto`, separate customer and manager stores, sanitized authentication responses, manager route protection, a 100 KB JSON body limit, an in-memory rate limit, and an origin allow-list.

Production controls must include:

- PostgreSQL for durable transactional records.
- Redis or a managed identity provider for sessions.
- Secure HTTP-only cookies, CSRF protection, and session expiry.
- Schema validation, rate limiting, request-size limits, and audit logs.
- Provider-hosted payment collection and webhook verification.
- No API keys, passwords, or reset codes in client bundles or production responses.
- `BACKEND_PORT` bound to loopback with only the public storefront or reverse proxy exposed.

## 6. Recommended production architecture

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

## 7. Architecture decisions

1. Keep the current system as a modular monolith while the product and data model are changing.
2. Keep AI behind server endpoints so keys and prompts remain private.
3. Treat the browser as untrusted for price, stock, role, and payment decisions.
4. Use asynchronous workers for slow or retryable operations.
5. Split services only after monitoring identifies a real scaling or ownership boundary.
