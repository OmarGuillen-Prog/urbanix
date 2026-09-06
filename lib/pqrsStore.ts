// Refleja la entidad "PQRS" del MER: asunto, descripcion, estado,
// respuesta, fecha_creacion, fecha_respuesta, id_usuario (FK),
// id_administrador (FK). Usamos el correo como "id_usuario" (ver
// explicacion de clave natural arriba).
export interface PQRS {
  id: string;
  asunto: string;
  descripcion: string;
  estado: "pendiente" | "respondido";
  respuesta: string | null;
  fechaCreacion: string;
  fechaRespuesta: string | null;
  correoCreador: string;
}

let listaPQRS: PQRS[] = [
  {
    id: "1",
    asunto: "Fuga de agua en el pasillo del piso 2",
    descripcion: "Desde ayer hay una fuga visible cerca del ascensor.",
    estado: "pendiente",
    respuesta: null,
    fechaCreacion: "2026-08-20T10:00:00.000Z",
    fechaRespuesta: null,
    correoCreador: "juan@urbanix.com",
  },
  {
    id: "2",
    asunto: "Ruido excesivo los fines de semana",
    descripcion: "Los sábados en la noche hay musica muy alta en la zona social.",
    estado: "respondido",
    respuesta: "Se enviará un comunicado recordando las normas de convivencia.",
    fechaCreacion: "2026-08-15T18:30:00.000Z",
    fechaRespuesta: "2026-08-16T09:00:00.000Z",
    correoCreador: "juan@urbanix.com",
  },
];

export function obtenerTodasLasPQRS(): PQRS[] {
  return listaPQRS;
}

export function obtenerPQRSPorUsuario(correo: string): PQRS[] {
  return listaPQRS.filter((p) => p.correoCreador === correo);
}

export function obtenerPQRSPorId(id: string): PQRS | undefined {
  return listaPQRS.find((p) => p.id === id);
}

export function crearPQRS(datos: { asunto: string; descripcion: string; correoCreador: string }): void {
  const nuevoId = (
    Math.max(0, ...listaPQRS.map((p) => Number(p.id))) + 1
  ).toString();

  listaPQRS = [
    ...listaPQRS,
    {
      id: nuevoId,
      asunto: datos.asunto,
      descripcion: datos.descripcion,
      correoCreador: datos.correoCreador,
      estado: "pendiente",
      respuesta: null,
      fechaCreacion: new Date().toISOString(),
      fechaRespuesta: null,
    },
  ];
}

export function responderPQRS(id: string, respuesta: string): void {
  listaPQRS = listaPQRS.map((p) =>
    p.id === id
      ? { ...p, respuesta, estado: "respondido", fechaRespuesta: new Date().toISOString() }
      : p
  );
}