"use client";

import Link from "next/link";
import { useAsignarParqueadero } from "./useAsignarParqueadero";
import { ETIQUETAS_TIPO } from "../etiquetas";

const CLASE_SELECT =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";
const CLASE_ETIQUETA = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60";

export default function AsignarParqueaderoPage() {
  const {
    esAdministrador,
    disponibles,
    propiedades,
    idParqueadero, setIdParqueadero,
    idPropiedad, setIdPropiedad,
    usados, maximo,
    error, guardando, handleSubmit,
  } = useAsignarParqueadero();

  const enlaceVolver = (
    <Link href="/panel/parqueaderos" className="text-sm text-ink/60 hover:text-brand">
      ← Volver a parqueaderos
    </Link>
  );

  if (!esAdministrador) {
    return (
      <div>
        {enlaceVolver}
        <p className="mt-4 text-ink/60">No tienes permiso para acceder a esta sección.</p>
      </div>
    );
  }

  return (
    <div>
      {enlaceVolver}

      <h1 className="mt-4 font-display text-3xl font-semibold text-ink">Asignar espacio</h1>
      <p className="mt-1 text-ink/60">Asigna un espacio disponible a una propiedad.</p>

      {disponibles.length === 0 ? (
        <p className="mt-6 text-ink/60">No hay espacios disponibles para asignar.</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 flex max-w-lg flex-col gap-5">
          <div>
            <label htmlFor="espacio" className={CLASE_ETIQUETA}>Espacio disponible</label>
            <select id="espacio" value={idParqueadero} onChange={(evento) => setIdParqueadero(evento.target.value)} className={CLASE_SELECT}>
              {disponibles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.numero} · Nivel {p.nivel} · {ETIQUETAS_TIPO[p.tipo]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="propiedad" className={CLASE_ETIQUETA}>Propiedad</label>
            <select id="propiedad" value={idPropiedad} onChange={(evento) => setIdPropiedad(evento.target.value)} className={CLASE_SELECT}>
              {propiedades.map((propiedad) => (
                <option key={propiedad.id} value={propiedad.id}>
                  Torre {propiedad.torre} - {propiedad.numero}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-xs text-ink/50">
              Esta propiedad tiene {usados} de {maximo} espacios asignados.
            </p>
          </div>

          {error && <p className="text-sm text-error">{error}</p>}

          <button
            type="submit"
            disabled={guardando}
            className="mt-2 rounded-lg bg-brand px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
          >
            {guardando ? "Asignando..." : "Asignar espacio"}
          </button>
        </form>
      )}
    </div>
  );
}