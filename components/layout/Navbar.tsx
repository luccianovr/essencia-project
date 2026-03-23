"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/config/site";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      aria-label="Navegación principal"
      className="sticky top-0 z-50 bg-dark/92 backdrop-blur-md border-b border-white/[0.12]"
    >
      <div className="flex items-center justify-between px-8 py-4">
        <Link
          href="/"
          className="text-gold text-2xl tracking-[0.18em] uppercase font-serif"
        >
          Ess<span className="text-gold-lt">encia</span>
        </Link>

        {/* Desktop links */}
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

        {/* Mobile hamburger */}
        <button
          className="sm:hidden flex flex-col gap-[5px] p-2 group"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`block w-5 h-px bg-gold transition-transform duration-200 origin-center ${
              open ? "translate-y-[6px] rotate-45" : ""
            }`}
          />
          <span
            className={`block w-5 h-px bg-gold transition-opacity duration-200 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-px bg-gold transition-transform duration-200 origin-center ${
              open ? "-translate-y-[6px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <ul
          className="sm:hidden flex flex-col border-t border-white/[0.08] list-none"
          role="list"
        >
          {siteConfig.nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-8 py-4 text-muted text-xs tracking-widest uppercase transition-colors duration-200 hover:text-gold hover:bg-white/[0.03]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
