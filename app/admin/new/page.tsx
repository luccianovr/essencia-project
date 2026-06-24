import Link from "next/link";
import { createProduct } from "@/app/admin/actions";
import { ProductFields } from "@/app/admin/_components/ProductFields";

export default function NewProductPage() {
  return (
    <main className="min-h-screen bg-dark text-gold-lt p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-muted text-sm hover:text-gold-lt font-sans">
            ← Volver
          </Link>
          <h1 className="font-serif text-gold text-2xl tracking-wide">
            Agregar producto
          </h1>
        </div>

        <form action={createProduct} className="flex flex-col gap-5">
          <ProductFields />
          <button
            type="submit"
            className="bg-gold text-dark font-sans font-medium py-3 rounded hover:opacity-90 transition-opacity"
          >
            Guardar producto
          </button>
        </form>
      </div>
    </main>
  );
}
