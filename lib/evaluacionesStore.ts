// Refleja "Evaluacion_Zona" del MER: calificacion, comentario, fecha,
// id_usuario (FK), id_zona (FK).
export interface EvaluacionZona {
  id: string;
  idZona: string;
  calificacion: number; // 1 a 5
  comentario: string;
  fecha: string; // ISO
  correoResidente: string;
}

let evaluaciones: EvaluacionZona[] = [
  {
    id: "1",
    idZona: "2",
    calificacion: 4,
    comentario: "La piscina está muy bien mantenida, pero el agua a veces está fría.",
    fecha: "2026-08-20T15:00:00.000Z",
    correoResidente: "juan@urbanix.com",
  },
];

export function obtenerEvaluaciones(): EvaluacionZona[] {
  return evaluaciones;
}

export function obtenerEvaluacionesPorZona(idZona: string): EvaluacionZona[] {
  return evaluaciones.filter((e) => e.idZona === idZona);
}

export function crearEvaluacion(datos: {
  idZona: string;
  calificacion: number;
  comentario: string;
  correoResidente: string;
}): void {
  const nuevoId = (Math.max(0, ...evaluaciones.map((e) => Number(e.id))) + 1).toString();
  evaluaciones = [...evaluaciones, { id: nuevoId, ...datos, fecha: new Date().toISOString() }];
}

// Calcula el promedio de calificaciones de una zona. Si no tiene
// ninguna evaluacion todavia, devolvemos null en vez de 0 - un
// promedio de "0 estrellas" se leeria como una mala calificacion
// real, cuando en realidad significa "nadie ha opinado aun".
export function promedioDeZona(idZona: string): number | null {
  const deZona = obtenerEvaluacionesPorZona(idZona);
  if (deZona.length === 0) return null;

  const suma = deZona.reduce((acumulado, evaluacion) => acumulado + evaluacion.calificacion, 0);
  return suma / deZona.length;
}