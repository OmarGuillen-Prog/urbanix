import Link from "next/link";
import type { Comunicado } from "@/lib/comunicadosStore";
import { nombrePorCorreo } from "@/lib/personasHelpers";
import {
  ETIQUETAS_CATEGORIA,
  ESTILOS_CATEGORIA,
  ETIQUETAS_DESTINO,
  ETIQUETAS_ESTADO,
  ESTILOS_ESTADO,
} from "./etiquetas";

interface TarjetaComunicadoProps {
  comunicado: Comunicado;
  expandido: boolean;
  esAdministrador: boolean;
  esNuevo: boolean; // el residente todavia no lo ha abierto
  onAlternarExpandido: () => void;
  onAlternarFijado: () => void;
  onEliminar: () => void;
}

function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
}

export function TarjetaComunicado({
  comunicado,
  expandido,
  esAdministrador,
  esNuevo,
  onAlternarExpandido,
  onAlternarFijado,
  onEliminar,
}: TarjetaComunicadoProps) {
  return (
    <article
      className={`rounded-xl border p-5 ${
        comunicado.fijado ? "border-brand/40 bg-brand/5" : "border-line bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {comunicado.fijado && <span aria-hidden="true">📌</span>}
            <h3 className="font-display text-lg font-semibold text-ink">{comunicado.titulo}</h3>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ESTILOS_CATEGORIA[comunicado.categoria]}`}>
              {ETIQUETAS_CATEGORIA[comunicado.categoria]}
            </span>
            {comunicado.fijado && (
              <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">Fijado</span>
            )}
            {esNuevo && (
              <span className="rounded-full bg-error px-2 py-0.5 text-xs font-medium text-white">Nuevo</span>
            )}
          </div>

          {/* whitespace-pre-line respeta los saltos de linea que escribio el administrador */}
          <p className={`mt-2 whitespace-pre-line text-sm text-ink/70 ${expandido ? "" : "line-clamp-2"}`}>
            {comunicado.contenido}
          </p>

          <button
            onClick={onAlternarExpandido}
            aria-expanded={expandido}
            className="mt-1 text-sm font-medium text-brand hover:text-brand-dark"
          >
            {expandido ? "Ver menos" : "Ver más"}
          </button>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-ink/50">
            <span>📅 {formatearFecha(comunicado.fechaPublicacion)}</span>
            <span>👥 {ETIQUETAS_DESTINO[comunicado.destino]}</span>
            {esAdministrador && <span>👁 {comunicado.vistoPor.length} visualizaciones</span>}
            <span>Por: {nombrePorCorreo(comunicado.correoAutor)}</span>
          </div>
        </div>

        {/* Acciones: solo el administrador */}
        {esAdministrador && (
          <div className="flex shrink-0 items-center gap-1">
            <span className={`mr-1 rounded-full px-2 py-0.5 text-xs font-medium ${ESTILOS_ESTADO[comunicado.estado]}`}>
              {ETIQUETAS_ESTADO[comunicado.estado]}
            </span>
            <button
              onClick={onAlternarFijado}
              aria-label={comunicado.fijado ? "Quitar de fijados" : "Fijar al inicio"}
              title={comunicado.fijado ? "Quitar de fijados" : "Fijar al inicio"}
              className={`rounded-lg px-2 py-1 text-sm transition-colors hover:bg-canvas ${
                comunicado.fijado ? "text-brand" : "text-ink/40"
              }`}
            >
              📌
            </button>
            <Link
              href={`/panel/comunicados/${comunicado.id}`}
              aria-label="Editar comunicado"
              title="Editar"
              className="rounded-lg px-2 py-1 text-sm text-ink/50 transition-colors hover:bg-canvas hover:text-brand"
            >
              ✏️
            </Link>
            <button
              onClick={onEliminar}
              aria-label="Eliminar comunicado"
              title="Eliminar"
              className="rounded-lg px-2 py-1 text-sm text-ink/50 transition-colors hover:bg-canvas hover:text-error"
            >
              🗑
            </button>
          </div>
        )}
      </div>
    </article>
  );
}