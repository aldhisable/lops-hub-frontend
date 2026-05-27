# LOPs Hub Frontend

Phase 1 foundation for the AI antigravity agent workspace.

## Stack

- Next.js App Router
- React + TypeScript
- TailwindCSS v4
- shadcn-style primitives with `class-variance-authority`, `Slot`, `clsx`, and `tailwind-merge`
- Lucide icons

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run start
```

If `node` is not available in the current Windows PATH, use:

```powershell
$env:PATH='C:\Program Files\nodejs;'+$env:PATH
npm run dev
```

## Phase 1 Surface

- `app/layout.tsx` and `app/page.tsx` provide the Next.js shell.
- `app/globals.css`, `src/index.css`, and `src/App.css` define Tailwind entrypoint and design tokens.
- `src/components/layout` contains `PublicLayout`, `InternalLayout`, `AuthLayout`, `SidebarNav`, `TopBar`, and `Breadcrumb`.
- `src/components/ui` contains `GlassCard` and `GlowButton`.
- `src/features/foundation/antigravity-foundation.tsx` wires the internal dashboard preview.
