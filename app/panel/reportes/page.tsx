"use client";

import Link from "next/link";
import { useReportesLista } from "./useReportesLista";
import { ResumenTarjetas } from "@/components/ResumenTarjetas";
import { Paginacion } from "@/components/Paginacion";
import { codigoReporte, type EstadoReporte, type PrioridadReporte } from "@/lib/reportesStore";
import { nombrePorCorreo, unidadDeUsuario } from "@/lib/personasHelpers";
import { ETIQUETAS_ESTADO, ESTILOS_ESTADO, ETIQUETAS_PRIORIDAD, ESTILOS_PRIORIDAD } from "./etiquetas";

function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
}

const CLASE_SELECT =
  "rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

export default function ReportesDanosPage() {
  const {
    esAdministrador,
    visibles, totalFiltrados, paginaActual, totalPaginas, setPagina,
    busqueda, cambiarBusqueda,
    filtroEstado, cambiarEstado,
    filtroPrioridad, cambiarPrioridad,
    pendientes, enReparacion, resueltos, altaPrioridad,
  } = useReportesLista();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Reportes de daños</h1>
          <p className="mt-1 text-ink/60">
            {esAdministrador
              ? "Gestiona reportes de daños, evidencias y seguimiento de reparaciones"
              : "Tus reportes de daños y el seguimiento de su reparación"}
          </p>
        </div>

        <Link
          href="/panel/reportes/nuevo"
          className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          + Nuevo reporte
        </Link>
      </div>

      <ResumenTarjetas
        items={[
          { etiqueta: "Pendientes", valor: pendientes, icono: "⏳", tono: "dorado" },
          { etiqueta: "En reparación", valor: enReparacion, icono: "🔧", tono: "brand" },
          { etiqueta: "Resueltos", valor: resueltos, icono: "✅", tono: "verde" },
          { etiqueta: "Alta prioridad", valor: altaPrioridad, icono: "⚠️", tono: "rojo" },
        ]}
      />

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Buscar por título, ubicación o reportante..."
          value={busqueda}
          onChange={(evento) => cambiarBusqueda(evento.target.value)}
          className="w-full max-w-md rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink placeholder:text-ink/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
        <select value={filtroEstado} onChange={(evento) => cambiarEstado(evento.target.value as EstadoReporte | "todos")} className={CLASE_SELECT}>
          <option value="todos">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="en_evaluacion">En evaluación</option>
          <option value="en_proceso">En reparación</option>
          <option value="resuelto">Resuelto</option>
        </select>
        <select value={filtroPrioridad} onChange={(evento) => cambiarPrioridad(evento.target.value as PrioridadReporte | "todas")} className={CLASE_SELECT}>
          <option value="todas">Todas las prioridades</option>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
      </div>

      {visibles.length === 0 ? (
        <p className="mt-8 text-ink/40">No se encontraron reportes con esos criterios.</p>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {visibles.map((reporte) => (
            <li key={reporte.id}>
              <Link
                href={`/panel/reportes/${reporte.id}`}
                className="block rounded-xl border border-line bg-white p-5 transition-colors hover:border-brand"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium text-brand">{codigoReporte(reporte.id)}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ESTILOS_ESTADO[reporte.estado]}`}>
                        {ETIQUETAS_ESTADO[reporte.estado]}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ESTILOS_PRIORIDAD[reporte.prioridad]}`}>
                        {ETIQUETAS_PRIORIDAD[reporte.prioridad]}
                      </span>
                    </div>

                    <p className="mt-2 font-medium text-ink">{reporte.titulo}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-ink/60">{reporte.descripcion}</p>

                    {/* flex-wrap + gap: los datos saltan de linea solos en pantallas angostas */}
                    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-ink/50">
                      <span>📍 {reporte.ubicacion}</span>
                      <span>
                        👤 {nombrePorCorreo(reporte.correoCreador)} ({unidadDeUsuario(reporte.correoCreador)})
                      </span>
                      <span>📅 {formatearFecha(reporte.fechaReporte)}</span>
                      <span>🖼️ {reporte.evidencias.length} evidencia(s)</span>
                    </div>
                  </div>

                  {/* Solo el administrador gestiona: el lapiz se lo recuerda */}
                  {esAdministrador && (
                    <span className="shrink-0 text-ink/40" aria-hidden="true">
                      ✏️
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 overflow-hidden rounded-xl border border-line bg-white">
        <Paginacion
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          resumen={`Mostrando ${visibles.length} de ${totalFiltrados} reportes`}
          onCambiar={setPagina}
        />
      </div>
    </div>
  );
}