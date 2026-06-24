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
