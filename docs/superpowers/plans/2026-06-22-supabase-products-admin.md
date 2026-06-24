# Supabase Products + Admin Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the hardcoded product list from `lib/constants.ts` into Supabase (PostgreSQL) and add a password-protected `/admin` panel for managing products.

**Architecture:** The public home page becomes an async Server Component that fetches products from Supabase using the anon key. A password-protected `/admin` route provides full CRUD via Server Actions that use the service role key (server-only). A `middleware.ts` enforces auth on all `/admin/*` routes via a session cookie.

**Tech Stack:** Next.js 14 App Router · TypeScript · Supabase (`@supabase/supabase-js`) · Tailwind CSS (existing tokens) · `tsx` (seed script runner)

## Global Constraints

- TypeScript strict mode — no `any`, no `@ts-ignore`
- Named exports only (no default exports except pages/layouts)
- Tailwind only — no inline styles, no new CSS classes beyond existing tokens
- Use existing color tokens: `dark`, `mid`, `card-bg`, `muted`, `gold`, `gold-lt`
- Font families: `font-serif` (Georgia) and `font-sans` (system-ui)
- `SUPABASE_SERVICE_ROLE_KEY` must never be imported in any file inside `components/` or any client component
- All DB mutations go through Server Actions in `app/admin/actions.ts`
- Zero changes to public-facing components or pages outside `app/page.tsx`

---

## File Map

**New files:**
- `lib/supabase.ts` — anon Supabase client + `mapProduct()` row mapper
- `lib/supabase-admin.ts` — service role Supabase client (admin mutations only)
- `scripts/seed.ts` — one-time migration script
- `middleware.ts` — protects `/admin/*` via cookie check
- `app/admin/login/page.tsx` — password login page
- `app/admin/actions.ts` — all Server Actions: login, logout, createProduct, updateProduct, deleteProduct
- `app/admin/layout.tsx` — admin layout shell
- `app/admin/page.tsx` — product list table
- `app/admin/new/page.tsx` — add product form
- `app/admin/[id]/edit/page.tsx` — edit product form
- `app/admin/_components/DeleteButton.tsx` — client component for delete with confirm
- `.env.local` — environment variables (do not commit)

**Modified files:**
- `app/page.tsx` — fetch products from Supabase instead of constants
- `lib/constants.ts` — remove `PRODUCTS` array and `STATS` export (stats computed inline)
- `package.json` — add `@supabase/supabase-js`, `tsx`, `dotenv` dependencies

---

## Task 1: Supabase project setup + install packages

**Files:**
- Modify: `package.json`
- Create: `lib/supabase.ts`
- Create: `lib/supabase-admin.ts`
- Create: `.env.local` (not committed)

**Interfaces:**
- Produces:
  - `supabase` — anon Supabase client for public reads
  - `mapProduct(row: Record<string, unknown>): Product` — maps snake_case DB row to `Product` type
  - `supabaseAdmin` — service role client, only imported in `app/admin/actions.ts` and `scripts/seed.ts`

- [ ] **Step 1: Create a Supabase project (manual)**

  Go to [supabase.com](https://supabase.com), create a free project. From **Project Settings → API**, copy:
  - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
  - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `service_role secret` key → `SUPABASE_SERVICE_ROLE_KEY`

- [ ] **Step 2: Create `.env.local`**

  Create `.env.local` in the project root (already in `.gitignore`):
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
  SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
  ADMIN_PASSWORD=tu_contraseña_segura_aquí
  ```

- [ ] **Step 3: Install dependencies**

  ```bash
  npm install @supabase/supabase-js
  npm install --save-dev tsx dotenv
  ```

  Expected: packages added to `package.json`, no errors.

- [ ] **Step 4: Create `lib/supabase.ts`**

  ```typescript
  import { createClient } from "@supabase/supabase-js";
  import type { Product } from "@/types";

  export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  export function mapProduct(row: Record<string, unknown>): Product {
    return {
      id: row.id as string,
      brand: row.brand as string,
      name: row.name as string,
      description: row.description as string,
      price: row.price as string,
      volume: row.volume as string,
      concentration: row.concentration as string,
      image: (row.image as string) ?? undefined,
      emoji: (row.emoji as string) ?? undefined,
      categories: row.categories as Product["categories"],
      stockStatus: row.stock_status as Product["stockStatus"],
      stockCount: row.stock_count as number,
      badge: (row.badge as Product["badge"]) ?? undefined,
    };
  }
  ```

- [ ] **Step 5: Create `lib/supabase-admin.ts`**

  ```typescript
  import { createClient } from "@supabase/supabase-js";

  export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  ```

- [ ] **Step 6: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 7: Commit**

  ```bash
  git add lib/supabase.ts lib/supabase-admin.ts package.json package-lock.json
  git commit -m "feat: add Supabase clients"
  ```

---

## Task 2: Create products table + seed existing data

**Files:**
- Create: `scripts/seed.ts`

**Interfaces:**
- Consumes: `PRODUCTS` from `lib/constants.ts`, `supabaseAdmin` from `lib/supabase-admin.ts`
- Produces: 43 rows in the `products` table in Supabase

- [ ] **Step 1: Create the `products` table in Supabase (manual)**

  In Supabase dashboard → **SQL Editor**, run:

  ```sql
  create table products (
    id           text primary key,
    brand        text not null,
    name         text not null,
    description  text not null,
    price        text not null,
    volume       text not null,
    concentration text not null,
    image        text,
    emoji        text,
    categories   text[] not null,
    stock_status text not null,
    stock_count  integer not null default 0,
    badge        text
  );

  alter table products enable row level security;

  create policy "Public read" on products
    for select using (true);
  ```

- [ ] **Step 2: Create `scripts/seed.ts`**

  ```typescript
  import { createClient } from "@supabase/supabase-js";
  import * as dotenv from "dotenv";
  import { PRODUCTS } from "../lib/constants";

  dotenv.config({ path: ".env.local" });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  async function seed() {
    const rows = PRODUCTS.map((p) => ({
      id: p.id,
      brand: p.brand,
      name: p.name,
      description: p.description,
      price: p.price,
      volume: p.volume,
      concentration: p.concentration,
      image: p.image ?? null,
      emoji: p.emoji ?? null,
      categories: p.categories,
      stock_status: p.stockStatus,
      stock_count: p.stockCount,
      badge: p.badge ?? null,
    }));

    const { error } = await supabase.from("products").upsert(rows);

    if (error) {
      console.error("Seed failed:", error.message);
      process.exit(1);
    }

    console.log(`Seeded ${rows.length} products successfully.`);
  }

  seed();
  ```

- [ ] **Step 3: Run the seed script**

  ```bash
  npx tsx scripts/seed.ts
  ```

  Expected output:
  ```
  Seeded 43 products successfully.
  ```

- [ ] **Step 4: Verify in Supabase dashboard**

  Go to **Table Editor → products** in Supabase. Confirm 43 rows are present with correct data.

- [ ] **Step 5: Commit**

  ```bash
  git add scripts/seed.ts
  git commit -m "feat: add seed script for product migration"
  ```

---

## Task 3: Update home page to fetch from Supabase

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `supabase`, `mapProduct` from `lib/supabase.ts`
- Produces: public home page renders products from Supabase DB

- [ ] **Step 1: Update `app/page.tsx`**

  Replace the entire file:

  ```tsx
  import { supabase, mapProduct } from "@/lib/supabase";
  import { Navbar } from "@/components/layout/Navbar";
  import { Footer } from "@/components/layout/Footer";
  import { Hero } from "@/components/sections/Hero";
  import { Stats } from "@/components/sections/Stats";
  import { Catalog } from "@/components/sections/Catalog";
  import type { Stat } from "@/types";

  export default async function Home() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("name");

    if (error) throw new Error(error.message);
    const products = (data ?? []).map(mapProduct);

    const totalStock = products.reduce((sum, p) => sum + p.stockCount, 0);
    const stats: Stat[] = [
      { value: String(products.length), label: "Fragancias" },
      { value: String(totalStock), label: "En stock hoy" },
      { value: "24h", label: "Despacho" },
    ];

    return (
      <>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-gold focus:text-dark focus:text-sm"
        >
          Saltar al contenido
        </a>
        <Navbar />
        <main id="main">
          <Hero />
          <Stats stats={stats} />
          <Catalog products={products} />
        </main>
        <Footer />
      </>
    );
  }
  ```

- [ ] **Step 2: Verify in browser**

  ```bash
  npm run dev
  ```

  Open [http://localhost:3000](http://localhost:3000). The catalog should show all 43 products loaded from Supabase. Stats should show correct counts.

- [ ] **Step 3: Commit**

  ```bash
  git add app/page.tsx
  git commit -m "feat: fetch products from Supabase on home page"
  ```

---

## Task 4: Admin authentication (middleware + login)

**Files:**
- Create: `middleware.ts`
- Create: `app/admin/login/page.tsx`
- Create: `app/admin/actions.ts` (login + logout only for now)
- Create: `app/admin/layout.tsx`

**Interfaces:**
- Produces:
  - `login(formData: FormData): Promise<never>` — sets `admin_session` cookie, redirects to `/admin`
  - `logout(): Promise<never>` — clears cookie, redirects to `/admin/login`
  - Middleware blocks unauthenticated access to `/admin/*`

- [ ] **Step 1: Create `middleware.ts`**

  ```typescript
  import { NextRequest, NextResponse } from "next/server";

  export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (
      pathname.startsWith("/admin") &&
      !pathname.startsWith("/admin/login")
    ) {
      const session = request.cookies.get("admin_session");
      if (!session?.value) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    }

    return NextResponse.next();
  }

  export const config = {
    matcher: ["/admin/:path*"],
  };
  ```

- [ ] **Step 2: Create `app/admin/actions.ts` with login + logout**

  ```typescript
  "use server";

  import { cookies } from "next/headers";
  import { redirect } from "next/navigation";
  import { revalidatePath } from "next/cache";
  import { supabaseAdmin } from "@/lib/supabase-admin";

  export async function login(formData: FormData) {
    const password = formData.get("password") as string;

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      redirect("/admin/login?error=1");
    }

    cookies().set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    redirect("/admin");
  }

  export async function logout() {
    cookies().delete("admin_session");
    redirect("/admin/login");
  }

  function parseProductRow(formData: FormData) {
    return {
      id: (formData.get("id") as string).trim(),
      brand: (formData.get("brand") as string).trim(),
      name: (formData.get("name") as string).trim(),
      description: (formData.get("description") as string).trim(),
      price: (formData.get("price") as string).trim(),
      volume: (formData.get("volume") as string).trim(),
      concentration: formData.get("concentration") as string,
      image: (formData.get("image") as string)?.trim() || null,
      emoji: (formData.get("emoji") as string)?.trim() || null,
      categories: formData.getAll("categories") as string[],
      stock_status: formData.get("stock_status") as string,
      stock_count: parseInt(formData.get("stock_count") as string, 10),
      badge: (formData.get("badge") as string) || null,
    };
  }

  export async function createProduct(formData: FormData) {
    const row = parseProductRow(formData);
    const { error } = await supabaseAdmin.from("products").insert(row);
    if (error) throw new Error(error.message);
    revalidatePath("/");
    revalidatePath("/admin");
    redirect("/admin");
  }

  export async function updateProduct(id: string, formData: FormData) {
    const row = parseProductRow(formData);
    const { error } = await supabaseAdmin
      .from("products")
      .update(row)
      .eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/");
    revalidatePath("/admin");
    redirect("/admin");
  }

  export async function deleteProduct(id: string) {
    const { error } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/");
    revalidatePath("/admin");
  }
  ```

- [ ] **Step 3: Create `app/admin/login/page.tsx`**

  ```tsx
  import { login } from "@/app/admin/actions";

  export default function LoginPage({
    searchParams,
  }: {
    searchParams: { error?: string };
  }) {
    return (
      <main className="min-h-screen bg-dark flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <h1 className="font-serif text-gold text-2xl text-center mb-8 tracking-widest">
            Essencia Admin
          </h1>
          {searchParams.error && (
            <p className="text-red-400 text-sm text-center mb-4 font-sans">
              Contraseña incorrecta.
            </p>
          )}
          <form action={login} className="flex flex-col gap-4">
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              required
              autoFocus
              className="bg-card-bg border border-white/10 rounded px-4 py-3 text-gold-lt placeholder:text-muted focus:outline-none focus:border-gold font-sans"
            />
            <button
              type="submit"
              className="bg-gold text-dark font-sans font-medium py-3 rounded hover:opacity-90 transition-opacity"
            >
              Ingresar
            </button>
          </form>
        </div>
      </main>
    );
  }
  ```

- [ ] **Step 4: Create `app/admin/layout.tsx`**

  ```tsx
  export default function AdminLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <>{children}</>;
  }
  ```

- [ ] **Step 5: Verify authentication flow**

  With `npm run dev` running:
  1. Navigate to [http://localhost:3000/admin](http://localhost:3000/admin) — should redirect to `/admin/login`
  2. Enter wrong password — should show "Contraseña incorrecta."
  3. Enter correct password (from `.env.local`) — should redirect to `/admin` (returns 404 for now, that's fine)
  4. Navigate back to `/admin` — should NOT redirect to login (cookie is set)

- [ ] **Step 6: Commit**

  ```bash
  git add middleware.ts app/admin/actions.ts app/admin/login/page.tsx app/admin/layout.tsx
  git commit -m "feat: admin authentication with password + session cookie"
  ```

---

## Task 5: Admin product list page

**Files:**
- Create: `app/admin/page.tsx`
- Create: `app/admin/_components/DeleteButton.tsx`

**Interfaces:**
- Consumes: `supabase`, `mapProduct` from `lib/supabase.ts`; `logout`, `deleteProduct` from `app/admin/actions.ts`
- Produces: `/admin` shows a table of all products with Edit and Delete per row

- [ ] **Step 1: Create `app/admin/_components/DeleteButton.tsx`**

  ```tsx
  "use client";

  import { deleteProduct } from "@/app/admin/actions";

  interface DeleteButtonProps {
    id: string;
    name: string;
  }

  export function DeleteButton({ id, name }: DeleteButtonProps) {
    async function handleClick() {
      if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) {
        return;
      }
      await deleteProduct(id);
    }

    return (
      <button
        type="button"
        onClick={handleClick}
        className="text-xs text-red-400 hover:underline font-sans"
      >
        Eliminar
      </button>
    );
  }
  ```

- [ ] **Step 2: Create `app/admin/page.tsx`**

  ```tsx
  import Link from "next/link";
  import { supabase, mapProduct } from "@/lib/supabase";
  import { logout } from "@/app/admin/actions";
  import { DeleteButton } from "@/app/admin/_components/DeleteButton";

  const STATUS_LABELS: Record<string, string> = {
    "in-stock": "En stock",
    "low-stock": "Pocas unidades",
    "out-of-stock": "Sin stock",
  };

  const BADGE_LABELS: Record<string, string> = {
    new: "Nuevo",
    low: "Bajo",
    out: "Sin stock",
  };

  export default async function AdminPage() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("brand");

    if (error) throw new Error(error.message);
    const products = (data ?? []).map(mapProduct);

    return (
      <main className="min-h-screen bg-dark text-gold-lt p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-serif text-gold text-2xl tracking-wide">
              Productos ({products.length})
            </h1>
            <div className="flex gap-3 items-center">
              <Link
                href="/admin/new"
                className="bg-gold text-dark px-4 py-2 rounded text-sm font-sans hover:opacity-90 transition-opacity"
              >
                + Agregar
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="border border-white/20 px-4 py-2 rounded text-sm font-sans text-muted hover:border-white/40 transition-colors"
                >
                  Salir
                </button>
              </form>
            </div>
          </div>

          <div className="border border-white/10 rounded overflow-hidden">
            <table className="w-full text-sm font-sans">
              <thead className="bg-mid text-muted">
                <tr>
                  <th className="text-left px-4 py-3 font-normal">Marca</th>
                  <th className="text-left px-4 py-3 font-normal">Nombre</th>
                  <th className="text-left px-4 py-3 font-normal">Precio</th>
                  <th className="text-left px-4 py-3 font-normal">Stock</th>
                  <th className="text-left px-4 py-3 font-normal">Estado</th>
                  <th className="text-left px-4 py-3 font-normal">Badge</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-t border-white/[0.06] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3 text-muted">{product.brand}</td>
                    <td className="px-4 py-3 text-gold-lt">{product.name}</td>
                    <td className="px-4 py-3 text-gold">{product.price}</td>
                    <td className="px-4 py-3">{product.stockCount}</td>
                    <td className="px-4 py-3 text-muted">
                      {STATUS_LABELS[product.stockStatus] ?? product.stockStatus}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {product.badge ? BADGE_LABELS[product.badge] : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3 justify-end">
                        <Link
                          href={`/admin/${product.id}/edit`}
                          className="text-xs text-gold hover:underline"
                        >
                          Editar
                        </Link>
                        <DeleteButton id={product.id} name={product.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    );
  }
  ```

- [ ] **Step 3: Verify in browser**

  Navigate to [http://localhost:3000/admin](http://localhost:3000/admin) (after logging in). Should show a table with all 43 products. Verify "Salir" button logs out and redirects to `/admin/login`.

- [ ] **Step 4: Commit**

  ```bash
  git add app/admin/page.tsx app/admin/_components/DeleteButton.tsx
  git commit -m "feat: admin product list page with delete"
  ```

---

## Task 6: Admin add + edit product forms

**Files:**
- Create: `app/admin/new/page.tsx`
- Create: `app/admin/[id]/edit/page.tsx`
- Create: `app/admin/_components/ProductFields.tsx`

**Interfaces:**
- Consumes: `createProduct`, `updateProduct` from `app/admin/actions.ts`; `supabase`, `mapProduct` from `lib/supabase.ts`
- Produces: `/admin/new` adds a product; `/admin/[id]/edit` pre-fills and updates a product

- [ ] **Step 1: Create `app/admin/_components/ProductFields.tsx`**

  Shared form fields used by both new and edit pages:

  ```tsx
  import type { Product } from "@/types";

  const inputClass =
    "bg-card-bg border border-white/10 rounded px-3 py-2 text-gold-lt placeholder:text-muted focus:outline-none focus:border-gold font-sans text-sm w-full";

  const labelClass = "block text-muted text-xs font-sans mb-1 uppercase tracking-wider";

  interface ProductFieldsProps {
    product?: Partial<Product>;
    disableId?: boolean;
  }

  export function ProductFields({ product, disableId = false }: ProductFieldsProps) {
    return (
      <>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="id" className={labelClass}>ID (slug)</label>
            <input
              id="id"
              name="id"
              type="text"
              defaultValue={product?.id ?? ""}
              required
              disabled={disableId}
              placeholder="dior-sauvage"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="brand" className={labelClass}>Marca</label>
            <input
              id="brand"
              name="brand"
              type="text"
              defaultValue={product?.brand ?? ""}
              required
              placeholder="Dior"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="name" className={labelClass}>Nombre</label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={product?.name ?? ""}
            required
            placeholder="Sauvage"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>Descripción</label>
          <textarea
            id="description"
            name="description"
            defaultValue={product?.description ?? ""}
            required
            rows={3}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="price" className={labelClass}>Precio</label>
            <input
              id="price"
              name="price"
              type="text"
              defaultValue={product?.price ?? ""}
              required
              placeholder="$15.000"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="volume" className={labelClass}>Volumen (ml)</label>
            <input
              id="volume"
              name="volume"
              type="text"
              defaultValue={product?.volume ?? ""}
              required
              placeholder="25"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="concentration" className={labelClass}>Concentración</label>
            <select
              id="concentration"
              name="concentration"
              defaultValue={product?.concentration ?? "EDP"}
              className={inputClass}
            >
              <option value="EDP">EDP</option>
              <option value="EDT">EDT</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="image" className={labelClass}>Imagen (ruta)</label>
          <input
            id="image"
            name="image"
            type="text"
            defaultValue={product?.image ?? ""}
            placeholder="/images/sauvage.png"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="stock_status" className={labelClass}>Estado stock</label>
            <select
              id="stock_status"
              name="stock_status"
              defaultValue={product?.stockStatus ?? "in-stock"}
              className={inputClass}
            >
              <option value="in-stock">En stock</option>
              <option value="low-stock">Pocas unidades</option>
              <option value="out-of-stock">Sin stock</option>
            </select>
          </div>
          <div>
            <label htmlFor="stock_count" className={labelClass}>Cantidad en stock</label>
            <input
              id="stock_count"
              name="stock_count"
              type="number"
              min="0"
              defaultValue={product?.stockCount ?? 0}
              required
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <fieldset>
              <legend className={labelClass}>Categorías</legend>
              <div className="flex gap-4 mt-2">
                {(["hombre", "mujer", "unisex"] as const).map((cat) => (
                  <label key={cat} className="flex items-center gap-1.5 font-sans text-sm text-muted cursor-pointer">
                    <input
                      type="checkbox"
                      name="categories"
                      value={cat}
                      defaultChecked={product?.categories?.includes(cat)}
                      className="accent-gold"
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
          <div>
            <label htmlFor="badge" className={labelClass}>Badge (opcional)</label>
            <select
              id="badge"
              name="badge"
              defaultValue={product?.badge ?? ""}
              className={inputClass}
            >
              <option value="">Sin badge</option>
              <option value="new">Nuevo</option>
              <option value="low">Pocas unidades</option>
              <option value="out">Sin stock</option>
            </select>
          </div>
        </div>
      </>
    );
  }
  ```

- [ ] **Step 2: Create `app/admin/new/page.tsx`**

  ```tsx
  import Link from "next/link";
  import { createProduct } from "@/app/admin/actions";
  import { ProductFields } from "@/app/admin/_components/ProductFields";

  export default function NewProductPage() {
    return (
      <main className="min-h-screen bg-dark text-gold-lt p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/admin" className="text-muted text-sm hover:text-gold-lt font-sans">
              ← Volver
            </Link>
            <h1 className="font-serif text-gold text-2xl tracking-wide">
              Agregar producto
            </h1>
          </div>

          <form action={createProduct} className="flex flex-col gap-5">
            <ProductFields />
            <button
              type="submit"
              className="bg-gold text-dark font-sans font-medium py-3 rounded hover:opacity-90 transition-opacity"
            >
              Guardar producto
            </button>
          </form>
        </div>
      </main>
    );
  }
  ```

- [ ] **Step 3: Create `app/admin/[id]/edit/page.tsx`**

  ```tsx
  import Link from "next/link";
  import { notFound } from "next/navigation";
  import { supabase, mapProduct } from "@/lib/supabase";
  import { updateProduct } from "@/app/admin/actions";
  import { ProductFields } from "@/app/admin/_components/ProductFields";

  export default async function EditProductPage({
    params,
  }: {
    params: { id: string };
  }) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error || !data) notFound();

    const product = mapProduct(data);
    const updateWithId = updateProduct.bind(null, product.id);

    return (
      <main className="min-h-screen bg-dark text-gold-lt p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/admin" className="text-muted text-sm hover:text-gold-lt font-sans">
              ← Volver
            </Link>
            <h1 className="font-serif text-gold text-2xl tracking-wide">
              Editar: {product.name}
            </h1>
          </div>

          <form action={updateWithId} className="flex flex-col gap-5">
            <ProductFields product={product} disableId />
            <button
              type="submit"
              className="bg-gold text-dark font-sans font-medium py-3 rounded hover:opacity-90 transition-opacity"
            >
              Guardar cambios
            </button>
          </form>
        </div>
      </main>
    );
  }
  ```

- [ ] **Step 4: Verify add product flow**

  1. Click "+ Agregar" in `/admin`
  2. Fill in all required fields (use a test product: id `test-001`, brand `Test`, name `Test Perfume`, etc.)
  3. Submit — should redirect to `/admin` and the new product should appear in the list
  4. Refresh [http://localhost:3000](http://localhost:3000) — new product should appear in the public catalog

- [ ] **Step 5: Verify edit product flow**

  1. Click "Editar" on any product in `/admin`
  2. Change the `stock_count` to a different value
  3. Submit — should redirect to `/admin` with updated value
  4. Verify public home page shows updated stock count

- [ ] **Step 6: Verify delete flow**

  1. Click "Eliminar" on the test product added in Step 4
  2. Confirm the dialog
  3. Product should disappear from the list and from the public catalog

- [ ] **Step 7: Commit**

  ```bash
  git add app/admin/new/page.tsx app/admin/[id]/edit/page.tsx app/admin/_components/ProductFields.tsx
  git commit -m "feat: admin add and edit product forms"
  ```

---

## Task 7: Remove hardcoded products from constants.ts

**Files:**
- Modify: `lib/constants.ts`

**Interfaces:**
- Produces: `lib/constants.ts` no longer exports `PRODUCTS` or `STATS`

- [ ] **Step 1: Verify the public site is fully working from Supabase**

  Run `npm run dev` and confirm [http://localhost:3000](http://localhost:3000) loads all products correctly without any reference to `lib/constants.ts` from `app/page.tsx`.

- [ ] **Step 2: Update `lib/constants.ts`**

  Replace the entire file with an empty file (or delete it if nothing else imports it):

  ```bash
  grep -r "from.*constants" app/ components/ lib/ --include="*.ts" --include="*.tsx"
  ```

  If `grep` returns only `lib/constants.ts` itself (no other importers), delete the file:

  ```bash
  rm lib/constants.ts
  ```

  If other files still import from it, remove only the `PRODUCTS` and `STATS` exports and leave the rest.

- [ ] **Step 3: Verify build passes**

  ```bash
  npx tsc --noEmit
  npm run build
  ```

  Expected: build succeeds with no TypeScript errors.

- [ ] **Step 4: Commit**

  ```bash
  git add -A
  git commit -m "chore: remove hardcoded PRODUCTS from constants.ts"
  ```

---

## Task 8: Add environment variables to Vercel

**Files:** None (Vercel dashboard configuration)

- [ ] **Step 1: Add env vars to Vercel (manual)**

  In Vercel dashboard → Project → **Settings → Environment Variables**, add:

  | Name | Value | Environments |
  |------|-------|--------------|
  | `NEXT_PUBLIC_SUPABASE_URL` | your Supabase project URL | Production, Preview, Development |
  | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon key | Production, Preview, Development |
  | `SUPABASE_SERVICE_ROLE_KEY` | your service role key | Production, Preview, Development |
  | `ADMIN_PASSWORD` | your chosen password | Production, Preview, Development |

- [ ] **Step 2: Deploy and verify**

  ```bash
  git push origin main
  ```

  After deploy:
  1. Visit the production URL — catalog loads from Supabase
  2. Visit `/admin/login` — login works with your password
  3. Edit a product stock count — verify change appears on the public page

---

## Self-Review Notes

- All 8 spec sections are covered: DB schema (Task 2), migration (Task 2), public fetch (Task 3), admin auth (Task 4), admin CRUD (Tasks 5–6), env vars (Task 8), cleanup (Task 7)
- `supabaseAdmin` is only imported in `app/admin/actions.ts` and `scripts/seed.ts` — never in components
- `deleteProduct` in `DeleteButton.tsx` is a server action called from a client component — valid in Next.js 14 App Router
- `updateProduct.bind(null, id)` pattern is the standard Next.js approach for passing extra args to Server Actions
- `ProductFields` uses `defaultValue` (not `value`) so it works as a Server Component without `useState`
- The `disableId` prop on `ProductFields` prevents changing the product ID on edit (which would create a new row instead of updating)
- `revalidatePath("/")` and `revalidatePath("/admin")` in every mutation ensures the public catalog and admin list reflect changes immediately
