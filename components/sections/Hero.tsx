import Link from "next/link";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex flex-col items-center justify-center text-center px-8 pt-28 pb-20 overflow-hidden"
    >
      {/* Radial glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(212,212,212,0.06) 0%, transparent 70%)",
        }}
      />

      <p className="text-gold text-xs tracking-[0.35em] uppercase mb-5">
        Colección 2026
      </p>
      <h1
        id="hero-heading"
        className="font-serif font-normal text-gold-lt leading-[1.15] mb-5"
        style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)" }}
      >
        El arte de la{" "}
        <em className="italic text-gold">fragancia</em>
        <br />
        al alcance tuyo
      </h1>
      <p className="max-w-lg text-muted leading-relaxed mb-10 text-base">
        Descubre nuestra selección de perfumes de autor y alta gama. Stock
        actualizado.
      </p>
      <Link href="#catalogo" className="btn-primary">
        Ver stock disponible
      </Link>
    </section>
  );
}
