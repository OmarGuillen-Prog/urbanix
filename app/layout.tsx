import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

// Fuente de display: para titulos con personalidad. La usamos con
// moderacion (solo titulos), nunca para texto largo.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "600", "700"],
});

// Fuente de cuerpo: para labels, inputs, parrafos - prioriza legibilidad.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "URBANIX — Gestión de Conjuntos Residenciales",
  description:
    "Plataforma integral para administradores, residentes y personal de seguridad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${fraunces.variable} ${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}