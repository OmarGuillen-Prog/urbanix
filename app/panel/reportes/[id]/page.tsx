"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useDetalleReporte } from "./useDetalleReporte";
import { codigoReporte, type EstadoReporte, type PrioridadReporte } from "@/lib/reportesStore";
import { nombrePorCorreo, unidadDeUsuario } from "@/lib/personasHelpers";
import { ETIQUETAS_ESTADO, ESTILOS_ESTADO, ETIQUETAS_PRIORIDAD, ESTILOS_PRIORIDAD } from "../etiquetas";

function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

const CLASE_CAMPO =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";
const CLASE_ETIQUETA = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60";

export default function DetalleReportePage() {
  const params = useParams<{ id: string }>();
  const {
    reporte, tieneAcceso, esAdministrador,
    estado, setEstado,
    prioridad, setPrioridad,
    comentario, setComentario,
    error, guardando, guardado, handleGuardar,
  } = useDetalleReporte(params.id);

  // Imagen que se esta viendo en grande (null = ninguna). Es solo estado VISUAL.
  const [ampliada, setAmpliada] = useState<number | null>(null);

  const enlaceVolver = (
    <Link href="/panel/reportes" className="text-sm text-ink/60 hover:text-brand">
      ← Volver al listado
    </Link>
  );

  if (!reporte) {
    return (
      <div>
        {enlaceVolver}
        <p className="mt-4 text-ink/60">Reporte no encontrado.</p>
      </div>
    );
  }

  if (!tieneAcceso) {
    return (
      <div>
        {enlaceVolver}
        <p className="mt-4 text-ink/60">No tienes permiso para ver este reporte.</p>
      </div>
    );
  }

  return (
    <div>
      {enlaceVolver}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-brand">{codigoReporte(reporte.id)}</span>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ESTILOS_ESTADO[reporte.estado]}`}>
          {ETIQUETAS_ESTADO[reporte.estado]}
        </span>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ESTILOS_PRIORIDAD[reporte.prioridad]}`}>
          Prioridad {ETIQUETAS_PRIORIDAD[reporte.prioridad].toLowerCase()}
        </span>
      </div>

      <h1 className="mt-2 font-display text-3xl font-semibold text-ink">{reporte.titulo}</h1>

      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-ink/50">
        <span>📍 {reporte.ubicacion}</span>
        <span>
          👤 {nombrePorCorreo(reporte.correoCreador)} ({unidadDeUsuario(reporte.correoCreador)})
        </span>
        <span>📅 {formatearFecha(reporte.fechaReporte)}</span>
      </div>

      <div className="mt-6 max-w-2xl rounded-xl border border-line bg-white p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-ink/40">Descripción</p>
        <p className="mt-2 text-sm text-ink">{reporte.descripcion}</p>

        <p className="mt-6 text-xs font-medium uppercase tracking-wide text-ink/40">
          Evidencias ({reporte.evidencias.length})
        </p>
        {reporte.evidencias.length === 0 ? (
          <p className="mt-2 text-sm text-ink/40">Este reporte no tiene imágenes adjuntas.</p>
        ) : (
          <>
            <ul className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {reporte.evidencias.map((imagen, indice) => (
                <li key={indice}>
                  <button
                    type="button"
                    onClick={() => setAmpliada(ampliada === indice ? null : indice)}
                    aria-label={`Ver evidencia ${indice + 1} en grande`}
                    className={`block w-full overflow-hidden rounded-lg border ${
                      ampliada === indice ? "border-brand" : "border-line"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagen} alt={`Evidencia ${indice + 1}`} className="h-28 w-full object-cover" />
                  </button>
                </li>
              ))}
            </ul>

            {ampliada !== null && reporte.evidencias[ampliada] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={reporte.evidencias[ampliada]}
                alt={`Evidencia ${ampliada + 1} ampliada`}
                className="mt-4 max-h-96 w-full rounded-lg border border-line object-contain"
              />
            )}
          </>
        )}
      </div>

      {esAdministrador ? (
        <form onSubmit={handleGuardar} className="mt-4 max-w-2xl rounded-xl border border-line bg-white p-6">
          <p className="font-display text-lg font-semibold text-ink">Gestionar reporte</p>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="estado" className={CLASE_ETIQUETA}>Estado</label>
              <select id="estado" value={estado} onChange={(evento) => setEstado(evento.target.value as EstadoReporte)} className={CLASE_CAMPO}>
                <option value="pendiente">Pendiente</option>
                <option value="en_evaluacion">En evaluación</option>
                <option value="en_proceso">En reparación</option>
                <option value="resuelto">Resuelto</option>
              </select>
            </div>

            <div>
              <label htmlFor="prioridad" className={CLASE_ETIQUETA}>Prioridad</label>
              <select id="prioridad" value={prioridad} onChange={(evento) => setPrioridad(evento.target.value as PrioridadReporte)} className={CLASE_CAMPO}>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="comentario" className={CLASE_ETIQUETA}>Comentario de seguimiento</label>
            <textarea
              id="comentario"
              rows={3}
              value={comentario}
              onChange={(evento) => setComentario(evento.target.value)}
              placeholder="Ej: Se contactó al proveedor, visita agendada para el viernes."
              className={CLASE_CAMPO}
            />
          </div>

          {error && <p className="mt-3 text-sm text-error">{error}</p>}
          {guardado && !error && <p className="mt-3 text-sm text-emerald-700">✓ Cambios guardados correctamente.</p>}

          <button
            type="submit"
            disabled={guardando}
            className="mt-4 rounded-lg bg-brand px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
          >
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      ) : (
        <div className="mt-4 max-w-2xl rounded-xl border border-line bg-white p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-ink/40">Seguimiento de administración</p>
          {reporte.comentarioAdmin ? (
            <>
              <p className="mt-2 text-sm text-ink">{reporte.comentarioAdmin}</p>
              {reporte.fechaActualizacion && (
                <p className="mt-2 text-xs text-ink/40">Actualizado el {formatearFecha(reporte.fechaActualizacion)}</p>
              )}
            </>
          ) : (
            <p className="mt-2 text-sm text-ink/40">
              Tu reporte está {ETIQUETAS_ESTADO[reporte.estado].toLowerCase()}. Te avisaremos cuando haya novedades.
            </p>
          )}
        </div>
      )}
    </div>
  );
}