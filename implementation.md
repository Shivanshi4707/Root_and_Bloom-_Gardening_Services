# Root & Bloom — Implementation Guide

## 1. Application overview

Root & Bloom is a React and Express gardening platform based on the AI Studio reference experience. It combines a customer storefront, gardening services, a product marketplace, plant-care AI, garden visualisation, customer accounts, and a manager operations portal.

The application is a working prototype. It demonstrates the complete user experience, while production persistence, payment processing, and authorization still need to be connected to managed services.

## 2. Technology

- React 19 and TypeScript
- Vite 6 for development and bundling
- Express 4 for the public server and private API
- Tailwind CSS 4 for responsive styling
- Lucide React and Motion for icons and animations
- Google GenAI for optional plant-care and chat responses
- In-memory Maps for prototype accounts and sessions
- Canvas utilities and fallback rendering for the garden visualizer

## 3. Installation and running

From the repository root:

```bash
cd root-and-bloom
npm install
```

Copy `.env.example` to `.env` and set `GEMINI_API_KEY` when Gemini-backed responses are required. The app includes local fallback knowledge when no key is configured.

Start the public storefront and private backend together:

```bash
npm run dev
```

Open `http://127.0.0.1:3000`. The public storefront runs on port 3000, while the backend listens privately on `127.0.0.1:3001`.

Build and validate the project:

```bash
npm run lint
npm run build
```

## 4. Frontend implementation

`src/main.tsx` mounts `App`. `src/App.tsx` creates the application provider and shell.

### Application shell

- `AppContext.tsx` stores shared navigation, role, user, cart, bookings, orders, modal, and notification state.
- `Navbar.tsx` provides customer navigation and account actions.
- `Footer.tsx` provides site navigation and support information.
- `ToastContainer.tsx` displays success and error feedback.
- Cart, checkout, booking, and product detail components provide cross-page workflows.

### Customer features

| Feature | Implementation |
|---|---|
| Home page | `src/components/home/` |
| Services and booking | `src/components/services/` |
| Product catalogue | `src/components/shop/` |
| Cart and checkout | `src/components/cart/` |
| Plant AI | `src/components/plantai/PlantAIPage.tsx` |
| Garden visualizer | `src/components/visualizer/GardenVisualizerPage.tsx` |
| Landscaping consultation | `src/components/landscaping/LandscapingPage.tsx` |
| Customer dashboard | `src/components/dashboard/MyGardenPage.tsx` |
| Support | `src/components/faq/`, `src/components/contact/`, `LiveChatWidget.tsx` |

### Manager features

- `ManagerAuthModal.tsx` protects staff access.
- `ManagerPortal.tsx` displays operational and customer information.
- `AppShell` prevents unauthenticated users from rendering the manager portal.

## 5. Backend implementation

`server.ts` creates the public storefront server and proxies `/api` requests in production. `backend/server.ts` owns private API behavior.

Implemented endpoint groups:

- `GET /api/health` — server health check.
- `POST /api/plant-ai` — plant diagnosis using Gemini or local fallback knowledge.
- `POST /api/chat` — Flora support chat using Gemini or fallback replies.
- `/api/auth/customer/*` — customer signup, login, password reset, profile, and password changes.
- `/api/auth/manager/*` — manager login, registration, and session verification.
- `GET /api/manager/customers` — manager-authorized customer data.

Passwords are salted and hashed with Node `crypto` before being stored in prototype server Maps. Sensitive password fields are removed before user records are returned to the browser.

## 6. Main business workflows

### Service booking

```text
Customer selects service
  -> selects date, time, and details
  -> client validates the request
  -> booking is created
  -> booking appears in My Garden and manager operations
```

### Product order

```text
Customer searches products
  -> opens product details
  -> adds available quantity to cart
  -> checkout validates stock and totals
  -> UPI payment flow is simulated
  -> order status is shown to the customer
```

### AI assistance

```text
Customer submits a plant question
  -> browser calls the public /api proxy
  -> private backend uses Gemini when configured
  -> local botanical knowledge is used as fallback
  -> response is rendered in Plant AI or Flora chat
```

## 7. Current limitations

- Accounts, sessions, and operational records are held in memory and reset when the server restarts.
- Product, booking, and order mutations are not yet server-authoritative.
- UPI payment is a demonstration flow, not a real payment integration.
- Reset codes should be delivered through a verified email provider in production.
- Manager authorization needs to be enforced for every server-side mutation.
- Automated unit, integration, and end-to-end tests should be added.

## 8. Recommended implementation sequence

1. Add PostgreSQL repositories for customers, products, bookings, orders, and inventory.
2. Add Redis-backed sessions and secure HTTP-only cookies.
3. Move all business mutations behind authenticated Express APIs.
4. Integrate a PCI-compliant payment provider and webhook verification.
5. Add object storage for garden images and generated visualizer results.
6. Add schema validation, rate limiting, audit logging, and automated tests.
7. Deploy the frontend through a CDN and the API as stateless containers.
