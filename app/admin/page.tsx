import Link from "next/link";
import { supabase, mapProduct } from "@/lib/supabase";
import { logout } from "@/app/admin/actions";
import { DeleteButton } from "@/app/admin/_components/DeleteButton";

const STATUS_LABELS: Record<string, string> = {
  "in-stock": "En stock",
  "low-stock": "Pocas unidades",
  "out-of-stock": "Sin stock",
};

const BADGE_LABELS: Record<string, string> = {
  new: "Nuevo",
  low: "Bajo",
  out: "Sin stock",
};

export default async function AdminPage() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("brand");

  if (error) throw new Error(error.message);
  const products = (data ?? []).map(mapProduct);

  return (
    <main className="min-h-screen bg-dark text-gold-lt p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-gold text-2xl tracking-wide">
            Productos ({products.length})
          </h1>
          <div className="flex gap-3 items-center">
            <Link
              href="/admin/new"
              className="bg-gold text-dark px-4 py-2 rounded text-sm font-sans hover:opacity-90 transition-opacity"
            >
              + Agregar
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="border border-white/20 px-4 py-2 rounded text-sm font-sans text-muted hover:border-white/40 transition-colors"
              >
                Salir
              </button>
            </form>
          </div>
        </div>

        <div className="border border-white/10 rounded overflow-hidden">
          <table className="w-full text-sm font-sans">
            <thead className="bg-mid text-muted">
              <tr>
                <th className="text-left px-4 py-3 font-normal">Marca</th>
                <th className="text-left px-4 py-3 font-normal">Nombre</th>
                <th className="text-left px-4 py-3 font-normal">Precio</th>
                <th className="text-left px-4 py-3 font-normal">Stock</th>
                <th className="text-left px-4 py-3 font-normal">Estado</th>
                <th className="text-left px-4 py-3 font-normal">Badge</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-t border-white/[0.06] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3 text-muted">{product.brand}</td>
                  <td className="px-4 py-3 text-gold-lt">{product.name}</td>
                  <td className="px-4 py-3 text-gold">{product.price}</td>
                  <td className="px-4 py-3">{product.stockCount}</td>
                  <td className="px-4 py-3 text-muted">
                    {STATUS_LABELS[product.stockStatus] ?? product.stockStatus}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {product.badge ? BADGE_LABELS[product.badge] : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3 justify-end">
                      <Link
                        href={`/admin/${product.id}/edit`}
                        className="text-xs text-gold hover:underline"
                      >
                        Editar
                      </Link>
                      <DeleteButton id={product.id} name={product.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
