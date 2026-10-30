// Envoltorio compartido para las 4 pantallas de autenticacion (login,
// registro, recuperar, restablecer). Centraliza el layout de dos
// columnas -altura fija, ancho de cada panel, scroll interno- en UN
// SOLO lugar. Antes, cambiar esto significaba editar 4 archivos por
// separado (la causa exacta de los ultimos bugs); ahora es aqui, una
// sola vez, para siempre.

import { AuthBrandPanel } from "./AuthBrandPanel";

interface AuthLayoutProps {
  titulo: string;
  subtitulo: string;
  patronVentanas: number[];
  children: React.ReactNode;
}

export function AuthLayout({ titulo, subtitulo, patronVentanas, children }: AuthLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-canvas font-sans text-ink">
      <AuthBrandPanel titulo={titulo} subtitulo={subtitulo} patronVentanas={patronVentanas} />

      {/* overflow-y-auto: si en una pantalla muy baja el formulario
          no cupiera del todo, SOLO esta columna obtendria scroll
          interno - el panel verde de la izquierda nunca se ve
          afectado, sin importar que tan largo sea el formulario. */}
      <div className="flex w-full flex-col items-center overflow-y-auto px-6 py-16 md:w-2/3">
        <div className="my-auto w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}