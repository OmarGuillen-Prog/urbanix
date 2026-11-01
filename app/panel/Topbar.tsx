// app/panel/Topbar.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useVersionNotificaciones } from "@/lib/useNotificaciones";
import { contarSinLeer } from "@/lib/notificacionesStore";

export function Topbar() {
  const { usuario, cerrarSesion } = useAuth();
  const router = useRouter();

  // Suscripcion: la campana se actualiza sola cuando cambian las notificaciones
  useVersionNotificaciones();
  const sinLeer = usuario ? contarSinLeer(usuario.correo) : 0;

  const inicial = usuario?.nombres?.charAt(0).toUpperCase() ?? "?";
  const nombreCompleto = usuario ? `${usuario.nombres} ${usuario.apellidos}` : "";

  function handleCerrarSesion() {
    cerrarSesion();
    router.push("/login");
  }

  return (
    <header className="flex h-16 items-center justify-end gap-4 border-b border-line bg-white px-8">
      <Link
        href="/panel/notificaciones"
        aria-label={sinLeer > 0 ? `Notificaciones, ${sinLeer} sin leer` : "Notificaciones"}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-lg transition-colors hover:bg-canvas"
      >
        🔔
        {sinLeer > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[10px] font-medium text-white">
            {sinLeer > 9 ? "9+" : sinLeer}
          </span>
        )}
      </Link>

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