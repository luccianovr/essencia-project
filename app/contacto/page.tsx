import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Contacto | Essencia Perfumería",
  description: "Contáctanos para consultas sobre stock, pedidos o cualquier consulta.",
};

export default function ContactoPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center px-8 py-28">
        <p className="text-gold text-xs tracking-[0.35em] uppercase mb-5">
          Hablemos
        </p>
        <h1
          className="font-serif font-normal text-gold-lt text-center leading-[1.15] mb-12"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          ¿Tienes alguna <em className="italic text-gold">consulta</em>?
        </h1>

        <div className="w-full max-w-sm bg-card-bg border border-white/[0.1] rounded-sm p-8 space-y-6">
          {/* <div className="space-y-1">
            <p className="text-gold text-xs tracking-[0.3em] uppercase">Teléfono</p>
            <a
              href="tel:+56995086703"
              className="text-gold-lt text-lg font-serif tracking-wide hover:text-gold transition-colors duration-200"
            >
              +56 9 9508 6703
            </a>
          </div> */}

          {/* <div className="border-t border-white/[0.08]" /> */}

          <div className="space-y-1">
            <p className="text-gold text-xs tracking-[0.3em] uppercase">Correo</p>
            <a
              href="mailto:essencia.decaant@gmail.com"
              className="text-gold-lt text-sm font-sans tracking-wide hover:text-gold transition-colors duration-200 break-all"
            >
              essencia.decaant@gmail.com
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
