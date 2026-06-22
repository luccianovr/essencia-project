# Supabase Products + Admin Panel — Design Spec

**Date:** 2026-06-22
**Project:** Essencia Perfumería
**Status:** Approved

---

## 1. Goal

Move the hardcoded product array from `lib/constants.ts` into a Supabase (PostgreSQL) database and add a password-protected admin panel at `/admin` for managing products without touching code.

---

## 2. Constraints

- Free tier only (Supabase free: 500 MB, 2 projects — sufficient for this catalog size)
- Single admin user — no multi-user auth required
- Zero visual changes to the public-facing site
- Deploy target: Vercel

---

## 3. Architecture

```
Supabase (PostgreSQL)
    └── table: products  ← source of truth for product data

Next.js App (Vercel)
    ├── app/page.tsx               ← Server Component, fetches from Supabase
    ├── app/admin/
    │   ├── page.tsx               ← admin product list
    │   ├── new/page.tsx           ← add product form
    │   ├── [id]/edit/page.tsx     ← edit product form
    │   └── actions.ts             ← Server Actions: create, update, delete
    ├── middleware.ts              ← protects /admin/* via session cookie
    ├── app/admin/login/page.tsx   ← password login form
    └── lib/supabase.ts            ← server-side Supabase client
```

**Data flow (public site):**
`app/page.tsx` (Server Component) → `lib/supabase.ts` → Supabase → renders HTML → shipped to browser with zero extra client JS.

**Data flow (admin):**
`/admin/login` form → Server Action verifies `ADMIN_PASSWORD` env var → sets `admin_session` cookie → middleware validates cookie on every `/admin/*` request → CRUD Server Actions use `SUPABASE_SERVICE_ROLE_KEY` (server-only, never exposed to browser).

---

## 4. Database Schema

Table name: `products`

| Column         | Type       | Nullable | Notes                                      |
|----------------|------------|----------|--------------------------------------------|
| `id`           | `text`     | No (PK)  | Slug-style string, e.g. `"dior-sauvage"`   |
| `brand`        | `text`     | No       |                                            |
| `name`         | `text`     | No       |                                            |
| `description`  | `text`     | No       |                                            |
| `price`        | `text`     | No       | e.g. `"$15.000"`                           |
| `volume`       | `text`     | No       | e.g. `"25"` (ml)                           |
| `concentration`| `text`     | No       | `"EDP"` or `"EDT"`                         |
| `image`        | `text`     | Yes      | Path to `/public/images/`                  |
| `emoji`        | `text`     | Yes      |                                            |
| `categories`   | `text[]`   | No       | PostgreSQL array: `["hombre"]`, `["mujer"]`, etc. |
| `stock_status` | `text`     | No       | `"in-stock"`, `"low-stock"`, `"out-of-stock"` |
| `stock_count`  | `integer`  | No       | Default `0`                                |
| `badge`        | `text`     | Yes      | `"new"`, `"low"`, `"out"`, or `null`       |

**Row Level Security:**
- `SELECT`: public (anon key can read)
- `INSERT / UPDATE / DELETE`: service role only (enforced server-side)

---

## 5. Data Migration

Script: `scripts/seed.ts`

- Reads the existing `PRODUCTS` array from `lib/constants.ts`
- Inserts all 43 products into Supabase via `upsert` (idempotent — safe to re-run)
- Maps camelCase fields to snake_case columns (`stockStatus` → `stock_status`, `stockCount` → `stock_count`)
- Run once: `npx tsx scripts/seed.ts`

`lib/constants.ts` keeps the `PRODUCTS` array until seed is confirmed successful, then the array is removed. `STATS` is recalculated from live DB data.

---

## 6. Admin Panel

**Authentication:**
- Route: `/admin/login`
- Single password field → Server Action checks against `ADMIN_PASSWORD` env var
- On success: sets `admin_session` cookie (httpOnly, secure, sameSite=strict, 24h expiry)
- `middleware.ts` checks cookie on every `/admin/*` request; redirects to login if missing/invalid
- Logout: Server Action that clears the cookie

**Admin pages:**

| Route | Description |
|---|---|
| `/admin` | Table listing all products: brand, name, price, stock count, status, badge. Edit and delete buttons per row. |
| `/admin/new` | Form to add a new product (all fields) |
| `/admin/[id]/edit` | Pre-filled form to edit an existing product |

**Server Actions (`app/admin/actions.ts`):**
- `createProduct(formData)` → inserts into Supabase
- `updateProduct(id, formData)` → updates row by id
- `deleteProduct(id)` → deletes row, requires confirmation (handled client-side before calling action)

All actions revalidate the `/` and `/admin` paths after mutation so the public catalog reflects changes immediately.

---

## 7. Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=       # Supabase project URL (safe for browser)
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # Supabase anon key (safe for browser, RLS enforced)
SUPABASE_SERVICE_ROLE_KEY=      # Server-only — never expose to client
ADMIN_PASSWORD=                 # Hashed or plaintext — used by login Server Action
```

All must be added to Vercel project environment variables.

---

## 8. What Does NOT Change

- All public-facing components (`Hero`, `Catalog`, `ProductCard`, `Stats`, `Navbar`, `Footer`)
- Pages: `/nosotros`, `/contacto`
- Visual design, Tailwind config, CSS tokens
- `types/index.ts` — the `Product` interface stays as-is (data is mapped on fetch)

---

## 9. Out of Scope

- Image uploads (images remain in `/public/images/` and referenced by path)
- Order management / shopping cart
- Multi-user admin roles
- Email notifications on stock changes
