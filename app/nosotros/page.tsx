import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Nosotros | Essencia Perfumería",
  description:
    "Conoce la historia detrás de Essencia. Selección cuidada de perfumes de autor y alta gama en Santiago, Chile.",
};

export default function NosotrosPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative flex flex-col items-center justify-center text-center px-8 pt-28 pb-20 overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 30%, rgba(212,212,212,0.06) 0%, transparent 70%)",
            }}
          />
          <p className="text-gold text-xs tracking-[0.35em] uppercase mb-5">
            Nuestra historia
          </p>
          <h1
            className="font-serif font-normal text-gold-lt leading-[1.15] mb-5"
            style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)" }}
          >
            Pasión por la{" "}
            <em className="italic text-gold">fragancia</em>
          </h1>
          <p className="max-w-xl text-muted leading-relaxed text-base">
            En Essencia creemos que un perfume es mucho más que un aroma —
            es una experiencia, un recuerdo, una identidad.
          </p>
        </section>

        {/* Quiénes somos */}
        <section className="max-w-3xl mx-auto px-8 pb-20 space-y-6 text-muted leading-relaxed text-sm">
          <div className="border-l-2 border-gold pl-6">
            <h2 className="font-serif text-gold-lt text-2xl mb-3">
              Quiénes somos
            </h2>
            <p>
              Essencia nació en Santiago de Chile con una misión clara: acercar
              los mejores perfumes de autor y alta gama a quienes valoran la
              calidad por sobre la masificación. Somos un emprendimiento
              familiar con foco en la curaduría honesta y el servicio
              personalizado.
            </p>
          </div>

          <div className="border-l-2 border-gold pl-6">
            <h2 className="font-serif text-gold-lt text-2xl mb-3">
              Nuestra selección
            </h2>
            <p>
              Cada fragancia en nuestro catálogo pasa por un proceso de
              selección riguroso. Trabajamos directamente con distribuidores
              autorizados para garantizar autenticidad, y actualizamos el stock
              diariamente para que siempre encuentres lo que buscas.
            </p>
          </div>

          <div className="border-l-2 border-gold pl-6">
            <h2 className="font-serif text-gold-lt text-2xl mb-3">
              Nuestro compromiso
            </h2>
            <p>
              Nos comprometemos con la transparencia: precios claros, stock
              real y despacho en 24 horas a todo el país. Si tienes una duda
              o buscas algo específico, estamos siempre disponibles para
              orientarte.
            </p>
          </div>
        </section>

        {/* Valores */}
        <section className="bg-mid border-y border-white/[0.08] py-16 px-8">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { label: "Autenticidad", desc: "Solo productos 100% originales, sin excepción." },
              { label: "Curaduría", desc: "Selección pensada para paladares exigentes." },
              { label: "Cercanía", desc: "Atención personalizada en cada compra." },
            ].map((v) => (
              <div key={v.label} className="space-y-2">
                <p className="text-gold text-xs tracking-[0.3em] uppercase">{v.label}</p>
                <p className="text-muted text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
