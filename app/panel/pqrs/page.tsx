"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePQRSAdmin } from "./usePQRSAdmin";
import { usePQRSResidente } from "./usePQRSResidente";
import { ResumenTarjetas } from "@/components/ResumenTarjetas";
import { Paginacion } from "@/components/Paginacion";
import { codigoTicket, unidadDelCreador, nombrePorCorreo } from "@/lib/pqrsStore";
import {
  ETIQUETAS_TIPO, ETIQUETAS_PRIORIDAD, ETIQUETAS_ESTADO,
  ESTILOS_TIPO, ESTILOS_PRIORIDAD, ESTILOS_ESTADO,
} from "./etiquetas";
import type { TipoPQRS, EstadoPQRS, PrioridadPQRS } from "@/lib/pqrsStore";

function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
}

const CLASE_SELECT =
  "rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

export default function PQRSPage() {
  const { usuario } = useAuth();

  if (usuario?.rol === "administrador") {
    return <VistaAdministrador />;
  }
  return <VistaResidente />;
}

function VistaResidente() {
  const { pqrsLista } = usePQRSResidente();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">PQRS</h1>
          <p className="mt-1 text-ink/60">{pqrsLista.length} solicitud(es) tuya(s)</p>
        </div>

        <Link
          href="/panel/pqrs/nueva"
          className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          + Nueva PQRS
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {pqrsLista.length === 0 ? (
          <p className="text-ink/40">Aún no has registrado solicitudes.</p>
        ) : (
          pqrsLista.map((pqrs) => (
            <Link
              key={pqrs.id}
              href={`/panel/pqrs/${pqrs.id}`}
              className="block rounded-xl border border-line bg-white p-5 transition-colors hover:border-brand"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-ink/40">{codigoTicket(pqrs.id)}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ESTILOS_TIPO[pqrs.tipo]}`}>
                      {ETIQUETAS_TIPO[pqrs.tipo]}
                    </span>
                  </div>
                  <p className="mt-1.5 font-medium text-ink">{pqrs.asunto}</p>
                  <p className="mt-1 line-clamp-1 text-sm text-ink/60">{pqrs.descripcion}</p>
                  <p className="mt-2 text-xs text-ink/40">{formatearFecha(pqrs.fechaCreacion)}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${ESTILOS_ESTADO[pqrs.estado]}`}>
                  {ETIQUETAS_ESTADO[pqrs.estado]}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

function VistaAdministrador() {
  const {
    visibles, totalFiltradas, paginaActual, totalPaginas, setPagina,
    busqueda, cambiarBusqueda,
    filtroTipo, cambiarTipo,
    filtroEstado, cambiarEstado,
    filtroPrioridad, cambiarPrioridad,
    pendientes, enProceso, resueltas, altaPrioridad,
  } = usePQRSAdmin();

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Gestión de PQRS</h1>
      <p className="mt-1 text-ink/60">Peticiones, Quejas, Reclamos y Sugerencias</p>

      <ResumenTarjetas
        items={[
          { etiqueta: "Pendientes", valor: pendientes, icono: "⏳", tono: "dorado" },
          { etiqueta: "En proceso", valor: enProceso, icono: "💬", tono: "brand" },
          { etiqueta: "Resueltos", valor: resueltas, icono: "✅", tono: "verde" },
          { etiqueta: "Alta prioridad", valor: altaPrioridad, icono: "❗", tono: "rojo" },
        ]}
      />

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Buscar tickets por ID, asunto o unidad..."
          value={busqueda}
          onChange={(evento) => cambiarBusqueda(evento.target.value)}
          className="w-full max-w-md rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink placeholder:text-ink/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
        <select value={filtroTipo} onChange={(evento) => cambiarTipo(evento.target.value as TipoPQRS | "todos")} className={CLASE_SELECT}>
          <option value="todos">Todos los tipos</option>
          <option value="peticion">Petición</option>
          <option value="queja">Queja</option>
          <option value="reclamo">Reclamo</option>
          <option value="sugerencia">Sugerencia</option>
        </select>
        <select value={filtroEstado} onChange={(evento) => cambiarEstado(evento.target.value as EstadoPQRS | "todos")} className={CLASE_SELECT}>
          <option value="todos">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="en_proceso">En proceso</option>
          <option value="resuelto">Resuelto</option>
        </select>
        <select value={filtroPrioridad} onChange={(evento) => cambiarPrioridad(evento.target.value as PrioridadPQRS | "todos")} className={CLASE_SELECT}>
          <option value="todos">Todas las prioridades</option>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-line bg-white">
        {/* overflow-x-auto: en pantallas angostas solo la tabla se desliza de lado */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-canvas">
              <tr className="text-xs uppercase tracking-wide text-ink/50">
                <th className="px-4 py-3 font-medium">ID ticket</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Unidad</th>
                <th className="px-4 py-3 font-medium">Asunto</th>
                <th className="px-4 py-3 font-medium">Prioridad</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Asignado a</th>
                <th className="px-4 py-3 font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {visibles.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-ink/40">
                    No se encontraron tickets con esos criterios.
                  </td>
                </tr>
              ) : (
                visibles.map((pqrs) => (
                  <tr key={pqrs.id} className="border-b border-line last:border-0 hover:bg-canvas/60">
                    <td className="whitespace-nowrap px-4 py-3">
                      <Link href={`/panel/pqrs/${pqrs.id}`} className="font-medium text-brand hover:text-brand-dark">
                        {codigoTicket(pqrs.id)}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ESTILOS_TIPO[pqrs.tipo]}`}>
                        {ETIQUETAS_TIPO[pqrs.tipo]}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-ink">{unidadDelCreador(pqrs.correoCreador)}</td>
                    <td className="px-4 py-3 text-ink">{pqrs.asunto}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ESTILOS_PRIORIDAD[pqrs.prioridad]}`}>
                        {ETIQUETAS_PRIORIDAD[pqrs.prioridad]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${ESTILOS_ESTADO[pqrs.estado]}`}>
                        {ETIQUETAS_ESTADO[pqrs.estado]}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink/70">{nombrePorCorreo(pqrs.correoAsignado)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink/70">{formatearFecha(pqrs.fechaCreacion)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Paginacion
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          resumen={`Mostrando ${visibles.length} de ${totalFiltradas} tickets`}
          onCambiar={setPagina}
        />
      </div>
    </div>
  );
}