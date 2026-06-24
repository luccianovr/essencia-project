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
