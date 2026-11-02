import type { Rol } from "@/context/AuthContext";
import type { CategoriaNotificacion } from "@/lib/configuracionStore";

export const ETIQUETAS_ROL: Record<Rol, string> = {
  administrador: "Administrador",
  residente: "Residente",
  portero: "Portero",
};

export const CATEGORIAS: Record<CategoriaNotificacion, { titulo: string; descripcion: string }> = {
  comunicados: { titulo: "Comunicados", descripcion: "Avisos oficiales que publica la administración" },
  reservas: { titulo: "Reservas", descripcion: "Reservas de zonas comunes nuevas, confirmadas o canceladas" },
  visitas: { titulo: "Visitas", descripcion: "Cuando llega una visita o se registra una nueva" },
  pqrs: { titulo: "PQRS", descripcion: "Solicitudes nuevas y las respuestas a las tuyas" },
  reportes: { titulo: "Reportes de daños", descripcion: "Reportes nuevos y cambios en su estado" },
  cuotas: { titulo: "Cuotas y pagos", descripcion: "Cuotas nuevas, recordatorios y pagos registrados" },
};

// Cada rol solo ve las categorias que le pueden llegar
export const CATEGORIAS_POR_ROL: Record<Rol, CategoriaNotificacion[]> = {
  administrador: ["pqrs", "reportes", "reservas", "cuotas"],
  residente: ["comunicados", "visitas", "reservas", "pqrs", "reportes", "cuotas"],
  portero: ["comunicados", "visitas"],
};

export type SeccionConfiguracion = "perfil" | "notificaciones" | "seguridad" | "conjunto" | "privacidad";

export const SECCIONES: { clave: SeccionConfiguracion; titulo: string; icono: string; soloAdministrador?: boolean }[] = [
  { clave: "perfil", titulo: "Perfil", icono: "👤" },
  { clave: "notificaciones", titulo: "Notificaciones", icono: "🔔" },
  { clave: "seguridad", titulo: "Seguridad", icono: "🔒" },
  { clave: "conjunto", titulo: "Conjunto", icono: "🏢", soloAdministrador: true },
  { clave: "privacidad", titulo: "Privacidad", icono: "🛡️" },
];