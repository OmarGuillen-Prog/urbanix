"use client";

import Link from "next/link";
import { useVehiculosLista } from "./useVehiculosLista";
import { nombrePorCorreo } from "@/lib/personasHelpers";

export default function VehiculosPage() {
  const { esAdministrador, vehiculos, etiquetaParqueadero } = useVehiculosLista();

  if (!esAdministrador) {
    return (
      <div>
        <p className="text-ink/60">No tienes permiso para acceder a esta sección.</p>
        <Link href="/panel" className="mt-4 inline-block text-brand hover:text-brand-dark">
          ← Volver al panel
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/panel/parqueaderos" className="text-sm text-ink/60 hover:text-brand">
        ← Volver a parqueaderos
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Vehículos</h1>
          <p className="mt-1 text-ink/60">
            {vehiculos.length} vehículo(s) registrado(s) y su parqueadero asignado
          </p>
        </div>

        <Link
          href="/panel/parqueaderos/vehiculos/nuevo"
          className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          + Registrar vehículo
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-line bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-canvas">
              <tr className="text-xs uppercase tracking-wide text-ink/50">
                <th className="px-4 py-3 font-medium">Placa</th>
                <th className="px-4 py-3 font-medium">Vehículo</th>
                <th className="px-4 py-3 font-medium">Color</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Propietario</th>
                <th className="px-4 py-3 font-medium">Parqueadero</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vehiculos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-ink/40">
                    Aún no hay vehículos registrados.
                  </td>
                </tr>
              ) : (
                vehiculos.map((vehiculo) => {
                  const parqueadero = etiquetaParqueadero(vehiculo.idParqueadero);
                  return (
                    <tr key={vehiculo.id} className="border-b border-line last:border-0 hover:bg-canvas/60">
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-ink">{vehiculo.placa}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-ink/70">
                        {vehiculo.marca} {vehiculo.modelo}
                      </td>
                      <td className="px-4 py-3 text-ink/70">{vehiculo.color || "—"}</td>
                      <td className="px-4 py-3 capitalize text-ink/70">{vehiculo.tipoVehiculo}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-ink/70">
                        {nombrePorCorreo(vehiculo.correoPropietario)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {parqueadero ? (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                            {parqueadero}
                          </span>
                        ) : (
                          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500">
                            Sin parqueadero
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <Link
                          href={`/panel/parqueaderos/vehiculos/${vehiculo.id}`}
                          className="text-sm font-medium text-brand hover:text-brand-dark"
                        >
                          Editar
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}