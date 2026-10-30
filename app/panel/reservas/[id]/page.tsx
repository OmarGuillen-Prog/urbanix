"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useDetalleReserva } from "./useDetalleReserva";
import { codigoReserva, nombreDeZona, obtenerZonaPorId } from "@/lib/reservasStore";
import { nombrePorCorreo, unidadDeUsuario } from "@/lib/personasHelpers";
import { ETIQUETAS_ESTADO, ESTILOS_ESTADO } from "../etiquetas";

function formatearFecha(fecha: string): string {
  return new Date(`${fecha}T00:00:00`).toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function DetalleReservaPage() {
  const params = useParams<{ id: string }>();
  const { reserva, tieneAcceso, esAdministrador, handleConfirmar, handleCancelar } = useDetalleReserva(params.id);

  const enlaceVolver = (
    <Link href="/panel/reservas" className="text-sm text-ink/60 hover:text-brand">
      ← Volver a reservaciones
    </Link>
  );

  if (!reserva) {
    return (
      <div>
        {enlaceVolver}
        <p className="mt-4 text-ink/60">Reserva no encontrada.</p>
      </div>
    );
  }

  if (!tieneAcceso) {
    return (
      <div>
        {enlaceVolver}
        <p className="mt-4 text-ink/60">No tienes permiso para ver esta reserva.</p>
      </div>
    );
  }

  const zona = obtenerZonaPorId(reserva.idZona);

  return (
    <div>
      {enlaceVolver}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl font-semibold text-ink">{nombreDeZona(reserva.idZona)}</h1>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ESTILOS_ESTADO[reserva.estado]}`}>
          {ETIQUETAS_ESTADO[reserva.estado]}
        </span>
      </div>
      <p className="mt-1 text-sm text-ink/40">Reservación {codigoReserva(reserva.id)}</p>

      <dl className="mt-6 grid max-w-lg grid-cols-1 gap-4 rounded-xl border border-line bg-white p-6 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-ink/40">Fecha</dt>
          <dd className="mt-1 text-sm capitalize text-ink">{formatearFecha(reserva.fecha)}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-ink/40">Horario</dt>
          <dd className="mt-1 text-sm text-ink">{reserva.horaInicio} - {reserva.horaFin}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-ink/40">Reservado por</dt>
          <dd className="mt-1 text-sm text-ink">
            {nombrePorCorreo(reserva.correoResidente)} · Unidad {unidadDeUsuario(reserva.correoResidente)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-ink/40">Invitados</dt>
          <dd className="mt-1 text-sm text-ink">
            {reserva.invitados}
            {zona && <span className="text-ink/40"> de {zona.capacidad} permitidos</span>}
          </dd>
        </div>
      </dl>

      {/* HU-47 conectada: las reglas que el administrador escribio en "Zonas comunes" */}
      {zona && (
        <div className="mt-4 max-w-lg rounded-xl border border-line bg-brand/5 p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-brand">Reglas de uso</p>
          <p className="mt-2 text-sm text-ink">{zona.reglas}</p>
        </div>
      )}

      {reserva.estado === "cancelada" ? (
        <p className="mt-6 text-sm text-ink/40">Esta reserva fue cancelada y el horario quedó libre.</p>
      ) : (
        <div className="mt-6 flex flex-wrap gap-3">
          {esAdministrador && reserva.estado === "pendiente" && (
            <button
              onClick={handleConfirmar}
              className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
            >
              Confirmar reserva
            </button>
          )}
          {esAdministrador && (
            <Link
              href={`/panel/reservas/${reserva.id}/editar`}
              className="rounded-lg border border-line px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-brand hover:text-brand"
            >
              Editar
            </Link>
          )}
          <button
            onClick={handleCancelar}
            className="rounded-lg border border-line px-4 py-2.5 text-sm font-medium text-error transition-colors hover:border-error"
          >
            Cancelar reserva
          </button>
        </div>
      )}
    </div>
  );
}