"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useDetallePQRS } from "./useDetallePQRS";
import { codigoTicket, unidadDelCreador, nombrePorCorreo } from "@/lib/pqrsStore";
import type { EstadoPQRS, PrioridadPQRS } from "@/lib/pqrsStore";
import {
  ETIQUETAS_TIPO, ETIQUETAS_PRIORIDAD, ETIQUETAS_ESTADO,
  ESTILOS_TIPO, ESTILOS_PRIORIDAD, ESTILOS_ESTADO,
} from "../etiquetas";

function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

const CLASE_CAMPO =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";
const CLASE_ETIQUETA = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60";

export default function DetallePQRSPage() {
  const params = useParams<{ id: string }>();
  const {
    pqrs, tieneAcceso, esAdministrador, asignables,
    estado, setEstado,
    prioridad, setPrioridad,
    correoAsignado, setCorreoAsignado,
    respuesta, setRespuesta,
    error, guardando, guardado, handleGuardar,
  } = useDetallePQRS(params.id);

  if (!pqrs) {
    return (
      <div>
        <p className="text-ink/60">Solicitud no encontrada.</p>
        <Link href="/panel/pqrs" className="mt-4 inline-block text-brand hover:text-brand-dark">
          ← Volver al listado
        </Link>
      </div>
    );
  }

  if (!tieneAcceso) {
    return (
      <div>
        <p className="text-ink/60">No tienes permiso para ver esta solicitud.</p>
        <Link href="/panel/pqrs" className="mt-4 inline-block text-brand hover:text-brand-dark">
          ← Volver al listado
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/panel/pqrs" className="text-sm text-ink/60 hover:text-brand">
        ← Volver al listado
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-ink/40">{codigoTicket(pqrs.id)}</span>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ESTILOS_TIPO[pqrs.tipo]}`}>
          {ETIQUETAS_TIPO[pqrs.tipo]}
        </span>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ESTILOS_PRIORIDAD[pqrs.prioridad]}`}>
          Prioridad {ETIQUETAS_PRIORIDAD[pqrs.prioridad].toLowerCase()}
        </span>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ESTILOS_ESTADO[pqrs.estado]}`}>
          {ETIQUETAS_ESTADO[pqrs.estado]}
        </span>
      </div>

      <h1 className="mt-2 font-display text-3xl font-semibold text-ink">{pqrs.asunto}</h1>
      <p className="mt-1 text-sm text-ink/40">
        {nombrePorCorreo(pqrs.correoCreador)} · Unidad {unidadDelCreador(pqrs.correoCreador)} ·{" "}
        {formatearFecha(pqrs.fechaCreacion)}
      </p>

      <div className="mt-6 max-w-lg rounded-xl border border-line bg-white p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-ink/40">Descripción</p>
        <p className="mt-2 text-sm text-ink">{pqrs.descripcion}</p>
      </div>

      {esAdministrador ? (
        <form onSubmit={handleGuardar} className="mt-4 max-w-lg rounded-xl border border-line bg-white p-6">
          <p className="font-display text-lg font-semibold text-ink">Gestionar solicitud</p>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="estado" className={CLASE_ETIQUETA}>Estado</label>
              <select id="estado" value={estado} onChange={(evento) => setEstado(evento.target.value as EstadoPQRS)} className={CLASE_CAMPO}>
                <option value="pendiente">Pendiente</option>
                <option value="en_proceso">En proceso</option>
                <option value="resuelto">Resuelto</option>
              </select>
            </div>

            <div>
              <label htmlFor="prioridad" className={CLASE_ETIQUETA}>Prioridad</label>
              <select id="prioridad" value={prioridad} onChange={(evento) => setPrioridad(evento.target.value as PrioridadPQRS)} className={CLASE_CAMPO}>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="asignado" className={CLASE_ETIQUETA}>Asignado a</label>
            <select id="asignado" value={correoAsignado} onChange={(evento) => setCorreoAsignado(evento.target.value)} className={CLASE_CAMPO}>
              <option value="">Sin asignar</option>
              {asignables.map((persona) => (
                <option key={persona.id} value={persona.correo}>
                  {persona.nombres} {persona.apellidos}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label htmlFor="respuesta" className={CLASE_ETIQUETA}>Respuesta al residente</label>
            <textarea
              id="respuesta"
              rows={4}
              value={respuesta}
              onChange={(evento) => setRespuesta(evento.target.value)}
              placeholder="Escribe la respuesta para el residente..."
              className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink placeholder:text-ink/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>

          {error && <p className="mt-3 text-sm text-error">{error}</p>}
          {guardado && !error && (
            <p className="mt-3 text-sm text-emerald-700">✓ Cambios guardados correctamente.</p>
          )}

          <button
            type="submit"
            disabled={guardando}
            className="mt-4 rounded-lg bg-brand px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
          >
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      ) : pqrs.respuesta ? (
        <div className="mt-4 max-w-lg rounded-xl border border-line bg-brand/5 p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-brand">Respuesta de administración</p>
          <p className="mt-2 text-sm text-ink">{pqrs.respuesta}</p>
          {pqrs.fechaRespuesta && (
            <p className="mt-2 text-xs text-ink/40">Respondido el {formatearFecha(pqrs.fechaRespuesta)}</p>
          )}
        </div>
      ) : (
        <p className="mt-4 text-sm text-ink/40">
          Tu solicitud está {ETIQUETAS_ESTADO[pqrs.estado].toLowerCase()}. Te avisaremos cuando tenga respuesta.
        </p>
      )}
    </div>
  );
}