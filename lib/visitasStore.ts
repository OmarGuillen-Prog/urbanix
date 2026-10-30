import { fechaEnDias, fechaHoraEnDias } from "./fechas";

export type TipoVisita = "visitante" | "domicilio" | "servicio";
// Valores internos sin cambio; en pantalla se ven como Esperado / Ingresó / Completado
export type EstadoVisita = "pendiente" | "en_conjunto" | "finalizada";

export interface Visita {
  id: string;
  tipo: TipoVisita;
  nombreVisitante: string;
  documentoVisitante: string; // vacio cuando no aplica (domicilios, servicios)
  fechaVisita: string; // "YYYY-MM-DD"
  horaEstimada: string; // "HH:MM"
  horaEntrada: string | null; // ISO, se llena cuando el portero marca la entrada
  horaSalida: string | null; // ISO, se llena cuando el portero marca la salida
  estado: EstadoVisita;
  correoResidente: string; // el anfitrion
  correoPortero: string | null;
}

let visitas: Visita[] = [
  { id: "1", tipo: "visitante", nombreVisitante: "Roberto Sánchez", documentoVisitante: "1234567890", fechaVisita: fechaEnDias(0), horaEstimada: "14:30", horaEntrada: fechaHoraEnDias(0, "14:35"), horaSalida: null, estado: "en_conjunto", correoResidente: "maria@urbanix.com", correoPortero: "andres@urbanix.com" },
  { id: "2", tipo: "domicilio", nombreVisitante: "Domicilios Express", documentoVisitante: "", fechaVisita: fechaEnDias(0), horaEstimada: "15:45", horaEntrada: fechaHoraEnDias(0, "15:50"), horaSalida: fechaHoraEnDias(0, "16:05"), estado: "finalizada", correoResidente: "juan@urbanix.com", correoPortero: "andres@urbanix.com" },
  { id: "3", tipo: "servicio", nombreVisitante: "Tech Solutions S.A.S", documentoVisitante: "9876543210", fechaVisita: fechaEnDias(0), horaEstimada: "10:00", horaEntrada: fechaHoraEnDias(0, "10:05"), horaSalida: fechaHoraEnDias(0, "11:30"), estado: "finalizada", correoResidente: "laura@urbanix.com", correoPortero: "andres@urbanix.com" },
  { id: "4", tipo: "visitante", nombreVisitante: "Camila Torres", documentoVisitante: "5555666677", fechaVisita: fechaEnDias(0), horaEstimada: "16:20", horaEntrada: null, horaSalida: null, estado: "pendiente", correoResidente: "maria@urbanix.com", correoPortero: null },
  { id: "5", tipo: "servicio", nombreVisitante: "Limpieza del Hogar", documentoVisitante: "", fechaVisita: fechaEnDias(0), horaEstimada: "09:00", horaEntrada: fechaHoraEnDias(0, "09:05"), horaSalida: null, estado: "en_conjunto", correoResidente: "juan@urbanix.com", correoPortero: "andres@urbanix.com" },
  { id: "6", tipo: "domicilio", nombreVisitante: "Pizza Express", documentoVisitante: "", fechaVisita: fechaEnDias(0), horaEstimada: "19:30", horaEntrada: null, horaSalida: null, estado: "pendiente", correoResidente: "laura@urbanix.com", correoPortero: null },
  { id: "7", tipo: "visitante", nombreVisitante: "Pedro Ramírez", documentoVisitante: "9988776655", fechaVisita: fechaEnDias(-1), horaEstimada: "14:20", horaEntrada: fechaHoraEnDias(-1, "14:20"), horaSalida: fechaHoraEnDias(-1, "17:45"), estado: "finalizada", correoResidente: "juan@urbanix.com", correoPortero: "andres@urbanix.com" },
  { id: "8", tipo: "visitante", nombreVisitante: "Andrea Molina", documentoVisitante: "1020304011", fechaVisita: fechaEnDias(1), horaEstimada: "11:00", horaEntrada: null, horaSalida: null, estado: "pendiente", correoResidente: "maria@urbanix.com", correoPortero: null },
  { id: "9", tipo: "servicio", nombreVisitante: "Fumigaciones del Valle", documentoVisitante: "", fechaVisita: fechaEnDias(-2), horaEstimada: "08:30", horaEntrada: fechaHoraEnDias(-2, "08:35"), horaSalida: fechaHoraEnDias(-2, "10:00"), estado: "finalizada", correoResidente: "laura@urbanix.com", correoPortero: "andres@urbanix.com" },
];

// Copia ordenada: la visita mas reciente (fecha + hora estimada) primero.
// Las cadenas "YYYY-MM-DDTHH:MM" se ordenan bien como texto.
function ordenarMasRecientesPrimero(lista: Visita[]): Visita[] {
  return [...lista].sort((a, b) =>
    `${b.fechaVisita}T${b.horaEstimada}`.localeCompare(`${a.fechaVisita}T${a.horaEstimada}`)
  );
}

export function obtenerTodasLasVisitas(): Visita[] {
  return ordenarMasRecientesPrimero(visitas);
}

export function obtenerVisitasPorResidente(correo: string): Visita[] {
  return ordenarMasRecientesPrimero(visitas.filter((v) => v.correoResidente === correo));
}

// "1" -> "VIS-0001"
export function codigoVisita(id: string): string {
  return `VIS-${id.padStart(4, "0")}`;
}

export function crearVisita(datos: {
  tipo: TipoVisita;
  nombreVisitante: string;
  documentoVisitante: string;
  fechaVisita: string;
  horaEstimada: string;
  correoResidente: string;
}): void {
  const nuevoId = (Math.max(0, ...visitas.map((v) => Number(v.id))) + 1).toString();
  visitas = [
    ...visitas,
    { id: nuevoId, ...datos, horaEntrada: null, horaSalida: null, estado: "pendiente", correoPortero: null },
  ];
}

// RF-47: el portero registra la entrada
export function registrarEntrada(id: string, correoPortero: string): void {
  visitas = visitas.map((v) =>
    v.id === id ? { ...v, estado: "en_conjunto", horaEntrada: new Date().toISOString(), correoPortero } : v
  );
}

// RF-48: el portero registra la salida
export function registrarSalida(id: string): void {
  visitas = visitas.map((v) =>
    v.id === id ? { ...v, estado: "finalizada", horaSalida: new Date().toISOString() } : v
  );
}