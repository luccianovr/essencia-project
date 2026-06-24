import type { Product } from "@/types";

const inputClass =
  "bg-card-bg border border-white/10 rounded px-3 py-2 text-gold-lt placeholder:text-muted focus:outline-none focus:border-gold font-sans text-sm w-full";

const labelClass = "block text-muted text-xs font-sans mb-1 uppercase tracking-wider";

interface ProductFieldsProps {
  product?: Partial<Product>;
  disableId?: boolean;
}

export function ProductFields({ product, disableId = false }: ProductFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="id" className={labelClass}>ID (slug)</label>
          <input
            id="id"
            name="id"
            type="text"
            defaultValue={product?.id ?? ""}
            required
            readOnly={disableId}
            placeholder="dior-sauvage"
            className={inputClass + (disableId ? " opacity-50 cursor-not-allowed" : "")}
          />
        </div>
        <div>
          <label htmlFor="brand" className={labelClass}>Marca</label>
          <input
            id="brand"
            name="brand"
            type="text"
            defaultValue={product?.brand ?? ""}
            required
            placeholder="Dior"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="name" className={labelClass}>Nombre</label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={product?.name ?? ""}
          required
          placeholder="Sauvage"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>Descripción</label>
        <textarea
          id="description"
          name="description"
          defaultValue={product?.description ?? ""}
          required
          rows={3}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="price" className={labelClass}>Precio</label>
          <input
            id="price"
            name="price"
            type="text"
            defaultValue={product?.price ?? ""}
            required
            placeholder="$15.000"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="volume" className={labelClass}>Volumen (ml)</label>
          <input
            id="volume"
            name="volume"
            type="text"
            defaultValue={product?.volume ?? ""}
            required
            placeholder="25"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="concentration" className={labelClass}>Concentración</label>
          <select
            id="concentration"
            name="concentration"
            defaultValue={product?.concentration ?? "EDP"}
            className={inputClass}
          >
            <option value="EDP">EDP</option>
            <option value="EDT">EDT</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="image" className={labelClass}>Imagen (ruta)</label>
        <input
          id="image"
          name="image"
          type="text"
          defaultValue={product?.image ?? ""}
          placeholder="/images/sauvage.png"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="stock_status" className={labelClass}>Estado stock</label>
          <select
            id="stock_status"
            name="stock_status"
            defaultValue={product?.stockStatus ?? "in-stock"}
            className={inputClass}
          >
            <option value="in-stock">En stock</option>
            <option value="low-stock">Pocas unidades</option>
            <option value="out-of-stock">Sin stock</option>
          </select>
        </div>
        <div>
          <label htmlFor="stock_count" className={labelClass}>Cantidad en stock</label>
          <input
            id="stock_count"
            name="stock_count"
            type="number"
            min="0"
            defaultValue={product?.stockCount ?? 0}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <fieldset>
            <legend className={labelClass}>Categorías</legend>
            <div className="flex gap-4 mt-2">
              {(["hombre", "mujer", "unisex"] as const).map((cat) => (
                <label key={cat} className="flex items-center gap-1.5 font-sans text-sm text-muted cursor-pointer">
                  <input
                    type="checkbox"
                    name="categories"
                    value={cat}
                    defaultChecked={product?.categories?.includes(cat)}
                    className="accent-gold"
                  />
                  {cat}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
        <div>
          <label htmlFor="badge" className={labelClass}>Badge (opcional)</label>
          <select
            id="badge"
            name="badge"
            defaultValue={product?.badge ?? ""}
            className={inputClass}
          >
            <option value="">Sin badge</option>
            <option value="new">Nuevo</option>
            <option value="low">Pocas unidades</option>
            <option value="out">Sin stock</option>
          </select>
        </div>
      </div>
    </>
  );
}
