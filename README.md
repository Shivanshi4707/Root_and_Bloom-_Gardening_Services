# Root & Bloom — Digital Business System

## Project structure

The application has been reorganized into a modular structure so features are grouped by responsibility instead of living in a single large file.

```text
src/
├─ App.tsx
├─ main.tsx
├─ styles.css
├─ components/
│  └─ AppShell.tsx
├─ data/
│  └─ initialData.ts
├─ modules/
│  ├─ customer/
│  │  └─ CustomerDashboard.tsx
│  └─ manager/
│     └─ ManagerDashboard.tsx
├─ types/
│  └─ business.ts
└─ utils/
   └─ business.ts
```

## What changed

- Business data and seeded values moved into the data layer.
- Shared TypeScript models moved into the types folder.
- Booking and inventory logic moved into the utils folder.
- Customer and manager screens are split into separate module components.
- The top-level shell is handled by a reusable AppShell component for a cleaner UI layout.

## Local development

```bash
npm install
npm run dev
```

## Architecture note

This follows the architecture described in [docs/architecture.md](docs/architecture.md) while keeping the prototype simple, maintainable, and easier to extend for future modules such as authentication, payments, or real API integrations.
