"use client";

import Link from "next/link";
import { useNominaLista } from "./useNominaLista";
import { ResumenTarjetas } from "@/components/ResumenTarjetas";
import { formatearMoneda } from "@/lib/formatos";
import type { Departamento, TipoContrato } from "@/lib/nominaStore";
import {
  ETIQUETAS_DEPARTAMENTO,
  ETIQUETAS_CONTRATO,
  ESTILOS_CONTRATO,
  ETIQUETAS_ESTADO_PAGO,
  ESTILOS_ESTADO_PAGO,
  iniciales,
} from "./etiquetas";

const CLASE_SELECT =
  "rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

export default function NominasPage() {
  const {
    esAdministrador,
    periodos,
    periodo, setPeriodo,
    busqueda, setBusqueda,
    filtroDepartamento, setFiltroDepartamento,
    filtroContrato, setFiltroContrato,
    filtroEstado, setFiltroEstado,
    resumen,
    porDepartamento,
    filas,
  } = useNominaLista();

  // Modulo exclusivo del administrador (la seguridad real vive en el backend)
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Control de nómina</h1>
          <p className="mt-1 text-ink/60">Visualización y control administrativo de pagos a empleados</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-ink/60">
            Período
            <select
              value={periodo}
              onChange={(evento) => setPeriodo(evento.target.value)}
              aria-label="Período de nómina"
              className={CLASE_SELECT}
            >
              {periodos.map((p) => (
                <option key={p.valor} value={p.valor}>
                  {p.etiqueta}
                </option>
              ))}
            </select>
          </label>
          <Link
            href="/panel/nominas/nuevo"
            className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
          >
            + Registrar pago
          </Link>
        </div>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
        <span aria-hidden="true">🏢</span>
        <div>
          <p className="font-medium">Módulo de control administrativo</p>
          <p className="mt-0.5 text-sky-700">
            Este módulo es solo para visualización y control de nómina. Los pagos se procesan a través del sistema
            contable externo. Los cálculos son valores de referencia.
          </p>
        </div>
      </div>

      <ResumenTarjetas
        items={[
          { etiqueta: "Total empleados", valor: resumen.empleados, icono: "👥", tono: "brand" },
          { etiqueta: "Total bruto", valor: formatearMoneda(resumen.bruto), icono: "💵", tono: "verde" },
          { etiqueta: "Total neto", valor: formatearMoneda(resumen.neto), icono: "📈", tono: "gris" },
          { etiqueta: "Pendientes de pago", valor: resumen.pendientes, icono: "⏳", tono: "dorado" },
        ]}
      />

      <section className="mt-6 rounded-xl border border-line bg-white p-5">
        <h2 className="font-display text-lg font-semibold text-ink">Resumen por departamento</h2>

        {porDepartamento.length === 0 ? (
          <p className="mt-3 text-sm text-ink/40">No hay empleados registrados en este período.</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {porDepartamento.map((fila) => (
              <div key={fila.departamento} className="rounded-lg bg-canvas p-4">
                <p className="text-sm text-ink/60">{ETIQUETAS_DEPARTAMENTO[fila.departamento]}</p>
                <p className="mt-1 font-display text-lg font-semibold text-brand">{fila.empleados} empleado(s)</p>
                <p className="mt-0.5 text-xs text-ink/50">{formatearMoneda(fila.neto)} neto</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Buscar empleado por nombre o cargo..."
          value={busqueda}
          onChange={(evento) => setBusqueda(evento.target.value)}
          className="w-full max-w-md rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink placeholder:text-ink/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
        <select
          value={filtroDepartamento}
          onChange={(evento) => setFiltroDepartamento(evento.target.value as Departamento | "todos")}
          aria-label="Filtrar por departamento"
          className={CLASE_SELECT}
        >
          <option value="todos">Todos los departamentos</option>
          {(Object.keys(ETIQUETAS_DEPARTAMENTO) as Departamento[]).map((clave) => (
            <option key={clave} value={clave}>
              {ETIQUETAS_DEPARTAMENTO[clave]}
            </option>
          ))}
        </select>
        <select
          value={filtroContrato}
          onChange={(evento) => setFiltroContrato(evento.target.value as TipoContrato | "todos")}
          aria-label="Filtrar por tipo de contrato"
          className={CLASE_SELECT}
        >
          <option value="todos">Todos los contratos</option>
          {(Object.keys(ETIQUETAS_CONTRATO) as TipoContrato[]).map((clave) => (
            <option key={clave} value={clave}>
              {ETIQUETAS_CONTRATO[clave]}
            </option>
          ))}
        </select>
        <select
          value={filtroEstado}
          onChange={(evento) => setFiltroEstado(evento.target.value as "pagado" | "pendiente" | "todos")}
          aria-label="Filtrar por estado"
          className={CLASE_SELECT}
        >
          <option value="todos">Todos los estados</option>
          <option value="pagado">Al día</option>
          <option value="pendiente">Pendiente</option>
        </select>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-line bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-canvas">
              <tr className="text-xs uppercase tracking-wide text-ink/50">
                <th className="px-4 py-3 font-medium">Empleado</th>
                <th className="px-4 py-3 font-medium">Cargo / Dpto.</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 text-right font-medium">Salario base</th>
                <th className="px-4 py-3 text-right font-medium">Transp.</th>
                <th className="px-4 py-3 text-right font-medium">Salud</th>
                <th className="px-4 py-3 text-right font-medium">Pensión</th>
                <th className="px-4 py-3 text-right font-medium">Neto</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 text-center font-medium">Ver</th>
              </tr>
            </thead>
            <tbody>
              {filas.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-10 text-center text-ink/40">
                    No se encontraron empleados con esos criterios.
                  </td>
                </tr>
              ) : (
                filas.map(({ registro, liquidacion }) => (
                  <tr key={registro.id} className="border-b border-line last:border-0 hover:bg-canvas/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-600 text-xs font-medium text-white"
                          aria-hidden="true"
                        >
                          {iniciales(registro.nombreEmpleado)}
                        </span>
                        <span className="whitespace-nowrap font-medium text-ink">{registro.nombreEmpleado}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <p className="font-medium text-ink">{registro.cargo}</p>
                      <p className="text-xs text-ink/50">{ETIQUETAS_DEPARTAMENTO[registro.departamento]}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${ESTILOS_CONTRATO[registro.tipoContrato]}`}>
                        {ETIQUETAS_CONTRATO[registro.tipoContrato]}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-ink">{formatearMoneda(liquidacion.salarioBase)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-ink/70">{formatearMoneda(liquidacion.auxilio)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-error">-{formatearMoneda(liquidacion.salud)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-error">-{formatearMoneda(liquidacion.pension)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-emerald-600">
                      {formatearMoneda(liquidacion.neto)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${ESTILOS_ESTADO_PAGO[registro.estadoPago]}`}>
                        {ETIQUETAS_ESTADO_PAGO[registro.estadoPago]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Link
                        href={`/panel/nominas/${registro.id}`}
                        aria-label={`Ver detalle de ${registro.nombreEmpleado}`}
                        title="Ver detalle"
                        className="rounded-lg px-2 py-1 text-ink/50 transition-colors hover:bg-canvas hover:text-brand"
                      >
                        👁
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="border-t border-line px-4 py-3 text-sm text-ink/50">
          Mostrando {filas.length} de {resumen.empleados} empleados
        </p>
      </div>
    </div>
  );
}