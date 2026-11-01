import { notificarARol, notificarUsuario } from "./notificacionesStore";
import { nombrePorCorreo } from "./personasHelpers";
// ---------- Zonas comunes (sin cambios) ----------
import { fechaEnDias } from "./fechas";
export { hoyLocal } from "./fechas";

export interface ZonaComun {
  id: string;
  nombre: string;
  capacidad: number;
  reglas: string;
}

export const zonasComunes: ZonaComun[] = [
  { id: "1", nombre: "Salón social", capacidad: 40, reglas: "Prohibido fumar. Horario máximo hasta las 11pm. El aseo final es responsabilidad de quien reserva." },
  { id: "2", nombre: "Piscina", capacidad: 25, reglas: "Uso obligatorio de gorro de baño. No se permiten envases de vidrio. Niños menores de 12 años deben estar acompañados." },
  { id: "3", nombre: "Cancha múltiple", capacidad: 15, reglas: "Uso de calzado deportivo obligatorio. Horario de 6am a 10pm." },
  { id: "4", nombre: "Zona BBQ", capacidad: 20, reglas: "Máximo 3 horas de uso continuo. Se debe dejar la parrilla limpia al terminar." },
];

export function obtenerZonas(): ZonaComun[] {
  return zonasComunes;
}

export function obtenerZonaPorId(id: string): ZonaComun | undefined {
  return zonasComunes.find((z) => z.id === id);
}

export function nombreDeZona(id: string): string {
  return obtenerZonaPorId(id)?.nombre ?? "Zona desconocida";
}

// RF-62: el administrador establece/actualiza las reglas de una zona
export function actualizarReglasZona(idZona: string, reglas: string): void {
  const zona = zonasComunes.find((z) => z.id === idZona);
  if (zona) zona.reglas = reglas;
}

// ---------- Reservas ----------
export type EstadoReserva = "pendiente" | "confirmada" | "cancelada";

export interface Reserva {
  id: string;
  idZona: string;
  fecha: string; // "YYYY-MM-DD"
  horaInicio: string; // "HH:MM"
  horaFin: string; // "HH:MM"
  invitados: number;
  estado: EstadoReserva;
  correoResidente: string;
}

// Lo que el usuario escribe en el formulario (sin id, estado ni dueño)
export interface DatosReserva {
  idZona: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  invitados: number;
}

// Datos de ejemplo con fechas relativas a hoy: nunca quedan "viejos".
let reservas: Reserva[] = [
  { id: "1", idZona: "4", fecha: fechaEnDias(2), horaInicio: "14:00", horaFin: "18:00", invitados: 8, estado: "confirmada", correoResidente: "maria@urbanix.com" },
  { id: "2", idZona: "1", fecha: fechaEnDias(3), horaInicio: "18:00", horaFin: "22:00", invitados: 15, estado: "confirmada", correoResidente: "juan@urbanix.com" },
  { id: "3", idZona: "2", fecha: fechaEnDias(4), horaInicio: "10:00", horaFin: "12:00", invitados: 10, estado: "pendiente", correoResidente: "laura@urbanix.com" },
  { id: "4", idZona: "3", fecha: fechaEnDias(1), horaInicio: "17:00", horaFin: "19:00", invitados: 12, estado: "confirmada", correoResidente: "maria@urbanix.com" },
  { id: "5", idZona: "2", fecha: fechaEnDias(5), horaInicio: "15:00", horaFin: "17:00", invitados: 6, estado: "cancelada", correoResidente: "juan@urbanix.com" },
  { id: "6", idZona: "4", fecha: fechaEnDias(-2), horaInicio: "12:00", horaFin: "15:00", invitados: 10, estado: "confirmada", correoResidente: "laura@urbanix.com" },
  { id: "7", idZona: "1", fecha: fechaEnDias(7), horaInicio: "19:00", horaFin: "23:00", invitados: 30, estado: "pendiente", correoResidente: "maria@urbanix.com" },
];

export function obtenerTodasLasReservas(): Reserva[] {
  // Copia ordenada: la mas reciente (id mas alto) primero
  return [...reservas].sort((a, b) => Number(b.id) - Number(a.id));
}

export function obtenerReservasPorUsuario(correo: string): Reserva[] {
  return obtenerTodasLasReservas().filter((r) => r.correoResidente === correo);
}

export function obtenerReservaPorId(id: string): Reserva | undefined {
  return reservas.find((r) => r.id === id);
}

// "RES-001"
export function codigoReserva(id: string): string {
  return `RES-${id.padStart(3, "0")}`;
}

// ---------- Reglas de negocio (un solo lugar para crear Y editar) ----------

// Una reserva cancelada ya no ocupa el horario. Pendiente y confirmada SI.
// "idExcluir": al EDITAR, la reserva no debe chocar consigo misma.
function hayConflictoDeHorario(datos: DatosReserva, idExcluir?: string): boolean {
  return reservas.some((r) => {
    if (r.id === idExcluir) return false;
    if (r.estado === "cancelada") return false;
    if (r.idZona !== datos.idZona || r.fecha !== datos.fecha) return false;
    // Formula de solapamiento (la misma de antes)
    return datos.horaInicio < r.horaFin && datos.horaFin > r.horaInicio;
  });
}

// Devuelve el mensaje de error, o null si todo esta bien
function validarReserva(datos: DatosReserva, idExcluir?: string): string | null {
  const zona = obtenerZonaPorId(datos.idZona);
  if (!zona) return "La zona seleccionada no existe.";

  if (datos.invitados > zona.capacidad) {
    return `Capacidad máxima de ${zona.nombre}: ${zona.capacidad} personas.`;
  }
  if (hayConflictoDeHorario(datos, idExcluir)) {
    return "Ese horario ya está reservado para esta zona. Elige otro horario.";
  }
  return null;
}

export function crearReserva(
  datos: DatosReserva & {
    correoResidente: string;
    estado: "pendiente" | "confirmada";
    creadaPor?: string; // quien ejecuto la accion (puede ser un administrador reservando por un residente)
  }
): { exito: boolean; mensaje?: string } {
  // Separamos "creadaPor": sirve para avisar, pero NO se guarda dentro de la reserva
  const { creadaPor, ...datosReserva } = datos;

  const error = validarReserva(datosReserva);
  if (error) return { exito: false, mensaje: error };

  const nuevoId = (Math.max(0, ...reservas.map((r) => Number(r.id))) + 1).toString();
  reservas = [...reservas, { id: nuevoId, ...datosReserva }];

  // Avisos. El "actor" es quien hizo la accion; si no se indica, es el propio residente.
  const actor = creadaPor ?? datos.correoResidente;
  const detalle = `${nombreDeZona(datos.idZona)}, ${datos.fecha} (${datos.horaInicio} - ${datos.horaFin})`;

  // Los administradores se enteran (menos el que hizo la reserva, si fue uno de ellos)
  notificarARol(
    "administrador",
    {
      tipo: "info",
      titulo: "Nueva reservación",
      mensaje: `${nombrePorCorreo(datos.correoResidente)} reservó ${detalle}`,
      enlace: `/panel/reservas/${nuevoId}`,
    },
    actor
  );

  // Si la hizo OTRA persona (el administrador), el residente dueño tambien debe enterarse
  if (actor !== datos.correoResidente) {
    notificarUsuario(datos.correoResidente, {
      tipo: "exito",
      titulo: "Reserva confirmada",
      mensaje: detalle,
      enlace: `/panel/reservas/${nuevoId}`,
    });
  }

  return { exito: true };
}

export function actualizarReserva(
  id: string,
  datos: DatosReserva
): { exito: boolean; mensaje?: string } {
  const error = validarReserva(datos, id); // excluimos la propia reserva
  if (error) return { exito: false, mensaje: error };

  reservas = reservas.map((r) => (r.id === id ? { ...r, ...datos } : r));
  return { exito: true };
}

export function confirmarReserva(id: string): void {
  reservas = reservas.map((r) => (r.id === id ? { ...r, estado: "confirmada" } : r));
}

// RF-59: cancelar libera el horario (no borramos: queda en el historial)
// RF-59: cancelar libera el horario (no borramos: queda en el historial)
export function cancelarReserva(id: string, canceladaPor?: string): void {
  const reserva = reservas.find((r) => r.id === id);
  if (!reserva || reserva.estado === "cancelada") return; // nada que cancelar: no se avisa dos veces

  reservas = reservas.map((r) => (r.id === id ? { ...r, estado: "cancelada" } : r));

  const detalle = `${nombreDeZona(reserva.idZona)}, ${reserva.fecha} (${reserva.horaInicio} - ${reserva.horaFin})`;
  const canceloElDueno = canceladaPor === undefined || canceladaPor === reserva.correoResidente;

  if (canceloElDueno) {
    // El residente cancelo: avisar a los administradores
    notificarARol(
      "administrador",
      {
        tipo: "info",
        titulo: "Reserva cancelada",
        mensaje: `${nombrePorCorreo(reserva.correoResidente)} canceló ${detalle}`,
        enlace: "/panel/reservas",
      },
      canceladaPor
    );
  } else {
    // Otra persona (el administrador) la cancelo: avisar al residente
    notificarUsuario(reserva.correoResidente, {
      tipo: "alerta",
      titulo: "Tu reserva fue cancelada",
      mensaje: detalle,
      enlace: `/panel/reservas/${id}`,
    });
  }
}