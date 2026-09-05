"use client";

import Link from "next/link";
import { useListaPropiedades } from "./useListaPropiedades";

const ETIQUETAS_TIPO: Record<string, string> = {
  apartamento: "Apartamento",
  casa: "Casa",
  local: "Local comercial",
};

export default function PropiedadesPage() {
  const { propiedades, nombrePorId, handleEliminar } = useListaPropiedades();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Propiedades
          </h1>
          <p className="mt-1 text-ink/60">{propiedades.length} propiedad(es) registrada(s)</p>
        </div>

        <Link
          href="/panel/propiedades/nueva"
          className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          + Registrar propiedad
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-canvas">
            <tr>
              <th className="px-4 py-3 font-medium text-ink/60">Propiedad</th>
              <th className="px-4 py-3 font-medium text-ink/60">Tipo</th>
              <th className="px-4 py-3 font-medium text-ink/60">Área</th>
              <th className="px-4 py-3 font-medium text-ink/60">Estado</th>
              <th className="px-4 py-3 font-medium text-ink/60">Propietario</th>
              <th className="px-4 py-3 font-medium text-ink/60">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {propiedades.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink/40">
                  Aún no hay propiedades registradas.
                </td>
              </tr>
            ) : (
              propiedades.map((propiedad) => (
                <tr key={propiedad.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink">
                    Torre {propiedad.torre} - {propiedad.numero}
                  </td>
                  <td className="px-4 py-3 text-ink/70">{ETIQUETAS_TIPO[propiedad.tipo]}</td>
                  <td className="px-4 py-3 text-ink/70">{propiedad.area} m²</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        propiedad.estadoOcupacion === "ocupado"
                          ? "rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700"
                          : "rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-500"
                      }
                    >
                      {propiedad.estadoOcupacion === "ocupado" ? "Ocupado" : "Vacío"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink/70">{nombrePorId(propiedad.idPropietario)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/panel/propiedades/${propiedad.id}`}
                        className="text-sm font-medium text-brand hover:text-brand-dark"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() =>
                          handleEliminar(propiedad.id, `Torre ${propiedad.torre} - ${propiedad.numero}`)
                        }
                        className="text-sm font-medium text-error hover:text-error/70"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}