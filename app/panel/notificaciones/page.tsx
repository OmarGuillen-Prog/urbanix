// app/panel/notificaciones/page.tsx
"use client";

import Link from "next/link";
import { useNotificacionesPagina } from "./useNotificacionesPagina";
import { ResumenTarjetas } from "@/components/ResumenTarjetas";
import { Paginacion } from "@/components/Paginacion";
import { tiempoRelativo } from "@/lib/formatos";
import type { TipoNotificacion } from "@/lib/notificacionesStore";

// Icono (un simbolo dentro de un circulo de color) por tipo de notificacion
const ICONOS: Record<TipoNotificacion, { simbolo: string; estilo: string }> = {
  alerta: { simbolo: "!", estilo: "bg-error/10 text-error" },
  info: { simbolo: "i", estilo: "bg-sky-100 text-sky-700" },
  exito: { simbolo: "✓", estilo: "bg-emerald-100 text-emerald-700" },
};

const CLASE_SELECT =
  "rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

export default function NotificacionesPage() {
  const {
    visibles, totalFiltradas, paginaActual, totalPaginas, setPagina,
    filtroLectura, cambiarLectura,
    filtroTipo, cambiarTipo,
    filtroPeriodo, cambiarPeriodo,
    total, sinLeer, alertas, informativas,
    handleMarcarLeida, handleMarcarTodas, handleEliminar, handleLimpiarTodo,
  } = useNotificacionesPagina();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Notificaciones</h1>
          <p className="mt-1 text-ink/60">Gestiona las notificaciones y alertas del sistema</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMarcarTodas}
            disabled={sinLeer === 0}
            className="rounded-lg border border-line px-3.5 py-2 text-sm font-medium text-ink transition-colors hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
          >
            ✓ Marcar todo como leído
          </button>
          <button
            onClick={handleLimpiarTodo}
            disabled={total === 0}
            className="rounded-lg border border-error/30 px-3.5 py-2 text-sm font-medium text-error transition-colors hover:border-error disabled:cursor-not-allowed disabled:opacity-40"
          >
            🗑 Limpiar todo
          </button>
        </div>
      </div>

      <ResumenTarjetas
        items={[
          { etiqueta: "Total notificaciones", valor: total, icono: "🔔", tono: "brand" },
          { etiqueta: "Sin leer", valor: sinLeer, icono: "📬", tono: "dorado" },
          { etiqueta: "Alertas", valor: alertas, icono: "⚠️", tono: "rojo" },
          { etiqueta: "Informativas", valor: informativas, icono: "ℹ️", tono: "verde" },
        ]}
      />

      <div className="mt-6 flex flex-wrap gap-3">
        <select
          value={filtroLectura}
          onChange={(evento) => cambiarLectura(evento.target.value as "todas" | "sin_leer" | "leidas")}
          aria-label="Filtrar por lectura"
          className={CLASE_SELECT}
        >
          <option value="todas">Todas las notificaciones</option>
          <option value="sin_leer">Sin leer</option>
          <option value="leidas">Leídas</option>
        </select>
        <select
          value={filtroTipo}
          onChange={(evento) => cambiarTipo(evento.target.value as TipoNotificacion | "todos")}
          aria-label="Filtrar por tipo"
          className={CLASE_SELECT}
        >
          <option value="todos">Todos los tipos</option>
          <option value="alerta">Alertas</option>
          <option value="info">Información</option>
          <option value="exito">Completadas</option>
        </select>
        <select
          value={filtroPeriodo}
          onChange={(evento) => cambiarPeriodo(evento.target.value as "7" | "30" | "todo")}
          aria-label="Filtrar por periodo"
          className={CLASE_SELECT}
        >
          <option value="7">Últimos 7 días</option>
          <option value="30">Últimos 30 días</option>
          <option value="todo">Todo el historial</option>
        </select>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-line bg-white">
        {visibles.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-ink/40">
            {total === 0 ? "No tienes notificaciones. ¡Estás al día!" : "No hay notificaciones con esos filtros."}
          </p>
        ) : (
          <ul>
            {visibles.map((notificacion) => {
              const icono = ICONOS[notificacion.tipo];

              // El contenido de texto es el mismo con o sin enlace
              const contenido = (
                <>
                  <p className="flex items-center gap-2 text-sm font-medium text-ink">
                    {notificacion.titulo}
                    {!notificacion.leida && (
                      <span className="h-2 w-2 rounded-full bg-brand" role="img" aria-label="Sin leer" />
                    )}
                  </p>
                  <p className="mt-0.5 text-sm text-ink/60">{notificacion.mensaje}</p>
                  <p className="mt-1 text-xs text-ink/40">{tiempoRelativo(notificacion.fecha)}</p>
                </>
              );

              return (
                <li
                  key={notificacion.id}
                  className={`flex items-start gap-4 border-b border-line px-5 py-4 last:border-0 ${
                    notificacion.leida ? "" : "bg-brand/5"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${icono.estilo}`}
                    aria-hidden="true"
                  >
                    {icono.simbolo}
                  </span>

                  <div className="min-w-0 flex-1">
                    {notificacion.enlace ? (
                      // Tocar la notificacion la marca como leida y lleva a la pantalla relacionada
                      <Link
                        href={notificacion.enlace}
                        onClick={() => handleMarcarLeida(notificacion.id)}
                        className="block hover:opacity-80"
                      >
                        {contenido}
                      </Link>
                    ) : (
                      contenido
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    {!notificacion.leida && (
                      <button
                        onClick={() => handleMarcarLeida(notificacion.id)}
                        aria-label="Marcar como leída"
                        title="Marcar como leída"
                        className="rounded-lg px-2 py-1 text-sm text-ink/50 transition-colors hover:bg-canvas hover:text-brand"
                      >
                        ✓
                      </button>
                    )}
                    <button
                      onClick={() => handleEliminar(notificacion.id)}
                      aria-label="Eliminar notificación"
                      title="Eliminar"
                      className="rounded-lg px-2 py-1 text-sm text-ink/50 transition-colors hover:bg-canvas hover:text-error"
                    >
                      🗑
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <Paginacion
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          resumen={`Mostrando ${visibles.length} de ${totalFiltradas} notificaciones`}
          onCambiar={setPagina}
        />
      </div>
    </div>
  );
}