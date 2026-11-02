"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useVersionNotificaciones } from "@/lib/useNotificaciones";
import { contarSinLeer } from "@/lib/notificacionesStore";
import { obtenerUsuarioPorCorreo } from "@/lib/usuariosStore";

export function Topbar({ onAbrirMenu }: { onAbrirMenu: () => void }) {
  const { usuario, cerrarSesion } = useAuth();
  const router = useRouter();

  // Suscripcion: la campana se actualiza sola cuando cambian las notificaciones
  useVersionNotificaciones();
  const sinLeer = usuario ? contarSinLeer(usuario.correo) : 0;

  // La foto vive en la ficha del usuario; cuando se guarda el perfil, la sesion cambia y este componente se redibuja
  const foto = usuario ? obtenerUsuarioPorCorreo(usuario.correo)?.foto : undefined;

  const inicial = usuario?.nombres?.charAt(0).toUpperCase() ?? "?";
  const nombreCompleto = usuario ? `${usuario.nombres} ${usuario.apellidos}` : "";

  function handleCerrarSesion() {
    cerrarSesion();
    router.push("/login");
  }

  return (
    <header className="flex h-16 items-center justify-end gap-3 border-b border-line bg-white px-4 sm:gap-4 sm:px-8">
      {/* Boton del menu: solo en pantallas pequenas (en las grandes el menu ya esta a la vista). mr-auto lo manda a la izquierda */}
      <button
        type="button"
        onClick={onAbrirMenu}
        aria-label="Abrir menú"
        className="mr-auto flex h-9 w-9 items-center justify-center rounded-lg bg-brand font-display text-lg font-semibold text-white transition-colors hover:bg-brand-dark lg:hidden"
      >
        U
      </button>

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
        aria-label="Mi perfil"
        className="flex items-center gap-3 rounded-lg px-2 py-1 transition-colors hover:bg-canvas"
      >
        {foto ? (
          // Es una imagen en memoria (data URL): next/image no aplica, por eso <img>
          // eslint-disable-next-line @next/next/no-img-element
          <img src={foto} alt="" className="h-9 w-9 rounded-full object-cover" />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-medium text-white">
            {inicial}
          </div>
        )}
        {/* En pantallas pequenas solo queda el avatar: el nombre completo no cabe */}
        <span className="hidden text-sm font-medium text-ink sm:inline">{nombreCompleto}</span>
      </Link>

      <button
        onClick={handleCerrarSesion}
        className="whitespace-nowrap rounded-lg border border-line px-3 py-1.5 text-sm text-ink/60 transition-colors hover:border-error hover:text-error"
      >
        Cerrar sesión
      </button>
    </header>
  );
}