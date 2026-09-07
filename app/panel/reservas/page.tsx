"use client";

import { useReservarForm } from "./useReservarForm";
import { useReservasLista } from "./useReservasLista";

const ETIQUETAS_ESTADO: Record<string, string> = {
  activa: "Activa",
  cancelada: "Cancelada",
};

const ESTILOS_ESTADO: Record<string, string> = {
  activa: "bg-emerald-100 text-emerald-700",
  cancelada: "bg-zinc-100 text-zinc-500",
};

function formatearFecha(fecha: string): string {
  return new Date(`${fecha}T00:00:00`).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ReservasPage() {
  const { reservas, nombreZona, handleCancelar, refrescar } = useReservasLista();
  const { zonas, idZona, setIdZona, fecha, setFecha, horaInicio, setHoraInicio, horaFin, setHoraFin, errores, guardando, handleSubmit } =
    useReservarForm(refrescar);

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">
        Reservas de zonas comunes
      </h1>
      <p className="mt-1 text-ink/60">
        Reserva un horario o consulta tu historial de reservas.
      </p>

      {/* Formulario de nueva reserva */}
      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl rounded-xl border border-line bg-white p-6">
        <p className="font-display text-lg font-semibold text-ink">Nueva reserva</p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="zona" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
              Zona común
            </label>
            <select
              id="zona"
              value={idZona}
              onChange={(evento) => setIdZona(evento.target.value)}
              className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            >
              {zonas.map((zona) => (
                <option key={zona.id} value={zona.id}>
                  {zona.nombre} (máx. {zona.capacidad} personas)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="fecha" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
              Fecha
            </label>
            <input
              id="fecha"
              type="date"
              value={fecha}
              onChange={(evento) => setFecha(evento.target.value)}
              className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
            {errores.fecha && <p className="mt-1.5 text-sm text-error">{errores.fecha}</p>}
          </div>

          <div>
            <label htmlFor="horaInicio" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
              Hora de inicio
            </label>
            <input
              id="horaInicio"
              type="time"
              value={horaInicio}
              onChange={(evento) => setHoraInicio(evento.target.value)}
              className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
            {errores.horaInicio && <p className="mt-1.5 text-sm text-error">{errores.horaInicio}</p>}
          </div>

          <div>
            <label htmlFor="horaFin" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
              Hora de fin
            </label>
            <input
              id="horaFin"
              type="time"
              value={horaFin}
              onChange={(evento) => setHoraFin(evento.target.value)}
              className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
            {errores.horaFin && <p className="mt-1.5 text-sm text-error">{errores.horaFin}</p>}
          </div>
        </div>

        {/* Error "general": el conflicto de horario no pertenece a un
            campo especifico, es sobre la combinacion completa */}
        {errores.general && (
          <p className="mt-4 text-sm text-error">{errores.general}</p>
        )}

        <button
          type="submit"
          disabled={guardando}
          className="mt-4 rounded-lg bg-brand px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
        >
          {guardando ? "Verificando disponibilidad..." : "Reservar"}
        </button>
      </form>

      {/* Historial (HU-48) */}
      <p className="mt-10 font-display text-lg font-semibold text-ink">Mis reservas</p>

      <div className="mt-4 overflow-hidden rounded-xl border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-canvas">
            <tr>
              <th className="px-4 py-3 font-medium text-ink/60">Zona</th>
              <th className="px-4 py-3 font-medium text-ink/60">Fecha</th>
              <th className="px-4 py-3 font-medium text-ink/60">Horario</th>
              <th className="px-4 py-3 font-medium text-ink/60">Estado</th>
              <th className="px-4 py-3 font-medium text-ink/60">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservas.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink/40">
                  Aún no tienes reservas.
                </td>
              </tr>
            ) : (
              reservas.map((reserva) => (
                <tr key={reserva.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink">{nombreZona(reserva.idZona)}</td>
                  <td className="px-4 py-3 text-ink/70">{formatearFecha(reserva.fecha)}</td>
                  <td className="px-4 py-3 text-ink/70">
                    {reserva.horaInicio} - {reserva.horaFin}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ESTILOS_ESTADO[reserva.estado]}`}>
                      {ETIQUETAS_ESTADO[reserva.estado]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {reserva.estado === "activa" && (
                      <button
                        onClick={() => handleCancelar(reserva.id)}
                        className="text-sm font-medium text-error hover:text-error/70"
                      >
                        Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}