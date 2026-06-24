"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function login(formData: FormData) {
  const password = formData.get("password") as string;

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    redirect("/admin/login?error=1");
  }

  cookies().set("admin_session", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  redirect("/admin");
}

export async function logout() {
  cookies().delete("admin_session");
  redirect("/admin/login");
}

function parseProductRow(formData: FormData) {
  return {
    id: (formData.get("id") as string).trim(),
    brand: (formData.get("brand") as string).trim(),
    name: (formData.get("name") as string).trim(),
    description: (formData.get("description") as string).trim(),
    price: (formData.get("price") as string).trim(),
    volume: (formData.get("volume") as string).trim(),
    concentration: formData.get("concentration") as string,
    image: (formData.get("image") as string)?.trim() || null,
    emoji: (formData.get("emoji") as string)?.trim() || null,
    categories: formData.getAll("categories") as string[],
    stock_status: formData.get("stock_status") as string,
    stock_count: parseInt(formData.get("stock_count") as string, 10),
    badge: (formData.get("badge") as string) || null,
  };
}

export async function createProduct(formData: FormData) {
  const row = parseProductRow(formData);
  const { error } = await supabaseAdmin.from("products").insert(row);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateProduct(id: string, formData: FormData) {
  const row = parseProductRow(formData);
  const { error } = await supabaseAdmin
    .from("products")
    .update(row)
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteProduct(id: string) {
  const { error } = await supabaseAdmin
    .from("products")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin");
}
