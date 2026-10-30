"use client";

import Link from "next/link";
import { useVisitasLista } from "./useVisitasLista";
import { ResumenTarjetas } from "@/components/ResumenTarjetas";
import { Paginacion } from "@/components/Paginacion";
import { codigoVisita, type TipoVisita, type EstadoVisita } from "@/lib/visitasStore";
import { unidadDeUsuario, nombrePorCorreo } from "@/lib/personasHelpers";
import { ETIQUETAS_TIPO, ESTILOS_TIPO, ETIQUETAS_ESTADO, ESTILOS_ESTADO } from "./etiquetas";

function formatearFecha(fecha: string): string {
  // Le agregamos hora para que se interprete en horario local, no UTC
  return new Date(`${fecha}T00:00:00`).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatearHoraIso(iso: string): string {
  return new Date(iso).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", hour12: false });
}

const CLASE_SELECT =
  "rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

export default function VisitasPage() {
  const {
    esPortero,
    esAdministrador,
    visibles, totalFiltradas, paginaActual, totalPaginas, setPagina,
    busqueda, cambiarBusqueda,
    filtroTipo, cambiarTipo,
    filtroEstado, cambiarEstado,
    filtroFecha, cambiarFecha,
    visitasHoy, ingresaron, esperados, completados,
    visitaQueLlego,
    handleRegistrarEntrada,
    handleRegistrarSalida,
  } = useVisitasLista();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Control de visitas</h1>
          <p className="mt-1 text-ink/60">
            {esAdministrador
              ? "Historial completo de visitas del conjunto"
              : esPortero
                ? "Registra y gestiona el acceso de visitantes"
                : "Tus visitas registradas"}
          </p>
        </div>

        <Link
          href="/panel/visitas/nueva"
          className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          + Registrar visita
        </Link>
      </div>

      {/* Aviso de llegada para el residente (HU-31 simulada) */}
      {visitaQueLlego && (
        <div className="mt-6 rounded-xl border border-brand/30 bg-brand/5 p-4">
          <p className="text-sm font-medium text-brand">
            🔔 {visitaQueLlego.nombreVisitante} llegó y está en portería.
          </p>
        </div>
      )}

      <ResumenTarjetas
        items={[
          { etiqueta: "Visitas hoy", valor: visitasHoy, icono: "👥", tono: "brand" },
          { etiqueta: "Ingresaron", valor: ingresaron, icono: "🛡️", tono: "verde" },
          { etiqueta: "Esperados", valor: esperados, icono: "🕒", tono: "dorado" },
          { etiqueta: "Completados", valor: completados, icono: "✅", tono: "gris" },
        ]}
      />

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Buscar por nombre, documento, unidad o ID..."
          value={busqueda}
          onChange={(evento) => cambiarBusqueda(evento.target.value)}
          className="w-full max-w-md rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink placeholder:text-ink/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
        <select value={filtroTipo} onChange={(evento) => cambiarTipo(evento.target.value as TipoVisita | "todos")} className={CLASE_SELECT}>
          <option value="todos">Todos los tipos</option>
          <option value="visitante">Visitante</option>
          <option value="domicilio">Domicilio</option>
          <option value="servicio">Servicio</option>
        </select>
        <select value={filtroEstado} onChange={(evento) => cambiarEstado(evento.target.value as EstadoVisita | "todos")} className={CLASE_SELECT}>
          <option value="todos">Todos los estados</option>
          <option value="pendiente">Esperado</option>
          <option value="en_conjunto">Ingresó</option>
          <option value="finalizada">Completado</option>
        </select>
        <select value={filtroFecha} onChange={(evento) => cambiarFecha(evento.target.value as "todas" | "hoy")} className={CLASE_SELECT}>
          <option value="todas">Todas las fechas</option>
          <option value="hoy">Solo hoy</option>
        </select>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-line bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-canvas">
              <tr className="text-xs uppercase tracking-wide text-ink/50">
                <th className="px-4 py-3 font-medium">ID visita</th>
                <th className="px-4 py-3 font-medium">Visitante</th>
                <th className="px-4 py-3 font-medium">Documento</th>
                <th className="px-4 py-3 font-medium">Unidad</th>
                <th className="px-4 py-3 font-medium">Anfitrión</th>
                <th className="px-4 py-3 font-medium">Fecha y hora</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                {/* La columna de acciones solo existe para el portero */}
                {esPortero && <th className="px-4 py-3 font-medium">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {visibles.length === 0 ? (
                <tr>
                  <td colSpan={esPortero ? 9 : 8} className="px-4 py-10 text-center text-ink/40">
                    No se encontraron visitas con esos criterios.
                  </td>
                </tr>
              ) : (
                visibles.map((visita) => (
                  <tr key={visita.id} className="border-b border-line last:border-0 hover:bg-canvas/60">
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-brand">{codigoVisita(visita.id)}</td>
                    <td className="px-4 py-3 font-medium text-ink">{visita.nombreVisitante}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink/70">{visita.documentoVisitante || "N/A"}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-ink">{unidadDeUsuario(visita.correoResidente)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink/70">{nombrePorCorreo(visita.correoResidente)}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <p className="text-ink/70">{formatearFecha(visita.fechaVisita)}</p>
                      <p className="text-xs text-ink/40">{visita.horaEstimada}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ESTILOS_TIPO[visita.tipo]}`}>
                        {ETIQUETAS_TIPO[visita.tipo]}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ESTILOS_ESTADO[visita.estado]}`}>
                        {ETIQUETAS_ESTADO[visita.estado]}
                      </span>
                      {visita.horaEntrada && (
                        <p className="mt-1 text-xs text-ink/40">
                          Entrada {formatearHoraIso(visita.horaEntrada)}
                          {visita.horaSalida && ` · Salida ${formatearHoraIso(visita.horaSalida)}`}
                        </p>
                      )}
                    </td>

                    {esPortero && (
                      <td className="whitespace-nowrap px-4 py-3">
                        {visita.estado === "pendiente" && (
                          <button
                            onClick={() => handleRegistrarEntrada(visita.id)}
                            className="text-sm font-medium text-brand hover:text-brand-dark"
                          >
                            Registrar entrada
                          </button>
                        )}
                        {visita.estado === "en_conjunto" && (
                          <button
                            onClick={() => handleRegistrarSalida(visita.id)}
                            className="text-sm font-medium text-error hover:text-error/70"
                          >
                            Registrar salida
                          </button>
                        )}
                        {visita.estado === "finalizada" && <span className="text-sm text-ink/30">Completada</span>}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Paginacion
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          resumen={`Mostrando ${visibles.length} de ${totalFiltradas} visitas`}
          onCambiar={setPagina}
        />
      </div>
    </div>
  );
}