import Image from "next/image";
import { cn } from "@/lib/cn";
import type { Product } from "@/types";

const BADGE_CLASSES = {
  new: "bg-gold text-dark",
  low: "bg-[#8b2222] text-[#ffd0d0]",
  out: "bg-[#3a3a3a] text-[#999]",
} as const;

const BADGE_LABELS = {
  new: "Nuevo",
  low: "Pocas unidades",
  out: "Sin stock",
} as const;

const STOCK_CLASSES = {
  "in-stock": "text-[#6fcf97]",
  "low-stock": "text-[#f2994a]",
  "out-of-stock": "text-[#888]",
} as const;

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const stockLabel =
    product.stockStatus === "out-of-stock"
      ? "✕ Sin stock"
      : `● ${product.stockCount} disponible${product.stockCount !== 1 ? "s" : ""}`;

  return (
    <article className="bg-card-bg border border-white/[0.08] rounded-card overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
      {/* Image area */}
      <div
        className="w-full aspect-[4/3] relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a1a1a, #0a0a0a)" }}
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={`${product.brand} ${product.name}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-7xl"
            aria-hidden="true"
          >
            {product.emoji}
          </div>
        )}
        {product.badge && (
          <span
            className={cn(
              "absolute top-3 right-3 px-2 py-0.5 text-[0.65rem] tracking-[0.12em] uppercase rounded-sm font-sans",
              BADGE_CLASSES[product.badge]
            )}
          >
            {BADGE_LABELS[product.badge]}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="text-gold text-[0.68rem] tracking-[0.2em] uppercase font-sans mb-1">
          {product.brand}
        </div>
        <h3 className="font-serif font-normal text-[1.15rem] leading-snug mb-1 text-gold-lt">
          {product.name}
        </h3>
        <p className="text-muted text-[0.82rem] leading-relaxed flex-1">
          {product.description}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-4 border-t border-white/[0.07] flex-wrap gap-2">
        <div>
          <div className="text-gold-lt text-xl font-serif">{product.price}</div>
          <div className="text-muted text-xs font-sans mt-0.5">
            {product.volume} ml · {product.concentration}
          </div>
        </div>
        <div
          className={cn("text-xs font-sans tracking-wide", STOCK_CLASSES[product.stockStatus])}
          aria-label={`Stock: ${stockLabel}`}
        >
          {stockLabel}
        </div>
      </div>
    </article>
  );
}
