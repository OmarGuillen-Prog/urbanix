// Refleja la entidad "Visita" del MER: nombre_visitante,
// documento_visitante, fecha_visita, hora_entrada, hora_salida,
// estado, id_residente (FK), id_portero (FK). Igual que en PQRS,
// usamos el correo como clave natural en vez de inventar IDs.
export interface Visita {
  id: string;
  nombreVisitante: string;
  documentoVisitante: string;
  fechaVisita: string; // fecha en la que se espera la visita (YYYY-MM-DD)
  horaEntrada: string | null; // se llena cuando el portero marca entrada
  horaSalida: string | null; // se llena cuando el portero marca salida
  estado: "pendiente" | "en_conjunto" | "finalizada";
  correoResidente: string;
  correoPortero: string | null;
}

let visitas: Visita[] = [
  {
    id: "1",
    nombreVisitante: "Camila Torres",
    documentoVisitante: "1122334455",
    fechaVisita: "2026-09-05",
    horaEntrada: null,
    horaSalida: null,
    estado: "pendiente",
    correoResidente: "juan@urbanix.com",
    correoPortero: null,
  },
  {
    id: "2",
    nombreVisitante: "Pedro Ramírez",
    documentoVisitante: "9988776655",
    fechaVisita: "2026-09-04",
    horaEntrada: "2026-09-04T14:20:00.000Z",
    horaSalida: "2026-09-04T17:45:00.000Z",
    estado: "finalizada",
    correoResidente: "juan@urbanix.com",
    correoPortero: "andres@urbanix.com",
  },
];

export function obtenerTodasLasVisitas(): Visita[] {
  return visitas;
}

export function obtenerVisitasPorResidente(correo: string): Visita[] {
  return visitas.filter((v) => v.correoResidente === correo);
}

export function obtenerVisitaPorId(id: string): Visita | undefined {
  return visitas.find((v) => v.id === id);
}

export function crearVisita(datos: {
  nombreVisitante: string;
  documentoVisitante: string;
  fechaVisita: string;
  correoResidente: string;
}): void {
  const nuevoId = (Math.max(0, ...visitas.map((v) => Number(v.id))) + 1).toString();
  visitas = [
    ...visitas,
    {
      id: nuevoId,
      ...datos,
      horaEntrada: null,
      horaSalida: null,
      estado: "pendiente",
      correoPortero: null,
    },
  ];
}

// RF-47: el portero registra la entrada de visitantes
export function registrarEntrada(id: string, correoPortero: string): void {
  visitas = visitas.map((v) =>
    v.id === id
      ? { ...v, estado: "en_conjunto", horaEntrada: new Date().toISOString(), correoPortero }
      : v
  );
}

// RF-48: el portero registra la salida de visitantes
export function registrarSalida(id: string): void {
  visitas = visitas.map((v) =>
    v.id === id ? { ...v, estado: "finalizada", horaSalida: new Date().toISOString() } : v
  );
}