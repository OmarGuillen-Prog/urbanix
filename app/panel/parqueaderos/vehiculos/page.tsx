"use client";

import Link from "next/link";
import { useVehiculosForm } from "./useVehiculosForm";
import { FormInput } from "@/components/FormInput";

export default function VehiculosPage() {
  const {
    usuarios, parqueaderosDisponibles, vehiculos,
    placa, setPlaca, marca, setMarca, modelo, setModelo, color, setColor,
    tipoVehiculo, setTipoVehiculo, correoPropietario, setCorreoPropietario,
    idParqueadero, setIdParqueadero,
    errores, guardando, handleSubmit,
  } = useVehiculosForm();

  return (
    <div>
      <Link href="/panel/parqueaderos" className="text-sm text-ink/60 hover:text-brand">
        ← Volver a parqueaderos
      </Link>

      <h1 className="mt-4 font-display text-3xl font-semibold text-ink">Vehículos</h1>

      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl rounded-xl border border-line bg-white p-6">
        <p className="font-display text-lg font-semibold text-ink">Registrar vehículo</p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput id="placa" label="Placa" placeholder="ABC123" value={placa} onChange={setPlaca} error={errores.placa} />
          <FormInput id="marca" label="Marca" placeholder="Ej: Mazda" value={marca} onChange={setMarca} error={errores.marca} />
          <FormInput id="modelo" label="Modelo" placeholder="Ej: 3" value={modelo} onChange={setModelo} />
          <FormInput id="color" label="Color" placeholder="Ej: Gris" value={color} onChange={setColor} />

          <div>
            <label htmlFor="tipoVehiculo" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
              Tipo
            </label>
            <select
              id="tipoVehiculo"
              value={tipoVehiculo}
              onChange={(evento) => setTipoVehiculo(evento.target.value as "carro" | "moto")}
              className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            >
              <option value="carro">Carro</option>
              <option value="moto">Moto</option>
            </select>
          </div>

          <div>
            <label htmlFor="propietario" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
              Propietario
            </label>
            <select
              id="propietario"
              value={correoPropietario}
              onChange={(evento) => setCorreoPropietario(evento.target.value)}
              className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            >
              {usuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.correo}>
                  {usuario.nombres} {usuario.apellidos}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="parqueadero" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
              Parqueadero (opcional)
            </label>
            <select
              id="parqueadero"
              value={idParqueadero}
              onChange={(evento) => setIdParqueadero(evento.target.value)}
              className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            >
              <option value="">Sin asignar</option>
              {parqueaderosDisponibles.map((parqueadero) => (
                <option key={parqueadero.id} value={parqueadero.id}>
                  {parqueadero.numero} ({parqueadero.tipo})
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={guardando}
          className="mt-4 rounded-lg bg-brand px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
        >
          {guardando ? "Guardando..." : "Registrar vehículo"}
        </button>
      </form>

      <p className="mt-10 font-display text-lg font-semibold text-ink">Vehículos registrados</p>

      <div className="mt-4 overflow-hidden rounded-xl border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-canvas">
            <tr>
              <th className="px-4 py-3 font-medium text-ink/60">Placa</th>
              <th className="px-4 py-3 font-medium text-ink/60">Marca / Modelo</th>
              <th className="px-4 py-3 font-medium text-ink/60">Tipo</th>
              <th className="px-4 py-3 font-medium text-ink/60">Propietario</th>
            </tr>
          </thead>
          <tbody>
            {vehiculos.map((vehiculo) => {
              const propietario = usuarios.find((u) => u.correo === vehiculo.correoPropietario);
              return (
                <tr key={vehiculo.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{vehiculo.placa}</td>
                  <td className="px-4 py-3 text-ink/70">{vehiculo.marca} {vehiculo.modelo}</td>
                  <td className="px-4 py-3 capitalize text-ink/70">{vehiculo.tipoVehiculo}</td>
                  <td className="px-4 py-3 text-ink/70">
                    {propietario ? `${propietario.nombres} ${propietario.apellidos}` : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}