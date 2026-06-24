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
