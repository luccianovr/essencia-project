import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase, mapProduct } from "@/lib/supabase";
import { updateProduct } from "@/app/admin/actions";
import { ProductFields } from "@/app/admin/_components/ProductFields";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !data) notFound();

  const product = mapProduct(data as Record<string, unknown>);
  const updateWithId = updateProduct.bind(null, product.id);

  return (
    <main className="min-h-screen bg-dark text-gold-lt p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-muted text-sm hover:text-gold-lt font-sans">
            ← Volver
          </Link>
          <h1 className="font-serif text-gold text-2xl tracking-wide">
            Editar: {product.name}
          </h1>
        </div>

        <form action={updateWithId} className="flex flex-col gap-5">
          <ProductFields product={product} disableId />
          <button
            type="submit"
            className="bg-gold text-dark font-sans font-medium py-3 rounded hover:opacity-90 transition-opacity"
          >
            Guardar cambios
          </button>
        </form>
      </div>
    </main>
  );
}
