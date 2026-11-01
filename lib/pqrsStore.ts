import { obtenerUsuarios, type Usuario } from "./usuariosStore";
import { notificarARol, notificarUsuario } from "./notificacionesStore";

// Estos dos ayudantes ahora viven en personasHelpers (los usa tambien Reservas).
// Los re-exportamos con el nombre anterior para no tocar los archivos de PQRS.
export { unidadDeUsuario as unidadDelCreador, nombrePorCorreo } from "./personasHelpers";
export type TipoPQRS = "peticion" | "queja" | "reclamo" | "sugerencia";
export type PrioridadPQRS = "alta" | "media" | "baja";
export type EstadoPQRS = "pendiente" | "en_proceso" | "resuelto";

export interface PQRS {
  id: string;
  tipo: TipoPQRS;
  asunto: string;
  descripcion: string;
  prioridad: PrioridadPQRS;
  estado: EstadoPQRS;
  respuesta: string | null;
  fechaCreacion: string;
  fechaRespuesta: string | null;
  correoCreador: string;
  correoAsignado: string | null;
}

let listaPQRS: PQRS[] = [
  { id: "1", tipo: "reclamo", asunto: "Fuga de agua en el pasillo del piso 2", descripcion: "Desde ayer hay una fuga visible cerca del ascensor.", prioridad: "alta", estado: "pendiente", respuesta: null, fechaCreacion: "2026-10-12T10:00:00.000Z", fechaRespuesta: null, correoCreador: "juan@urbanix.com", correoAsignado: "omar@urbanix.com" },
  { id: "2", tipo: "queja", asunto: "Ruido excesivo los fines de semana", descripcion: "Los sábados en la noche hay música muy alta en la zona social.", prioridad: "media", estado: "resuelto", respuesta: "Se enviará un comunicado recordando las normas de convivencia.", fechaCreacion: "2026-10-05T18:30:00.000Z", fechaRespuesta: "2026-10-06T09:00:00.000Z", correoCreador: "juan@urbanix.com", correoAsignado: "omar@urbanix.com" },
  { id: "3", tipo: "queja", asunto: "Ascensor fuera de servicio", descripcion: "El ascensor de la Torre A lleva dos días sin funcionar.", prioridad: "alta", estado: "en_proceso", respuesta: null, fechaCreacion: "2026-10-10T08:15:00.000Z", fechaRespuesta: null, correoCreador: "maria@urbanix.com", correoAsignado: "omar@urbanix.com" },
  { id: "4", tipo: "peticion", asunto: "Consulta sobre fecha de pago", descripcion: "¿Hasta qué día puedo pagar la administración sin recargo?", prioridad: "media", estado: "pendiente", respuesta: null, fechaCreacion: "2026-10-14T14:00:00.000Z", fechaRespuesta: null, correoCreador: "laura@urbanix.com", correoAsignado: "omar@urbanix.com" },
  { id: "5", tipo: "sugerencia", asunto: "Mejora de zona común", descripcion: "Sería bueno agregar más bancas en la zona BBQ.", prioridad: "baja", estado: "resuelto", respuesta: "Lo llevaremos a la próxima asamblea.", fechaCreacion: "2026-09-28T16:00:00.000Z", fechaRespuesta: "2026-09-30T11:00:00.000Z", correoCreador: "laura@urbanix.com", correoAsignado: "omar@urbanix.com" },
  { id: "6", tipo: "peticion", asunto: "Asignación de parqueadero", descripcion: "Solicito información para asignar un segundo parqueadero.", prioridad: "baja", estado: "resuelto", respuesta: "Ya fue asignado el parqueadero P-03.", fechaCreacion: "2026-09-25T09:30:00.000Z", fechaRespuesta: "2026-09-26T10:00:00.000Z", correoCreador: "juan@urbanix.com", correoAsignado: "omar@urbanix.com" },
  { id: "7", tipo: "queja", asunto: "Visitantes sin registrar en portería", descripcion: "Entraron visitantes sin identificarse en la portería.", prioridad: "media", estado: "pendiente", respuesta: null, fechaCreacion: "2026-10-15T20:00:00.000Z", fechaRespuesta: null, correoCreador: "maria@urbanix.com", correoAsignado: "andres@urbanix.com" },
  { id: "8", tipo: "sugerencia", asunto: "Más iluminación en el parqueadero", descripcion: "La zona del fondo del parqueadero queda muy oscura de noche.", prioridad: "baja", estado: "pendiente", respuesta: null, fechaCreacion: "2026-10-16T19:00:00.000Z", fechaRespuesta: null, correoCreador: "laura@urbanix.com", correoAsignado: null },
];

// Devolvemos una COPIA ordenada (mas reciente primero), igual que en Comunicados.
export function obtenerTodasLasPQRS(): PQRS[] {
  return [...listaPQRS].sort(
    (a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
  );
}

export function obtenerPQRSPorUsuario(correo: string): PQRS[] {
  return obtenerTodasLasPQRS().filter((p) => p.correoCreador === correo);
}

export function obtenerPQRSPorId(id: string): PQRS | undefined {
  return listaPQRS.find((p) => p.id === id);
}

export function crearPQRS(datos: {
  tipo: TipoPQRS;
  asunto: string;
  descripcion: string;
  correoCreador: string;
}): void {
  const nuevoId = (Math.max(0, ...listaPQRS.map((p) => Number(p.id))) + 1).toString();

  listaPQRS = [
    ...listaPQRS,
    {
      id: nuevoId,
      ...datos,
      prioridad: "media",
      estado: "pendiente",
      respuesta: null,
      fechaCreacion: new Date().toISOString(),
      fechaRespuesta: null,
      correoAsignado: null,
    },
  ];

  // Avisar a los administradores que llego una PQRS nueva
  notificarARol("administrador", {
    tipo: "alerta",
    titulo: "Nueva PQRS",
    mensaje: `${codigoTicket(nuevoId)}: ${datos.asunto}`,
    enlace: `/panel/pqrs/${nuevoId}`,
  });
}

// Como se nombra cada estado dentro de una frase ("ahora esta ...")
const TEXTO_ESTADO: Record<EstadoPQRS, string> = {
  pendiente: "pendiente",
  en_proceso: "en proceso",
  resuelto: "resuelta",
};

// El administrador gestiona la solicitud: estado, prioridad, a quien
// se asigna y la respuesta (HU-25).
export function actualizarPQRS(
  id: string,
  cambios: {
    estado: EstadoPQRS;
    prioridad: PrioridadPQRS;
    correoAsignado: string | null;
    respuesta: string;
  }
): void {
  const anterior = listaPQRS.find((p) => p.id === id);

  listaPQRS = listaPQRS.map((p) => {
    if (p.id !== id) return p;

    const hayRespuesta = cambios.respuesta.trim() !== "";
    const respuestaNueva = hayRespuesta && cambios.respuesta !== p.respuesta;

    return {
      ...p,
      estado: cambios.estado,
      prioridad: cambios.prioridad,
      correoAsignado: cambios.correoAsignado,
      respuesta: hayRespuesta ? cambios.respuesta : null,
      fechaRespuesta: !hayRespuesta ? null : respuestaNueva ? new Date().toISOString() : p.fechaRespuesta,
    };
  });

  if (!anterior) return;

  // Avisarle al residente: primero si hay respuesta nueva; si no, si cambio el estado
  const hayRespuestaNueva = cambios.respuesta.trim() !== "" && cambios.respuesta !== anterior.respuesta;

  if (hayRespuestaNueva) {
    notificarUsuario(anterior.correoCreador, {
      tipo: "exito",
      titulo: "Tu PQRS fue respondida",
      mensaje: `${codigoTicket(id)}: ${anterior.asunto}`,
      enlace: `/panel/pqrs/${id}`,
    });
  } else if (cambios.estado !== anterior.estado) {
    notificarUsuario(anterior.correoCreador, {
      tipo: "info",
      titulo: "Tu PQRS cambió de estado",
      mensaje: `${codigoTicket(id)} ahora está ${TEXTO_ESTADO[cambios.estado]}.`,
      enlace: `/panel/pqrs/${id}`,
    });
  }
}

// --- Ayudantes de presentacion (los "JOIN manuales" de siempre) ---

// "1" -> "PQRS-0001"
export function codigoTicket(id: string): string {
  return `PQRS-${id.padStart(4, "0")}`;
}

// A quien se le puede asignar una PQRS: el personal del conjunto
export function usuariosAsignables(): Usuario[] {
  return obtenerUsuarios().filter((u) => u.rol === "administrador" || u.rol === "portero");
}