"use client";

import { useEvaluacionesZonas } from "./useEvaluacionesZonas";
import { promedioDeZona } from "@/lib/evaluacionesStore";

function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
}

// Un pequeño componente reutilizable dentro del mismo archivo, para
// dibujar N estrellas llenas/vacias segun una calificacion - evita
// repetir la logica de "cuantas rellenar" en 3 lugares distintos.
function Estrellas({ calificacion }: { calificacion: number }) {
  return (
    <div className="flex gap-0.5 text-gold">
      {[1, 2, 3, 4, 5].map((valor) => (
        <span key={valor}>{valor <= calificacion ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

export default function ZonasComunesPage() {
  const {
    zonas, evaluaciones, nombreZona,
    idZona, setIdZona,
    calificacion, setCalificacion,
    comentario, setComentario,
    errores, guardando, handleSubmit,
  } = useEvaluacionesZonas();

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Zonas comunes</h1>
      <p className="mt-1 text-ink/60">Consulta calificaciones y comparte tu experiencia.</p>

      {/* Resumen de promedios por zona - lo primero que se ve */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {zonas.map((zona) => {
          const promedio = promedioDeZona(zona.id);
          return (
            <div key={zona.id} className="rounded-xl border border-line bg-white p-5">
              <p className="font-medium text-ink">{zona.nombre}</p>
              {promedio === null ? (
                <p className="mt-2 text-sm text-ink/40">Sin calificaciones aún</p>
              ) : (
                <div className="mt-2 flex items-center gap-2">
                  <Estrellas calificacion={Math.round(promedio)} />
                  <span className="text-sm text-ink/60">{promedio.toFixed(1)} / 5</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Formulario para dejar una evaluacion */}
      <form onSubmit={handleSubmit} className="mt-8 max-w-lg rounded-xl border border-line bg-white p-6">
        <p className="font-display text-lg font-semibold text-ink">Dejar una evaluación</p>

        <div className="mt-4">
          <label htmlFor="zona" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
            Zona común
          </label>
          <select
            id="zona"
            value={idZona}
            onChange={(evento) => setIdZona(evento.target.value)}
            className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          >
            {zonas.map((zona) => (
              <option key={zona.id} value={zona.id}>{zona.nombre}</option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
            Calificación
          </label>
          {/* Estrellas clickeables: cada una es un boton que fija la
              calificacion a su propio numero */}
          <div className="flex gap-1 text-2xl text-gold">
            {[1, 2, 3, 4, 5].map((valor) => (
              <button
                key={valor}
                type="button"
                onClick={() => setCalificacion(valor)}
                className="transition-transform hover:scale-110"
              >
                {valor <= calificacion ? "★" : "☆"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="comentario" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
            Comentario
          </label>
          <textarea
            id="comentario"
            rows={3}
            value={comentario}
            onChange={(evento) => setComentario(evento.target.value)}
            placeholder="Cuéntanos tu experiencia..."
            className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink placeholder:text-ink/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
          {errores.comentario && <p className="mt-1.5 text-sm text-error">{errores.comentario}</p>}
        </div>

        <button
          type="submit"
          disabled={guardando}
          className="mt-4 rounded-lg bg-brand px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
        >
          {guardando ? "Enviando..." : "Enviar evaluación"}
        </button>
      </form>

      {/* Lista de comentarios recientes */}
      <p className="mt-10 font-display text-lg font-semibold text-ink">Comentarios recientes</p>

      <div className="mt-4 flex flex-col gap-3">
        {evaluaciones.length === 0 ? (
          <p className="text-ink/40">Aún no hay evaluaciones.</p>
        ) : (
          [...evaluaciones].reverse().map((evaluacion) => (
            <div key={evaluacion.id} className="rounded-xl border border-line bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-ink">{nombreZona(evaluacion.idZona)}</p>
                <Estrellas calificacion={evaluacion.calificacion} />
              </div>
              <p className="mt-2 text-sm text-ink/70">{evaluacion.comentario}</p>
              <p className="mt-2 text-xs text-ink/40">{formatearFecha(evaluacion.fecha)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}