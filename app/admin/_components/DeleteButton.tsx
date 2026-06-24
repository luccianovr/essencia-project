"use client";

import { deleteProduct } from "@/app/admin/actions";

interface DeleteButtonProps {
  id: string;
  name: string;
}

export function DeleteButton({ id, name }: DeleteButtonProps) {
  async function handleClick() {
    if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    await deleteProduct(id);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-xs text-red-400 hover:underline font-sans"
    >
      Eliminar
    </button>
  );
}
