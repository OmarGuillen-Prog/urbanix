"use client";

// 1) el import (antes: sesionApiSigueValida de "@/lib/authApi")
import { sesionSigueValida } from "@/lib/modoDemo";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { VigilanteInactividad } from "./VigilanteInactividad";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const { usuario, cargando, cerrarSesion } = useAuth();
  const router = useRouter();

  // En pantallas pequenas el menu lateral se despliega encima del contenido; este estado dice si esta abierto.
  // Vive aqui (en el layout) porque lo comparten DOS componentes: el boton del Topbar y el propio Sidebar.
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
  if (cargando) return;

  if (!usuario) {
    router.push("/login");
    return;
  }

  // Preguntamos al SERVIDOR REAL si esta sesión sigue siendo válida (ya no a la lista simulada).
  // "cancelado" evita actuar con una respuesta vieja si el componente se desmonta mientras esperamos.
  let cancelado = false;

  // 2) la llamada dentro del efecto (antes: sesionApiSigueValida())
  sesionSigueValida(usuario.correo).then((valida) => {
    if (cancelado || valida) return; // sesión buena: no hacemos nada
    cerrarSesion();                  // el servidor dijo 401: borramos token y sesión
    router.push("/login");
  });

  // Función de limpieza: React la ejecuta al desmontar o antes de repetir el efecto
  return () => {
    cancelado = true;
  };
  }, [cargando, usuario, cerrarSesion, router]);

  if (cargando || !usuario) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas font-sans text-ink/60">
        Cargando...
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-canvas font-sans text-ink">
      <VigilanteInactividad />
      <Sidebar abierto={menuAbierto} onCerrar={() => setMenuAbierto(false)} />

      {/* min-w-0: sin esto, una tabla ancha estira esta columna mas alla de la pantalla en vez de hacer scroll dentro de su caja */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onAbrirMenu={() => setMenuAbierto(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}