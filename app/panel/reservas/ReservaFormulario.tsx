"use client";

import Link from "next/link";
import { useReservaFormulario } from "./useReservaFormulario";
import { FormInput } from "@/components/FormInput";

const CLASE_SELECT =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";
const CLASE_ETIQUETA = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60";

export function ReservaFormulario({ reservaId }: { reservaId?: string }) {
  const {
    esEdicion, esAdministrador, reservaExiste, reservaCancelada,
    zonas, residentes,
    idZona, setIdZona,
    fecha, setFecha,
    horaInicio, setHoraInicio,
    horaFin, setHoraFin,
    invitados, setInvitados,
    correoResidente, setCorreoResidente,
    errores, guardando, handleSubmit,
  } = useReservaFormulario(reservaId);

  const capacidad = zonas.find((z) => z.id === idZona)?.capacidad;

  const enlaceVolver = (
    <Link href="/panel/reservas" className="text-sm text-ink/60 hover:text-brand">
      ← Volver a reservaciones
    </Link>
  );

  if (esEdicion && !reservaExiste) {
    return (
      <div>
        {enlaceVolver}
        <p className="mt-4 text-ink/60">Reserva no encontrada.</p>
      </div>
    );
  }

  if (esEdicion && reservaCancelada) {
    return (
      <div>
        {enlaceVolver}
        <p className="mt-4 text-ink/60">Una reserva cancelada no se puede editar.</p>
      </div>
    );
  }

  return (
    <div>
      {enlaceVolver}

      <h1 className="mt-4 font-display text-3xl font-semibold text-ink">
        {esEdicion ? "Editar reserva" : "Nueva reservación"}
      </h1>
      {/* {!esEdicion && !esAdministrador && (
        <p className="mt-1 text-ink/60">
          Tu solicitud quedará pendiente hasta que administración la confirme.
        </p>
      )} */}
      {!esEdicion && !esAdministrador && (
        <p className="mt-1 text-ink/60">
          Tu reserva se confirma de inmediato si el horario está disponible.
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 flex max-w-lg flex-col gap-5">
        {/* Solo el administrador, al CREAR, elige a nombre de quien reserva */}
        {esAdministrador && !esEdicion && (
          <div>
            <label htmlFor="residente" className={CLASE_ETIQUETA}>Residente</label>
            <select
              id="residente"
              value={correoResidente}
              onChange={(evento) => setCorreoResidente(evento.target.value)}
              className={CLASE_SELECT}
            >
              {residentes.map((residente) => (
                <option key={residente.id} value={residente.correo}>
                  {residente.nombres} {residente.apellidos}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="zona" className={CLASE_ETIQUETA}>Zona común</label>
          <select id="zona" value={idZona} onChange={(evento) => setIdZona(evento.target.value)} className={CLASE_SELECT}>
            {zonas.map((zona) => (
              <option key={zona.id} value={zona.id}>
                {zona.nombre}
              </option>
            ))}
          </select>
        </div>

        <FormInput id="fecha" label="Fecha" type="date" value={fecha} onChange={setFecha} error={errores.fecha} />

        <div className="grid grid-cols-2 gap-4">
          <FormInput id="horaInicio" label="Hora de inicio" type="time" value={horaInicio} onChange={setHoraInicio} error={errores.horaInicio} />
          <FormInput id="horaFin" label="Hora de fin" type="time" value={horaFin} onChange={setHoraFin} error={errores.horaFin} />
        </div>

        <div>
          <FormInput
            id="invitados"
            label="Invitados"
            type="number"
            placeholder="Ej: 8"
            value={invitados}
            onChange={setInvitados}
            error={errores.invitados}
          />
          {capacidad !== undefined && (
            <p className="mt-1.5 text-xs text-ink/50">Capacidad máxima de esta zona: {capacidad} personas.</p>
          )}
        </div>

        {errores.general && <p className="text-sm text-error">{errores.general}</p>}

        <button
          type="submit"
          disabled={guardando}
          className="mt-2 rounded-lg bg-brand px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
        >
          {guardando ? "Verificando disponibilidad..." : esEdicion ? "Guardar cambios" : "Reservar"}
        </button>
      </form>
    </div>
  );
}