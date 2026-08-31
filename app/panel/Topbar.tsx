"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function Topbar() {
  const { usuario, cerrarSesion } = useAuth();
  const router = useRouter();

  const inicial = usuario?.nombres?.charAt(0).toUpperCase() ?? "?";
  const nombreCompleto = usuario ? `${usuario.nombres} ${usuario.apellidos}` : "";

  function handleCerrarSesion() {
    cerrarSesion();
    router.push("/login");
  }

  return (
    <header className="flex h-16 items-center justify-end gap-4 border-b border-line bg-white px-8">
      <Link
        href="/panel/perfil"
        className="flex items-center gap-3 rounded-lg px-2 py-1 transition-colors hover:bg-canvas"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-medium text-white">
          {inicial}
        </div>
        <span className="text-sm font-medium text-ink">{nombreCompleto}</span>
      </Link>

      <button
        onClick={handleCerrarSesion}
        className="rounded-lg border border-line px-3 py-1.5 text-sm text-ink/60 transition-colors hover:border-error hover:text-error"
      >
        Cerrar sesión
      </button>
    </header>
  );
}