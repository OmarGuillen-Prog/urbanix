"use client";

import Link from "next/link";
import { useVehiculoFormulario } from "./useVehiculoFormulario";
import { FormInput } from "@/components/FormInput";
import type { TipoVehiculo } from "@/lib/vehiculosStore";

const CLASE_SELECT =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";
const CLASE_ETIQUETA = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60";

export function VehiculoFormulario({ vehiculoId }: { vehiculoId?: string }) {
  const {
    esAdministrador, esEdicion, vehiculoExiste,
    usuarios, espacios,
    placa, setPlaca,
    marca, setMarca,
    modelo, setModelo,
    color, setColor,
    tipoVehiculo, cambiarTipo,
    correoPropietario, cambiarPropietario,
    idParqueadero, setIdParqueadero,
    errores, guardando, handleSubmit,
  } = useVehiculoFormulario(vehiculoId);

  const enlaceVolver = (
    <Link href="/panel/parqueaderos/vehiculos" className="text-sm text-ink/60 hover:text-brand">
      ← Volver a vehículos
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

  if (esEdicion && !vehiculoExiste) {
    return (
      <div>
        {enlaceVolver}
        <p className="mt-4 text-ink/60">Vehículo no encontrado.</p>
      </div>
    );
  }

  return (
    <div>
      {enlaceVolver}

      <h1 className="mt-4 font-display text-3xl font-semibold text-ink">
        {esEdicion ? "Editar vehículo" : "Registrar vehículo"}
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 flex max-w-lg flex-col gap-5">
        <FormInput id="placa" label="Placa" placeholder="ABC123" value={placa} onChange={setPlaca} error={errores.placa} />
        <FormInput id="marca" label="Marca" placeholder="Ej: Mazda" value={marca} onChange={setMarca} error={errores.marca} />

        <div className="grid grid-cols-2 gap-4">
          <FormInput id="modelo" label="Modelo" placeholder="Ej: 3" value={modelo} onChange={setModelo} />
          <FormInput id="color" label="Color" placeholder="Ej: Gris" value={color} onChange={setColor} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="tipoVehiculo" className={CLASE_ETIQUETA}>Tipo</label>
            <select
              id="tipoVehiculo"
              value={tipoVehiculo}
              onChange={(evento) => cambiarTipo(evento.target.value as TipoVehiculo)}
              className={CLASE_SELECT}
            >
              <option value="carro">Carro</option>
              <option value="moto">Moto</option>
            </select>
          </div>

          <div>
            <label htmlFor="propietario" className={CLASE_ETIQUETA}>Propietario</label>
            <select
              id="propietario"
              value={correoPropietario}
              onChange={(evento) => cambiarPropietario(evento.target.value)}
              className={CLASE_SELECT}
            >
              {usuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.correo}>
                  {usuario.nombres} {usuario.apellidos}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="parqueadero" className={CLASE_ETIQUETA}>Parqueadero (opcional)</label>
          <select
            id="parqueadero"
            value={idParqueadero}
            onChange={(evento) => setIdParqueadero(evento.target.value)}
            className={CLASE_SELECT}
          >
            <option value="">Sin parqueadero</option>
            {espacios.map((espacio) => (
              <option key={espacio.id} value={espacio.id}>
                {espacio.numero} · Nivel {espacio.nivel}
              </option>
            ))}
          </select>
          {errores.idParqueadero && <p className="mt-1.5 text-sm text-error">{errores.idParqueadero}</p>}

          {espacios.length === 0 ? (
            <p className="mt-1.5 text-xs text-ink/50">
              Este propietario no tiene espacios libres de este tipo.{" "}
              <Link href="/panel/parqueaderos/asignar" className="text-brand hover:text-brand-dark">
                Asignar un espacio a su propiedad
              </Link>
            </p>
          ) : (
            <p className="mt-1.5 text-xs text-ink/50">
              Solo se muestran espacios asignados a propiedades del propietario, del mismo tipo y sin vehículo.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={guardando}
          className="mt-2 rounded-lg bg-brand px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
        >
          {guardando ? "Guardando..." : esEdicion ? "Guardar cambios" : "Registrar vehículo"}
        </button>
      </form>
    </div>
  );
}