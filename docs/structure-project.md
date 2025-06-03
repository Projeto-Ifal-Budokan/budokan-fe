Sure! Here's the same response formatted in **Markdown**:

---

# 🧱 Recommended Folder Structure for Next.js 15 with Server/Client Component Separation

```bash
src/
├── app/
│   ├── (marketing)/            # Public-facing pages
│   │   ├── page.tsx            # Landing page
│   │   └── layout.tsx
│   ├── (dashboard)/            # Authenticated area
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── attendance/
│   │       └── page.tsx
│   ├── api/                    # Route handlers
│   │   └── auth/
│   │       └── [...nextauth]/route.ts
│   └── middleware.ts           # Middleware (e.g., auth)
│
├── components/                 # Shared UI (can be further split)
│   ├── ui/                     # Generic UI components (buttons, inputs, modals)
│   ├── server/                 # Server components only
│   └── client/                 # Client-only components (useState, useEffect, etc.)
│
├── features/                   # Feature-based organization
│   ├── auth/                   # Auth logic
│   │   ├── components/         # Auth-specific UI
│   │   └── hooks/
│   ├── dashboard/              # Dashboard-specific logic/UI
│   │   ├── components/
│   │   └── utils/
│
├── hooks/                      # Shared React hooks
├── lib/                        # Shared logic (e.g., API clients, auth utils)
├── types/                      # Global TypeScript types/interfaces
├── styles/                     # Global and module-specific styles
└── constants/                  # App-wide constants
```

---

## 📂 Folder Purpose

| Folder        | Purpose                                                        |
| ------------- | -------------------------------------------------------------- |
| `app/`        | File-based routing; layout/page/api structure using App Router |
| `components/` | UI components grouped by usage (UI, client-only, server-only)  |
| `features/`   | Domain-level logic grouped by feature (auth, dashboard, etc.)  |
| `hooks/`      | Shared custom hooks across features                            |
| `lib/`        | Utilities like API wrappers, auth logic                        |
| `types/`      | Central place for TypeScript types and interfaces              |
| `styles/`     | CSS/SCSS/tailwind config or global styling                     |
| `constants/`  | Reusable config values and enums                               |

---

## ⚖️ Client vs Server Component Usage

| Use Case                    | Client Component ✅ | Server Component ✅ |
| --------------------------- | ------------------- | ------------------- |
| `useState`, `useEffect`     | ✅ Required         | ❌ Not supported    |
| Data fetching from DB/API   | ⚠️ Only if needed   | ✅ Recommended      |
| `onClick`, `onChange`, etc. | ✅ Required         | ❌ Not supported    |
| Layout, static rendering    | ❌ Not ideal        | ✅ Efficient        |

---

## 💡 Example: Sidebar Split

- `src/components/server/Sidebar.tsx`
  → Fetch data and render full sidebar (server component).

- `src/components/client/SidebarToggle.tsx`
  → Handle UI toggle with `useState` (client component).

---

Let me know if you'd like help refactoring your current structure (as seen in your screenshot) into this pattern.
