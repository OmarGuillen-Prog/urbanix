"use client";

import { usePreferenciasNotificaciones } from "./usePreferenciasNotificaciones";
import { Interruptor } from "@/components/Interruptor";
import { CATEGORIAS } from "./etiquetas";

export function SeccionNotificaciones() {
  const { preferencias, categoriasVisibles, handleCategoria, handleCorreo } = usePreferenciasNotificaciones();

  return (
    <section className="rounded-xl border border-line bg-white p-6">
      <h2 className="font-display text-lg font-semibold text-ink">Preferencias de notificaciones</h2>
      <p className="mt-1 text-sm text-ink/60">
        Elige qué avisos quieres recibir en tu bandeja. Los cambios se guardan al instante.
      </p>

      <div className="mt-5 flex flex-col gap-3">
        {categoriasVisibles.map((categoria) => {
          const obligatoria = categoria === "cuotas";

          return (
            <div key={categoria} className="flex items-center justify-between gap-4 rounded-lg bg-canvas px-4 py-3">
              <div>
                <p className="text-sm font-medium text-ink">{CATEGORIAS[categoria].titulo}</p>
                <p className="text-xs text-ink/60">
                  {CATEGORIAS[categoria].descripcion}
                  {obligatoria && " · Siempre activo"}
                </p>
              </div>
              <Interruptor
                activo={preferencias.categorias[categoria]}
                onCambiar={(activa) => handleCategoria(categoria, activa)}
                etiqueta={CATEGORIAS[categoria].titulo}
                deshabilitado={obligatoria}
              />
            </div>
          );
        })}
      </div>

      <h3 className="mt-8 font-medium text-ink">Canales</h3>
      <div className="mt-3 flex items-center justify-between gap-4 rounded-lg bg-canvas px-4 py-3">
        <div>
          <p className="text-sm font-medium text-ink">Notificaciones por correo</p>
          <p className="text-xs text-ink/60">
            Recibir también los avisos en tu correo. Se enviarán cuando se conecte el servicio de correo.
          </p>
        </div>
        <Interruptor activo={preferencias.porCorreo} onCambiar={handleCorreo} etiqueta="Notificaciones por correo" />
      </div>
    </section>
  );
}