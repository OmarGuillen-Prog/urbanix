// Refleja "Comunicado" del MER: titulo, contenido, fecha_publicacion,
// estado, id_administrador (FK).
export interface Comunicado {
  id: string;
  titulo: string;
  contenido: string;
  fechaPublicacion: string; // ISO
  correoAutor: string;
}

let comunicados: Comunicado[] = [
  {
    id: "1",
    titulo: "Mantenimiento de ascensores - Torre A",
    contenido: "El próximo lunes se realizará mantenimiento preventivo a los ascensores de la Torre A entre 8am y 12pm.",
    fechaPublicacion: "2026-09-01T09:00:00.000Z",
    correoAutor: "omar@urbanix.com",
  },
  {
    id: "2",
    titulo: "Asamblea general de copropietarios",
    contenido: "Se convoca a todos los propietarios a la asamblea general el 20 de septiembre a las 6pm en el salón social.",
    fechaPublicacion: "2026-09-03T14:00:00.000Z",
    correoAutor: "omar@urbanix.com",
  },
];

// Devolvemos una COPIA ordenada (mas reciente primero), sin tocar el
// arreglo original - asi cualquier otra parte del codigo que use
// "comunicados" no se ve afectada por este orden.
export function obtenerComunicados(): Comunicado[] {
  return [...comunicados].sort(
    (a, b) => new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime()
  );
}

export function obtenerComunicadoPorId(id: string): Comunicado | undefined {
  return comunicados.find((c) => c.id === id);
}

export function crearComunicado(datos: { titulo: string; contenido: string; correoAutor: string }): void {
  const nuevoId = (Math.max(0, ...comunicados.map((c) => Number(c.id))) + 1).toString();
  comunicados = [
    ...comunicados,
    { id: nuevoId, ...datos, fechaPublicacion: new Date().toISOString() },
  ];
}

export function actualizarComunicado(id: string, cambios: { titulo: string; contenido: string }): void {
  comunicados = comunicados.map((c) => (c.id === id ? { ...c, ...cambios } : c));
}

export function eliminarComunicado(id: string): void {
  comunicados = comunicados.filter((c) => c.id !== id);
}