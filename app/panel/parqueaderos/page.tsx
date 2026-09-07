"use client";

import Link from "next/link";
import { useParqueaderosLista } from "./useParqueaderosLista";

export default function ParqueaderosPage() {
  const { parqueaderos, propiedades, etiquetaPropiedad, handleAsignar, error } = useParqueaderosLista();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Parqueaderos
          </h1>
          <p className="mt-1 text-ink/60">
            {parqueaderos.filter((p) => p.idPropiedad !== null).length} de {parqueaderos.length} asignados
          </p>
        </div>

        <Link
          href="/panel/parqueaderos/vehiculos"
          className="rounded-lg border border-line px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-brand hover:text-brand"
        >
          Ver vehículos →
        </Link>
      </div>

      {/* Error de cupo maximo - vive arriba de la tabla porque puede
          originarse desde cualquier fila, no una en particular */}
      {error && (
        <div className="mt-4 rounded-lg border border-error/30 bg-error/5 px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-xl border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-canvas">
            <tr>
              <th className="px-4 py-3 font-medium text-ink/60">Número</th>
              <th className="px-4 py-3 font-medium text-ink/60">Tipo</th>
              <th className="px-4 py-3 font-medium text-ink/60">Estado</th>
              <th className="px-4 py-3 font-medium text-ink/60">Propiedad asignada</th>
            </tr>
          </thead>
          <tbody>
            {parqueaderos.map((parqueadero) => (
              <tr key={parqueadero.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 text-ink">{parqueadero.numero}</td>
                <td className="px-4 py-3 text-ink/70 capitalize">{parqueadero.tipo}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      parqueadero.idPropiedad
                        ? "rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700"
                        : "rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-500"
                    }
                  >
                    {parqueadero.idPropiedad ? "Asignado" : "Libre"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {/* El select ES la accion aqui - no hay un boton
                      separado de "editar", cambiar la opcion ya
                      dispara la asignacion o liberacion */}
                  <select
                    value={parqueadero.idPropiedad ?? ""}
                    onChange={(evento) => handleAsignar(parqueadero.id, evento.target.value)}
                    className="rounded-lg border border-line bg-white px-3 py-1.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                  >
                    <option value="">Sin asignar</option>
                    {propiedades.map((propiedad) => (
                      <option key={propiedad.id} value={propiedad.id}>
                        Torre {propiedad.torre} - {propiedad.numero}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}