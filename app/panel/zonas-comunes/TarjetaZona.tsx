import Link from "next/link";
import { Estrellas } from "./Estrellas";
import type { ZonaComun } from "@/lib/reservasStore";

interface TarjetaZonaProps {
  zona: ZonaComun;
  icono: string;
  promedio: number | null;
  totalEvaluaciones: number;
  esAdministrador: boolean;
  editando: boolean;
  borrador: string;
  guardando: boolean;
  onEditar: () => void;
  onCancelar: () => void;
  onCambiarBorrador: (texto: string) => void;
  onGuardar: () => void;
}

export function TarjetaZona({
  zona,
  icono,
  promedio,
  totalEvaluaciones,
  esAdministrador,
  editando,
  borrador,
  guardando,
  onEditar,
  onCancelar,
  onCambiarBorrador,
  onGuardar,
}: TarjetaZonaProps) {
  return (
    // flex-col + h-full: la tarjeta es una columna que ocupa TODO el alto de su celda
    <article className="flex h-full flex-col rounded-xl border border-line bg-white p-5">
      <header className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-xl">
          {icono}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-semibold text-ink">{zona.nombre}</h3>
          <p className="text-xs text-ink/50">Capacidad: {zona.capacidad} personas</p>
        </div>

        <div className="shrink-0 text-right">
          {promedio === null ? (
            <p className="text-xs text-ink/40">Sin calificaciones</p>
          ) : (
            <>
              <p className="font-display text-xl font-semibold text-ink">{promedio.toFixed(1)}</p>
              <p className="text-xs text-ink/50">{totalEvaluaciones} evaluación(es)</p>
            </>
          )}
        </div>
      </header>

      {promedio !== null && (
        <div className="mt-2">
          <Estrellas calificacion={Math.round(promedio)} />
        </div>
      )}

      {/* flex-1: este bloque absorbe el espacio sobrante y empuja los botones al fondo */}
      <section className="mt-4 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-ink/40">Reglas de uso</p>

        {editando ? (
          <>
            <label htmlFor={`reglas-${zona.id}`} className="sr-only">
              Reglas de uso de {zona.nombre}
            </label>
            <textarea
              id={`reglas-${zona.id}`}
              rows={4}
              value={borrador}
              onChange={(evento) => onCambiarBorrador(evento.target.value)}
              className="mt-1.5 w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </>
        ) : (
          <p className="mt-1.5 text-sm text-ink/70">{zona.reglas || "Aún no hay reglas definidas."}</p>
        )}
      </section>

      <footer className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
        {editando ? (
          <>
            <button
              onClick={onGuardar}
              disabled={guardando}
              className="flex-1 rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
            >
              {guardando ? "Guardando..." : "Guardar reglas"}
            </button>
            <button
              onClick={onCancelar}
              disabled={guardando}
              className="flex-1 rounded-lg border border-line px-3 py-2 text-sm font-medium text-ink transition-colors hover:border-brand hover:text-brand disabled:opacity-50"
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <Link
              href="/panel/reservas/nueva"
              className="flex-1 rounded-lg bg-brand px-3 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-brand-dark"
            >
              Reservar
            </Link>
            {esAdministrador && (
              <button
                onClick={onEditar}
                className="flex-1 rounded-lg border border-line px-3 py-2 text-sm font-medium text-ink transition-colors hover:border-brand hover:text-brand"
              >
                Editar reglas
              </button>
            )}
          </>
        )}
      </footer>
    </article>
  );
}