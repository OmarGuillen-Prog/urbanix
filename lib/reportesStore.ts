// Refleja "Reporte_Dano" del MER: titulo, descripcion, estado,
// fecha_reporte, fecha_actualizacion, evidencia_foto, id_usuario (FK).
export interface ReporteDano {
  id: string;
  titulo: string;
  descripcion: string;
  estado: "pendiente" | "en_proceso" | "resuelto";
  evidenciaFoto: string | null; // Data URL de la imagen, o null si no adjuntaron
  fechaReporte: string;
  fechaActualizacion: string | null;
  comentarioAdmin: string | null;
  correoCreador: string;
}

let reportes: ReporteDano[] = [
  {
    id: "1",
    titulo: "Grieta en el muro del parqueadero",
    descripcion: "Se observa una grieta creciente cerca del parqueadero 12.",
    estado: "pendiente",
    evidenciaFoto: null,
    fechaReporte: "2026-08-28T11:00:00.000Z",
    fechaActualizacion: null,
    comentarioAdmin: null,
    correoCreador: "juan@urbanix.com",
  },
];

export function obtenerTodosLosReportes(): ReporteDano[] {
  return reportes;
}

export function obtenerReportesPorUsuario(correo: string): ReporteDano[] {
  return reportes.filter((r) => r.correoCreador === correo);
}

export function obtenerReportePorId(id: string): ReporteDano | undefined {
  return reportes.find((r) => r.id === id);
}

export function crearReporte(datos: {
  titulo: string;
  descripcion: string;
  evidenciaFoto: string | null;
  correoCreador: string;
}): void {
  const nuevoId = (Math.max(0, ...reportes.map((r) => Number(r.id))) + 1).toString();
  reportes = [
    ...reportes,
    {
      id: nuevoId,
      ...datos,
      estado: "pendiente",
      fechaReporte: new Date().toISOString(),
      fechaActualizacion: null,
      comentarioAdmin: null,
    },
  ];
}

// RF-53: el administrador actualiza el estado de los reportes
export function actualizarEstadoReporte(
  id: string,
  estado: ReporteDano["estado"],
  comentarioAdmin: string
): void {
  reportes = reportes.map((r) =>
    r.id === id
      ? { ...r, estado, comentarioAdmin, fechaActualizacion: new Date().toISOString() }
      : r
  );
}