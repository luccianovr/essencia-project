import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Essencia | Perfumería",
  description:
    "Selección de perfumes de autor y alta gama. Stock actualizado diariamente. Envíos a todo el país.",
  openGraph: {
    title: "Essencia | Perfumería",
    description:
      "Selección de perfumes de autor y alta gama. Stock actualizado diariamente.",
    type: "website",
    locale: "es_CL",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
