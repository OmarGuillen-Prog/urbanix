"use client";

import Link from "next/link";
import { useReservasLista } from "./useReservasLista";
import { ResumenTarjetas } from "@/components/ResumenTarjetas";
import { codigoReserva, nombreDeZona, type EstadoReserva } from "@/lib/reservasStore";
import { nombrePorCorreo, unidadDeUsuario } from "@/lib/personasHelpers";
import { ETIQUETAS_ESTADO, ESTILOS_ESTADO } from "./etiquetas";

function formatearFecha(fecha: string): string {
  return new Date(`${fecha}T00:00:00`).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const CLASE_SELECT =
  "rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

export default function ReservasPage() {
  const {
    esAdministrador,
    zonas,
    reservasFiltradas,
    busqueda, setBusqueda,
    filtroZona, setFiltroZona,
    filtroEstado, setFiltroEstado,
    totalMes, confirmadas, pendientes, canceladas,
  } = useReservasLista();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Reservaciones</h1>
          <p className="mt-1 text-ink/60">
            {esAdministrador ? "Gestiona reservas de zonas y amenidades" : "Tus reservas de zonas comunes"}
          </p>
        </div>

        <Link
          href="/panel/reservas/nueva"
          className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          + Nueva reservación
        </Link>
      </div>

      <ResumenTarjetas
        items={[
          { etiqueta: "Total este mes", valor: totalMes, icono: "📅", tono: "brand" },
          { etiqueta: "Confirmadas", valor: confirmadas, icono: "✅", tono: "verde" },
          { etiqueta: "Pendientes", valor: pendientes, icono: "🕒", tono: "dorado" },
          { etiqueta: "Canceladas", valor: canceladas, icono: "🚫", tono: "rojo" },
        ]}
      />

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Buscar por ID, amenidad o residente..."
          value={busqueda}
          onChange={(evento) => setBusqueda(evento.target.value)}
          className="w-full max-w-md rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink placeholder:text-ink/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
        <select value={filtroZona} onChange={(evento) => setFiltroZona(evento.target.value)} className={CLASE_SELECT}>
          <option value="todas">Todas las amenidades</option>
          {zonas.map((zona) => (
            <option key={zona.id} value={zona.id}>
              {zona.nombre}
            </option>
          ))}
        </select>
        <select
          value={filtroEstado}
          onChange={(evento) => setFiltroEstado(evento.target.value as EstadoReserva | "todos")}
          className={CLASE_SELECT}
        >
          <option value="todos">Todos los estados</option>
          <option value="confirmada">Confirmada</option>
          <option value="pendiente">Pendiente</option>
          <option value="cancelada">Cancelada</option>
        </select>
      </div>

      {reservasFiltradas.length === 0 ? (
        <p className="mt-8 text-ink/40">No se encontraron reservas con esos criterios.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {reservasFiltradas.map((reserva) => (
            <div key={reserva.id} className="rounded-xl border border-line bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-lg">
                    📍
                  </div>
                  <div>
                    <p className="font-display text-lg font-semibold text-ink">{nombreDeZona(reserva.idZona)}</p>
                    <p className="text-xs text-ink/50">Reservación {codigoReserva(reserva.id)}</p>
                  </div>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${ESTILOS_ESTADO[reserva.estado]}`}>
                  {ETIQUETAS_ESTADO[reserva.estado]}
                </span>
              </div>

              <div className="mt-4 flex flex-col gap-1 text-sm text-ink/70">
                <p>📅 {formatearFecha(reserva.fecha)}</p>
                <p>🕒 {reserva.horaInicio} - {reserva.horaFin}</p>
              </div>

              <div className="mt-4 flex items-end justify-between border-t border-line pt-3">
                <div>
                  <p className="text-xs text-ink/50">Reservado por</p>
                  <p className="text-sm font-medium text-ink">{nombrePorCorreo(reserva.correoResidente)}</p>
                  <p className="text-xs text-ink/50">Unidad {unidadDeUsuario(reserva.correoResidente)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-ink/50">Invitados</p>
                  <p className="font-display text-xl font-semibold text-brand">{reserva.invitados}</p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                {/* Editar: solo el administrador, y no sobre una reserva cancelada */}
                {esAdministrador && reserva.estado !== "cancelada" && (
                  <Link
                    href={`/panel/reservas/${reserva.id}/editar`}
                    className="flex-1 rounded-lg border border-line px-3 py-2 text-center text-sm font-medium text-ink transition-colors hover:border-brand hover:text-brand"
                  >
                    Editar
                  </Link>
                )}
                <Link
                  href={`/panel/reservas/${reserva.id}`}
                  className="flex-1 rounded-lg bg-brand px-3 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-brand-dark"
                >
                  Ver detalles
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}