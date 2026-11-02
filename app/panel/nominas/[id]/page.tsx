"use client";

import Link from "next/link";
import { useDetalleNomina } from "./useDetalleNomina";
import { formatearMoneda } from "@/lib/formatos";
import { nombrePorCorreo } from "@/lib/personasHelpers";
import { PARAMETROS_NOMINA } from "@/lib/nominaStore";
import {
  ETIQUETAS_DEPARTAMENTO,
  ETIQUETAS_CONTRATO,
  ESTILOS_CONTRATO,
  ETIQUETAS_ESTADO_PAGO,
  ESTILOS_ESTADO_PAGO,
  iniciales,
} from "../etiquetas";

function formatearFecha(fecha: string): string {
  return new Date(`${fecha}T00:00:00`).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
}

function Fila({ etiqueta, valor, tono }: { etiqueta: string; valor: string; tono?: "rojo" | "verde" }) {
  const color = tono === "rojo" ? "text-error" : tono === "verde" ? "text-emerald-600" : "text-ink";
  return (
    <div className="flex items-center justify-between border-b border-line py-3 last:border-0">
      <span className="text-sm text-ink/60">{etiqueta}</span>
      <span className={`text-sm font-medium ${color}`}>{valor}</span>
    </div>
  );
}

export default function DetalleNominaPage() {
  const { esAdministrador, registro, liquidacion, handleMarcarPagado } = useDetalleNomina();

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

  if (!registro || !liquidacion) {
    return (
      <div>
        {enlaceVolver}
        <p className="mt-4 text-ink/60">Registro de nómina no encontrado.</p>
      </div>
    );
  }

  // Los porcentajes salen de los parametros: si cambian, la pantalla se actualiza sola
  const porcentajeSalud = Math.round(PARAMETROS_NOMINA.tasaSalud * 100);
  const porcentajePension = Math.round(PARAMETROS_NOMINA.tasaPension * 100);

  return (
    <div>
      {enlaceVolver}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-zinc-600 text-lg font-medium text-white"
            aria-hidden="true"
          >
            {iniciales(registro.nombreEmpleado)}
          </span>
          <div>
            <h1 className="font-display text-3xl font-semibold text-ink">{registro.nombreEmpleado}</h1>
            <p className="mt-1 text-ink/60">
              {registro.cargo} · {ETIQUETAS_DEPARTAMENTO[registro.departamento]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ESTILOS_CONTRATO[registro.tipoContrato]}`}>
            {ETIQUETAS_CONTRATO[registro.tipoContrato]}
          </span>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ESTILOS_ESTADO_PAGO[registro.estadoPago]}`}>
            {ETIQUETAS_ESTADO_PAGO[registro.estadoPago]}
          </span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-line bg-white p-5">
          <h2 className="font-display text-lg font-semibold text-ink">Liquidación</h2>
          <div className="mt-2">
            <Fila etiqueta="Salario base" valor={formatearMoneda(liquidacion.salarioBase)} />
            <Fila etiqueta="Auxilio de transporte" valor={formatearMoneda(liquidacion.auxilio)} />
            <Fila etiqueta="Total devengado (bruto)" valor={formatearMoneda(liquidacion.bruto)} />
            <Fila etiqueta={`Salud (${porcentajeSalud}%)`} valor={`-${formatearMoneda(liquidacion.salud)}`} tono="rojo" />
            <Fila etiqueta={`Pensión (${porcentajePension}%)`} valor={`-${formatearMoneda(liquidacion.pension)}`} tono="rojo" />
            <Fila etiqueta="Neto a pagar" valor={formatearMoneda(liquidacion.neto)} tono="verde" />
          </div>
        </section>

        <section className="rounded-xl border border-line bg-white p-5">
          <h2 className="font-display text-lg font-semibold text-ink">Información del pago</h2>
          <div className="mt-2">
            <Fila etiqueta="Fecha de pago" valor={formatearFecha(registro.fechaPago)} />
            <Fila etiqueta="Registrado por" valor={nombrePorCorreo(registro.correoAdministrador)} />
            <Fila etiqueta="Observaciones" valor={registro.observaciones === "" ? "—" : registro.observaciones} />
          </div>

          {registro.estadoPago === "pendiente" && (
            <button
              onClick={handleMarcarPagado}
              className="mt-5 w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
            >
              Marcar como pagado
            </button>
          )}
          <p className="mt-4 text-xs text-ink/50">
            El pago real se procesa en el sistema contable externo; aquí solo se registra su control. Cálculo de
            referencia con parámetros {PARAMETROS_NOMINA.anio}: descuentos de salud y pensión sobre el salario base y
            auxilio de transporte para quien gana hasta 2 salarios mínimos.
          </p>
        </section>
      </div>
    </div>
  );
}