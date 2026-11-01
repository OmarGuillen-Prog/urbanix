// Store del modulo de REPORTES DE DAÑOS (no confundir con estadisticasStore.ts)
import { fechaHoraEnDias } from "./fechas";

export type EstadoReporte = "pendiente" | "en_evaluacion" | "en_proceso" | "resuelto";
export type PrioridadReporte = "alta" | "media" | "baja";

// Limites de evidencias por reporte (las fotos se guardan en memoria como texto)
export const MAX_EVIDENCIAS = 5;
export const MAX_MB_POR_EVIDENCIA = 2;

// Refleja "Reporte_Dano" del MER: titulo, descripcion, estado, fecha_reporte,
// fecha_actualizacion, evidencia_foto, id_usuario (FK). Ahora con varias evidencias.
export interface ReporteDano {
  id: string;
  titulo: string;
  descripcion: string;
  ubicacion: string;
  prioridad: PrioridadReporte;
  // Valores internos: "en_proceso" se muestra como "En reparacion"
  estado: EstadoReporte;
  evidencias: string[]; // Data URLs de las imagenes
  fechaReporte: string;
  fechaActualizacion: string | null;
  comentarioAdmin: string | null;
  correoCreador: string;
}

// Imagen de ejemplo (un SVG sencillo) para que los datos de prueba tengan evidencias
function evidenciaDemo(numero: number): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200"><rect width="100%" height="100%" fill="#e5e7eb"/><text x="50%" y="50%" fill="#6b7280" font-family="sans-serif" font-size="18" text-anchor="middle">Evidencia de ejemplo ${numero}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function demos(cantidad: number): string[] {
  return Array.from({ length: cantidad }, (_, i) => evidenciaDemo(i + 1));
}

let reportes: ReporteDano[] = [
  { id: "1", titulo: "Filtración de agua en techo", descripcion: "Se presenta filtración de agua en el techo del parqueadero nivel 1, zona sur. El agua cae directamente sobre los vehículos estacionados.", ubicacion: "Parqueadero Nivel 1", prioridad: "alta", estado: "en_proceso", evidencias: demos(3), fechaReporte: fechaHoraEnDias(-6, "08:30"), fechaActualizacion: fechaHoraEnDias(-4, "10:00"), comentarioAdmin: "Se contrató al proveedor; la reparación inicia esta semana.", correoCreador: "maria@urbanix.com" },
  { id: "2", titulo: "Ascensor fuera de servicio - Torre B", descripcion: "El ascensor de la Torre B presenta falla en la puerta. No cierra correctamente y emite ruido extraño durante el ascenso.", ubicacion: "Torre B - Ascensor", prioridad: "alta", estado: "pendiente", evidencias: demos(2), fechaReporte: fechaHoraEnDias(-3, "14:20"), fechaActualizacion: null, comentarioAdmin: null, correoCreador: "juan@urbanix.com" },
  { id: "3", titulo: "Iluminación defectuosa en pasillo", descripcion: "Las luces del pasillo del piso 3 de la Torre A parpadean constantemente y en ocasiones se apagan completamente.", ubicacion: "Torre A - Piso 3", prioridad: "media", estado: "resuelto", evidencias: demos(1), fechaReporte: fechaHoraEnDias(-9, "19:10"), fechaActualizacion: fechaHoraEnDias(-7, "16:00"), comentarioAdmin: "Se cambiaron las luminarias del pasillo.", correoCreador: "maria@urbanix.com" },
  { id: "4", titulo: "Grieta en muro exterior", descripcion: "Se observa una grieta de aproximadamente 30cm en el muro exterior del edificio, zona noreste. Requiere evaluación estructural.", ubicacion: "Muro exterior - Zona Norte", prioridad: "alta", estado: "en_evaluacion", evidencias: demos(5), fechaReporte: fechaHoraEnDias(-5, "09:00"), fechaActualizacion: fechaHoraEnDias(-2, "11:30"), comentarioAdmin: "Un ingeniero revisará la grieta el viernes.", correoCreador: "laura@urbanix.com" },
  { id: "5", titulo: "Grieta en el muro del parqueadero", descripcion: "Se observa una grieta creciente cerca del parqueadero 12.", ubicacion: "Parqueadero Nivel 2", prioridad: "media", estado: "pendiente", evidencias: [], fechaReporte: fechaHoraEnDias(-2, "11:00"), fechaActualizacion: null, comentarioAdmin: null, correoCreador: "juan@urbanix.com" },
  { id: "6", titulo: "Puerta de la piscina no cierra", descripcion: "La puerta de acceso a la zona húmeda queda abierta y no cierra con el resorte.", ubicacion: "Zona húmeda - Piscina", prioridad: "media", estado: "resuelto", evidencias: demos(2), fechaReporte: fechaHoraEnDias(-11, "15:45"), fechaActualizacion: fechaHoraEnDias(-8, "09:30"), comentarioAdmin: "Se reemplazó el resorte y se lubricaron las bisagras.", correoCreador: "laura@urbanix.com" },
  { id: "7", titulo: "Grifo roto en zona BBQ", descripcion: "El grifo del lavaplatos de la zona BBQ gotea todo el día.", ubicacion: "Zona BBQ", prioridad: "baja", estado: "en_proceso", evidencias: demos(1), fechaReporte: fechaHoraEnDias(-4, "17:15"), fechaActualizacion: fechaHoraEnDias(-1, "10:20"), comentarioAdmin: "El repuesto llega mañana.", correoCreador: "juan@urbanix.com" },
  { id: "8", titulo: "Humedad en el salón social", descripcion: "Aparecieron manchas de humedad en la pared del fondo del salón social.", ubicacion: "Salón social", prioridad: "baja", estado: "pendiente", evidencias: [], fechaReporte: fechaHoraEnDias(-1, "13:00"), fechaActualizacion: null, comentarioAdmin: null, correoCreador: "maria@urbanix.com" },
];

// Copia ordenada: el reporte mas reciente primero
export function obtenerTodosLosReportes(): ReporteDano[] {
  return [...reportes].sort((a, b) => new Date(b.fechaReporte).getTime() - new Date(a.fechaReporte).getTime());
}

export function obtenerReportesPorUsuario(correo: string): ReporteDano[] {
  return obtenerTodosLosReportes().filter((r) => r.correoCreador === correo);
}

export function obtenerReportePorId(id: string): ReporteDano | undefined {
  return reportes.find((r) => r.id === id);
}

// "1" -> "RD-001"
export function codigoReporte(id: string): string {
  return `RD-${id.padStart(3, "0")}`;
}

// La prioridad la define la administracion: todo reporte nuevo nace "media"
export function crearReporte(datos: {
  titulo: string;
  descripcion: string;
  ubicacion: string;
  evidencias: string[];
  correoCreador: string;
}): void {
  const nuevoId = (Math.max(0, ...reportes.map((r) => Number(r.id))) + 1).toString();
  reportes = [
    ...reportes,
    {
      id: nuevoId,
      ...datos,
      prioridad: "media",
      estado: "pendiente",
      fechaReporte: new Date().toISOString(),
      fechaActualizacion: null,
      comentarioAdmin: null,
    },
  ];
}

// RF-53: el administrador gestiona el reporte (estado, prioridad y comentario)
export function actualizarReporte(
  id: string,
  cambios: { estado: EstadoReporte; prioridad: PrioridadReporte; comentarioAdmin: string }
): void {
  const comentario = cambios.comentarioAdmin.trim();

  reportes = reportes.map((r) =>
    r.id === id
      ? {
          ...r,
          estado: cambios.estado,
          prioridad: cambios.prioridad,
          comentarioAdmin: comentario === "" ? null : comentario,
          fechaActualizacion: new Date().toISOString(),
        }
      : r
  );
}