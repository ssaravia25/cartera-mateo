import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cartera de Mateo",
  description: "10 acciones, $1.000, marcas que Mateo conoce. Precio actual de cierre desde Stooq.",
};

export const viewport: Viewport = {
  themeColor: "#0b0f1a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="font-sans min-h-screen">{children}</body>
    </html>
  );
}
