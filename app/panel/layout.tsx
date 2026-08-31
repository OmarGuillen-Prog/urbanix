"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const { usuario, cargando } = useAuth();
  const router = useRouter();

  // Efecto legitimo: navegar es "sincronizar con un sistema externo"
  // (el enrutador del navegador), no un simple calculo - por eso
  // useEffect es correcto aqui, a diferencia del caso de HU-03.
  useEffect(() => {
    if (!cargando && !usuario) {
      router.push("/login");
    }
  }, [cargando, usuario, router]);

  // Mientras se resuelve si hay sesion (o mientras redirige a alguien
  // sin sesion), mostramos un estado de carga simple en vez de un
  // panel vacio o con datos de "undefined" parpadeando.
  if (cargando || !usuario) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas font-sans text-ink/60">
        Cargando...
      </div>
    );
  }

  return (
    <div className="flex bg-canvas font-sans text-ink">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}