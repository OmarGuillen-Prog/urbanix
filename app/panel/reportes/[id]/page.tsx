"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useDetalleReporte } from "./useDetalleReporte";

const ETIQUETAS_ESTADO: Record<string, string> = {
  pendiente: "Pendiente",
  en_proceso: "En proceso",
  resuelto: "Resuelto",
};

function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function DetalleReportePage() {
  const params = useParams<{ id: string }>();
  const {
    reporte, tieneAcceso, esAdministrador,
    estadoSeleccionado, setEstadoSeleccionado,
    comentario, setComentario,
    guardando, handleActualizar,
  } = useDetalleReporte(params.id);

  if (!reporte) {
    return (
      <div>
        <p className="text-ink/60">Reporte no encontrado.</p>
        <Link href="/panel/reportes" className="mt-4 inline-block text-brand hover:text-brand-dark">
          ← Volver al listado
        </Link>
      </div>
    );
  }

  if (!tieneAcceso) {
    return (
      <div>
        <p className="text-ink/60">No tienes permiso para ver este reporte.</p>
        <Link href="/panel/reportes" className="mt-4 inline-block text-brand hover:text-brand-dark">
          ← Volver al listado
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/panel/reportes" className="text-sm text-ink/60 hover:text-brand">
        ← Volver al listado
      </Link>

      <h1 className="mt-4 font-display text-3xl font-semibold text-ink">{reporte.titulo}</h1>
      <p className="mt-1 text-sm text-ink/40">Reportado el {formatearFecha(reporte.fechaReporte)}</p>

      <div className="mt-6 max-w-lg rounded-xl border border-line bg-white p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-ink/40">Descripción</p>
        <p className="mt-2 text-sm text-ink">{reporte.descripcion}</p>

        {reporte.evidenciaFoto && (
          <>
            <p className="mt-4 text-xs font-medium uppercase tracking-wide text-ink/40">Evidencia</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={reporte.evidenciaFoto}
              alt="Evidencia del daño reportado"
              className="mt-2 max-h-64 rounded-lg border border-line object-cover"
            />
          </>
        )}
      </div>

      {/* Solo el administrador puede cambiar estado y comentar (RF-53) */}
      {esAdministrador ? (
        <form onSubmit={handleActualizar} className="mt-4 max-w-lg rounded-xl border border-line bg-white p-6">
          <p className="font-display text-lg font-semibold text-ink">Gestionar reporte</p>

          <div className="mt-4">
            <label htmlFor="estado" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
              Estado
            </label>
            <select
              id="estado"
              value={estadoSeleccionado}
              onChange={(evento) => setEstadoSeleccionado(evento.target.value as typeof estadoSeleccionado)}
              className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            >
              <option value="pendiente">Pendiente</option>
              <option value="en_proceso">En proceso</option>
              <option value="resuelto">Resuelto</option>
            </select>
          </div>

          <div className="mt-4">
            <label htmlFor="comentario" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
              Comentario de seguimiento
            </label>
            <textarea
              id="comentario"
              rows={3}
              value={comentario}
              onChange={(evento) => setComentario(evento.target.value)}
              placeholder="Ej: Se contactó al proveedor, visita agendada para el viernes."
              className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink placeholder:text-ink/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>

          <button
            type="submit"
            disabled={guardando}
            className="mt-4 rounded-lg bg-brand px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
          >
            {guardando ? "Guardando..." : "Actualizar estado"}
          </button>
        </form>
      ) : (
        <div className="mt-4 max-w-lg rounded-xl border border-line bg-white p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-ink/40">Estado actual</p>
          <p className="mt-2 text-sm text-ink">{ETIQUETAS_ESTADO[reporte.estado]}</p>
          {reporte.comentarioAdmin && (
            <>
              <p className="mt-4 text-xs font-medium uppercase tracking-wide text-ink/40">
                Comentario de administración
              </p>
              <p className="mt-2 text-sm text-ink">{reporte.comentarioAdmin}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}