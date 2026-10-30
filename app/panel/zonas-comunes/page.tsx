"use client";

import { useEvaluacionesZonas } from "./useEvaluacionesZonas";
import { useReglasZonas } from "./useReglasZonas";
import { ResumenTarjetas } from "@/components/ResumenTarjetas";
import { TarjetaZona } from "./TarjetaZona";
import { Estrellas } from "./Estrellas";
import { iconoDeZona } from "./etiquetas";
import { nombreDeZona } from "@/lib/reservasStore";
import { nombrePorCorreo } from "@/lib/personasHelpers";

function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
}

// Solo el primer nombre: no exponemos el nombre completo de un residente a los demas
function primerNombre(nombreCompleto: string): string {
  return nombreCompleto.split(" ")[0];
}

const CLASE_CAMPO =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";
const CLASE_ETIQUETA = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60";

export default function ZonasComunesPage() {
  const {
    esResidente,
    zonas,
    resumenDeZona,
    totalEvaluaciones,
    promedioGeneral,
    mejorZona,
    comentarios,
    totalComentarios,
    filtroZona, setFiltroZona,
    idZona, setIdZona,
    calificacion, setCalificacion,
    comentario, setComentario,
    error, guardando, enviado, handleSubmit,
  } = useEvaluacionesZonas();

  const {
    zonas: zonasConReglas,
    esAdministrador,
    idEnEdicion,
    borrador,
    setBorrador,
    guardando: guardandoReglas,
    iniciarEdicion,
    cancelarEdicion,
    guardarEdicion,
  } = useReglasZonas();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Zonas comunes</h1>
          <p className="mt-1 text-ink/60">Consulta las zonas, sus reglas de uso y las opiniones de los residentes.</p>
        </div>
      </div>

      <ResumenTarjetas
        items={[
          { etiqueta: "Zonas comunes", valor: zonas.length, icono: "🏛️", tono: "brand" },
          { etiqueta: "Calificación promedio", valor: promedioGeneral === null ? "—" : promedioGeneral.toFixed(1), icono: "⭐", tono: "dorado" },
          { etiqueta: "Evaluaciones", valor: totalEvaluaciones, icono: "💬", tono: "verde" },
          { etiqueta: "Mejor calificada", valor: mejorZona ? mejorZona.nombre : "—", icono: "🏆", tono: "gris" },
        ]}
      />

      {/* Tarjetas de zona: 1 columna en pantallas angostas, 2 en anchas.
          Las celdas del grid se estiran al mismo alto, y cada tarjeta alinea sus botones abajo. */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {zonasConReglas.map((zona) => {
          const { promedio, total } = resumenDeZona(zona.id);
          return (
            <TarjetaZona
              key={zona.id}
              zona={zona}
              icono={iconoDeZona(zona.id)}
              promedio={promedio}
              totalEvaluaciones={total}
              esAdministrador={esAdministrador}
              editando={idEnEdicion === zona.id}
              borrador={borrador}
              guardando={guardandoReglas}
              onEditar={() => iniciarEdicion(zona.id, zona.reglas)}
              onCancelar={cancelarEdicion}
              onCambiarBorrador={setBorrador}
              onGuardar={guardarEdicion}
            />
          );
        })}
      </div>

      {/* items-start: cada columna mide lo que necesita, sin estirarse a la mas alta */}
      <div className="mt-8 grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <section
          className={`rounded-xl border border-line bg-white p-5 ${esResidente ? "lg:col-span-2" : "lg:col-span-3"}`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold text-ink">Comentarios recientes</h2>
            <select
              value={filtroZona}
              onChange={(evento) => setFiltroZona(evento.target.value)}
              aria-label="Filtrar comentarios por zona"
              className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            >
              <option value="todas">Todas las zonas</option>
              {zonas.map((zona) => (
                <option key={zona.id} value={zona.id}>
                  {zona.nombre}
                </option>
              ))}
            </select>
          </div>

          {comentarios.length === 0 ? (
            <p className="mt-4 text-sm text-ink/40">Aún no hay evaluaciones para mostrar.</p>
          ) : (
            <ul className="mt-4 flex flex-col gap-3">
              {comentarios.map((evaluacion) => (
                <li key={evaluacion.id} className="rounded-lg border border-line p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-ink">{nombreDeZona(evaluacion.idZona)}</span>
                      <Estrellas calificacion={evaluacion.calificacion} />
                    </div>
                    <span className="text-xs text-ink/40">{formatearFecha(evaluacion.fecha)}</span>
                  </div>
                  <p className="mt-2 text-sm text-ink/70">{evaluacion.comentario}</p>
                  <p className="mt-2 text-xs text-ink/40">{primerNombre(nombrePorCorreo(evaluacion.correoResidente))}</p>
                </li>
              ))}
            </ul>
          )}

          {totalComentarios > comentarios.length && (
            <p className="mt-3 text-xs text-ink/40">
              Mostrando los {comentarios.length} más recientes de {totalComentarios}.
            </p>
          )}
        </section>

        {/* HU-46: el formulario es solo para el residente */}
        {esResidente && (
          <form onSubmit={handleSubmit} className="rounded-xl border border-line bg-white p-5">
            <h2 className="font-display text-lg font-semibold text-ink">Dejar una evaluación</h2>

            <div className="mt-4">
              <label htmlFor="zona" className={CLASE_ETIQUETA}>Zona común</label>
              <select id="zona" value={idZona} onChange={(evento) => setIdZona(evento.target.value)} className={CLASE_CAMPO}>
                {zonas.map((zona) => (
                  <option key={zona.id} value={zona.id}>
                    {zona.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <p className={CLASE_ETIQUETA}>Calificación</p>
              <div className="flex gap-1 text-2xl text-gold" role="group" aria-label="Calificación">
                {[1, 2, 3, 4, 5].map((valor) => (
                  <button
                    key={valor}
                    type="button"
                    onClick={() => setCalificacion(valor)}
                    aria-label={`${valor} ${valor === 1 ? "estrella" : "estrellas"}`}
                    aria-pressed={valor === calificacion}
                    className="transition-transform hover:scale-110"
                  >
                    {valor <= calificacion ? "★" : "☆"}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="comentario" className={CLASE_ETIQUETA}>Comentario</label>
              <textarea
                id="comentario"
                rows={4}
                value={comentario}
                onChange={(evento) => setComentario(evento.target.value)}
                placeholder="Cuéntanos tu experiencia..."
                className={CLASE_CAMPO}
              />
              {error && <p className="mt-1.5 text-sm text-error">{error}</p>}
            </div>

            {enviado && <p className="mt-3 text-sm text-emerald-700">✓ ¡Gracias por tu evaluación!</p>}

            <button
              type="submit"
              disabled={guardando}
              className="mt-4 w-full rounded-lg bg-brand px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
            >
              {guardando ? "Enviando..." : "Enviar evaluación"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}