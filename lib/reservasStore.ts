// Refleja "Zona_Comun" del MER. Por ahora es una lista fija (no se
// crean zonas nuevas desde la UI) - representa la configuracion
// inicial del conjunto residencial.
export interface ZonaComun {
  id: string;
  nombre: string;
  capacidad: number;
}

export interface ZonaComun {
  id: string;
  nombre: string;
  capacidad: number;
  reglas: string; // RF-62: reglas de uso establecidas por el administrador
}

export const zonasComunes: ZonaComun[] = [
  { id: "1", nombre: "Salón social", capacidad: 40, reglas: "Prohibido fumar. Horario máximo hasta las 11pm. El aseo final es responsabilidad de quien reserva." },
  { id: "2", nombre: "Piscina", capacidad: 25, reglas: "Uso obligatorio de gorro de baño. No se permiten envases de vidrio. Niños menores de 12 años deben estar acompañados." },
  { id: "3", nombre: "Cancha múltiple", capacidad: 15, reglas: "Uso de calzado deportivo obligatorio. Horario de 6am a 10pm." },
  { id: "4", nombre: "Zona BBQ", capacidad: 20, reglas: "Máximo 3 horas de uso continuo. Se debe dejar la parrilla limpia al terminar." },
];

// Refleja "Reserva" del MER: fecha_reserva, hora_inicio, hora_fin,
// estado, id_usuario (FK), id_zona (FK).
export interface Reserva {
  id: string;
  idZona: string;
  fecha: string; // "YYYY-MM-DD"
  horaInicio: string; // "HH:MM"
  horaFin: string; // "HH:MM"
  estado: "activa" | "cancelada";
  correoResidente: string;
}

let reservas: Reserva[] = [
  {
    id: "1",
    idZona: "2",
    fecha: "2026-09-06",
    horaInicio: "10:00",
    horaFin: "12:00",
    estado: "activa",
    correoResidente: "juan@urbanix.com",
  },
];

export function obtenerZonas(): ZonaComun[] {
  return zonasComunes;
}

export function obtenerReservasPorUsuario(correo: string): Reserva[] {
  return reservas.filter((r) => r.correoResidente === correo);
}

// El corazon de la validacion: revisa si un nuevo horario se cruza
// con alguna reserva ACTIVA existente, en la MISMA zona y MISMA fecha.
// Una reserva cancelada no cuenta - ese horario vuelve a estar libre.
function hayConflictoDeHorario(
  idZona: string,
  fecha: string,
  horaInicio: string,
  horaFin: string
): boolean {
  return reservas.some((r) => {
    if (r.idZona !== idZona || r.fecha !== fecha || r.estado === "cancelada") {
      return false;
    }
    // La formula de solapamiento explicada arriba:
    return horaInicio < r.horaFin && horaFin > r.horaInicio;
  });
}

// Devolvemos un resultado explicito en vez de lanzar un error - asi
// el componente que llama decide como mostrar el mensaje, sin
// necesitar try/catch.
export function crearReserva(datos: {
  idZona: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  correoResidente: string;
}): { exito: boolean; mensaje?: string } {
  if (hayConflictoDeHorario(datos.idZona, datos.fecha, datos.horaInicio, datos.horaFin)) {
    // RF-57: rechazar reservas en horarios ocupados
    return { exito: false, mensaje: "Ese horario ya está reservado para esta zona. Elige otro horario." };
  }

  const nuevoId = (Math.max(0, ...reservas.map((r) => Number(r.id))) + 1).toString();
  reservas = [...reservas, { id: nuevoId, ...datos, estado: "activa" }];
  return { exito: true };
}

// RF-59: liberar automaticamente el espacio reservado al cancelar
// (no eliminamos el registro - lo marcamos "cancelada", para
// conservar el historial, y porque asi el horario queda libre para
// otros gracias al filtro de hayConflictoDeHorario de arriba).
export function cancelarReserva(id: string): void {
  reservas = reservas.map((r) => (r.id === id ? { ...r, estado: "cancelada" } : r));
}

// RF-62: el administrador establece/actualiza las reglas de una zona
export function actualizarReglasZona(idZona: string, reglas: string): void {
  const zona = zonasComunes.find((z) => z.id === idZona);
  if (zona) zona.reglas = reglas;
}