"use client";

import Link from "next/link";
import { useRegistrarNomina } from "./useRegistrarNomina";
import { FormInput } from "@/components/FormInput";
import { formatearMoneda } from "@/lib/formatos";
import type { Departamento, TipoContrato } from "@/lib/nominaStore";
import { ETIQUETAS_DEPARTAMENTO, ETIQUETAS_CONTRATO } from "../etiquetas";

const CLASE_SELECT =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";
const CLASE_ETIQUETA = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60";

export default function NuevaNominaPage() {
  const {
    esAdministrador,
    nombreEmpleado, setNombreEmpleado,
    cargo, setCargo,
    departamento, setDepartamento,
    tipoContrato, setTipoContrato,
    salario, setSalario,
    fechaPago, setFechaPago,
    observaciones, setObservaciones,
    vistaPrevia,
    errores, guardando, handleSubmit,
  } = useRegistrarNomina();

  const enlaceVolver = (
    <Link href="/panel/nominas" className="text-sm text-ink/60 hover:text-brand">
      ← Volver a nómina
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

      <h1 className="mt-4 font-display text-3xl font-semibold text-ink">Registrar pago de nómina</h1>
      <p className="mt-1 text-ink/60">
        Se registra un pago por empleado y por mes. Los descuentos y el neto se calculan solos.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex max-w-lg flex-col gap-5">
        <FormInput
          id="nombreEmpleado"
          label="Nombre del empleado"
          placeholder="Ej: Andrés Vélez"
          value={nombreEmpleado}
          onChange={setNombreEmpleado}
          error={errores.nombreEmpleado}
        />
        <FormInput
          id="cargo"
          label="Cargo"
          placeholder="Ej: Portero"
          value={cargo}
          onChange={setCargo}
          error={errores.cargo}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="departamento" className={CLASE_ETIQUETA}>Departamento</label>
            <select
              id="departamento"
              value={departamento}
              onChange={(evento) => setDepartamento(evento.target.value as Departamento)}
              className={CLASE_SELECT}
            >
              {(Object.keys(ETIQUETAS_DEPARTAMENTO) as Departamento[]).map((clave) => (
                <option key={clave} value={clave}>
                  {ETIQUETAS_DEPARTAMENTO[clave]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="tipoContrato" className={CLASE_ETIQUETA}>Tipo de contrato</label>
            <select
              id="tipoContrato"
              value={tipoContrato}
              onChange={(evento) => setTipoContrato(evento.target.value as TipoContrato)}
              className={CLASE_SELECT}
            >
              {(Object.keys(ETIQUETAS_CONTRATO) as TipoContrato[]).map((clave) => (
                <option key={clave} value={clave}>
                  {ETIQUETAS_CONTRATO[clave]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <FormInput
          id="salario"
          label="Salario base mensual (COP)"
          type="number"
          placeholder="Ej: 1750905"
          value={salario}
          onChange={setSalario}
          error={errores.salario}
        />
        <FormInput
          id="fechaPago"
          label="Fecha de pago"
          type="date"
          value={fechaPago}
          onChange={setFechaPago}
          error={errores.fechaPago}
        />

        <div>
          <label htmlFor="observaciones" className={CLASE_ETIQUETA}>Observaciones (opcional)</label>
          <textarea
            id="observaciones"
            rows={2}
            placeholder="Ej: Incluye recargo por horas extra"
            value={observaciones}
            onChange={(evento) => setObservaciones(evento.target.value)}
            className={CLASE_SELECT}
          />
        </div>

        {/* Vista previa: aparece apenas hay un salario valido */}
        {vistaPrevia && (
          <div className="rounded-xl border border-line bg-canvas p-4 text-sm">
            <p className="font-medium text-ink">Vista previa de la liquidación</p>
            <dl className="mt-2 flex flex-col gap-1 text-ink/70">
              <div className="flex justify-between"><dt>Auxilio de transporte</dt><dd>{formatearMoneda(vistaPrevia.auxilio)}</dd></div>
              <div className="flex justify-between"><dt>Salud</dt><dd className="text-error">-{formatearMoneda(vistaPrevia.salud)}</dd></div>
              <div className="flex justify-between"><dt>Pensión</dt><dd className="text-error">-{formatearMoneda(vistaPrevia.pension)}</dd></div>
              <div className="flex justify-between border-t border-line pt-1 font-semibold text-ink">
                <dt>Neto a pagar</dt>
                <dd className="text-emerald-600">{formatearMoneda(vistaPrevia.neto)}</dd>
              </div>
            </dl>
          </div>
        )}

        <button
          type="submit"
          disabled={guardando}
          className="mt-2 rounded-lg bg-brand px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
        >
          {guardando ? "Guardando..." : "Registrar pago"}
        </button>
      </form>
    </div>
  );
}