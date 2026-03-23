"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { ProductCard } from "@/components/shared/ProductCard";
import type { Product, FilterOption } from "@/types";

const FILTERS: { label: string; value: FilterOption }[] = [
  { label: "Todos", value: "all" },
  { label: "Hombre", value: "hombre" },
  { label: "Mujer", value: "mujer" },
  { label: "Unisex", value: "unisex" },
  { label: "En stock", value: "disponible" },
];

interface CatalogProps {
  products: Product[];
}

export function Catalog({ products }: CatalogProps) {
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");

  const filtered = products.filter((p) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "disponible") return p.stockStatus !== "out-of-stock";
    return p.categories.includes(activeFilter);
  });

  return (
    <section id="catalogo" aria-labelledby="catalog-heading">
      {/* Section header */}
      <div className="text-center px-8 pt-16 pb-8">
        <h2
          id="catalog-heading"
          className="font-serif font-normal tracking-[0.05em]"
          style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
        >
          Catálogo de productos
        </h2>
        <p className="text-muted mt-2 text-sm">Stock en tiempo real</p>
        <div className="w-12 h-px bg-gold mx-auto mt-4" aria-hidden="true" />
      </div>

      {/* Filters */}
      <div
        className="flex flex-wrap gap-2 justify-center px-8 pb-8"
        role="group"
        aria-label="Filtrar productos"
      >
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={cn(
              "filter-btn",
              activeFilter === filter.value && "filter-btn-active"
            )}
            aria-pressed={activeFilter === filter.value}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-7 px-10 pb-20 max-w-[1300px] mx-auto" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))" }}>
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
