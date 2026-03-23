"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Navbar() {
  return (
    <nav
      aria-label="Navegación principal"
      className="sticky top-0 z-50 flex items-center justify-between px-10 py-4 bg-dark/92 backdrop-blur-md border-b border-white/[0.12]"
    >
      <div className="text-gold text-2xl tracking-[0.18em] uppercase font-serif">
        Ess<span className="text-gold-lt">encia</span>
      </div>
      <ul className="hidden sm:flex gap-8 list-none" role="list">
        {siteConfig.nav.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-muted text-xs tracking-widest uppercase transition-colors duration-200 hover:text-gold focus-visible:outline-none focus-visible:text-gold"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
