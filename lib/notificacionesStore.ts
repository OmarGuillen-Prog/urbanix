// lib/notificacionesStore.ts
// Bandeja de notificaciones. Los demas modulos la USAN para avisar de eventos
// (notificarUsuario / notificarARol); esta nunca importa de ellos, asi no hay ciclos.
import { obtenerUsuarios } from "./usuariosStore";
import type { Rol } from "@/context/AuthContext";

export type TipoNotificacion = "alerta" | "info" | "exito";

// Refleja "Notificacion" del MER: titulo, mensaje, tipo, fecha_envio, leida, id_usuario (FK)
export interface Notificacion {
  id: string;
  correoDestino: string; // a quien le llega
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
  fecha: string; // ISO
  leida: boolean;
  enlace: string | null; // pantalla a la que lleva al tocarla
}

// Lo que un modulo envia para crear una notificacion
export interface DatosNotificacion {
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
  enlace?: string;
}

// ---------- Datos de ejemplo (con horas relativas a "ahora") ----------
function haceHoras(horas: number): string {
  return new Date(Date.now() - horas * 60 * 60 * 1000).toISOString();
}

type Semilla = Omit<Notificacion, "id" | "fecha"> & { horasAtras: number };

const SEMILLAS: Semilla[] = [
  // Administrador
  { correoDestino: "omar@urbanix.com", tipo: "alerta", titulo: "Cuota pendiente", mensaje: "La unidad B-201 tiene una cuota vencida de $1.100.000", horasAtras: 2, leida: false, enlace: "/panel/cuotas" },
  { correoDestino: "omar@urbanix.com", tipo: "info", titulo: "Nueva reservación", mensaje: "Zona BBQ reservada por María López", horasAtras: 4, leida: false, enlace: "/panel/reservas" },
  { correoDestino: "omar@urbanix.com", tipo: "exito", titulo: "Mantenimiento completado", mensaje: "Reparación de iluminación en Torre A - Piso 3 completada", horasAtras: 5, leida: true, enlace: "/panel/reportes/3" },
  { correoDestino: "omar@urbanix.com", tipo: "alerta", titulo: "PQRS de alta prioridad", mensaje: "Nueva queja de alta prioridad de la unidad A-101", horasAtras: 8, leida: false, enlace: "/panel/pqrs/3" },
  { correoDestino: "omar@urbanix.com", tipo: "info", titulo: "Nuevo visitante", mensaje: "Visitante registrado para la unidad B-201: Camila Torres", horasAtras: 24, leida: true, enlace: "/panel/visitas" },
  { correoDestino: "omar@urbanix.com", tipo: "exito", titulo: "Cuota recibida", mensaje: "Cuota de $1.200.000 recibida de la unidad A-101", horasAtras: 26, leida: true, enlace: "/panel/cuotas" },
  { correoDestino: "omar@urbanix.com", tipo: "alerta", titulo: "Reporte de daño de alta prioridad", mensaje: "Filtración de agua en el Parqueadero Nivel 1", horasAtras: 50, leida: true, enlace: "/panel/reportes/1" },
  { correoDestino: "omar@urbanix.com", tipo: "info", titulo: "Reserva cancelada", mensaje: "Una reserva de la Piscina fue cancelada por Juan Manuel", horasAtras: 72, leida: true, enlace: "/panel/reservas" },
  // Residentes
  { correoDestino: "juan@urbanix.com", tipo: "alerta", titulo: "Cuota por vencer", mensaje: "Tu cuota de administración de $1.100.000 vence pronto", horasAtras: 3, leida: false, enlace: "/panel/cuotas" },
  { correoDestino: "juan@urbanix.com", tipo: "info", titulo: "Nuevo comunicado", mensaje: "Asamblea general de copropietarios", horasAtras: 20, leida: false, enlace: "/panel/comunicados" },
  { correoDestino: "juan@urbanix.com", tipo: "exito", titulo: "Reserva confirmada", mensaje: "Tu reserva del Salón social quedó confirmada", horasAtras: 48, leida: true, enlace: "/panel/reservas" },
  { correoDestino: "maria@urbanix.com", tipo: "info", titulo: "Nuevo comunicado", mensaje: "Asamblea general de copropietarios", horasAtras: 20, leida: false, enlace: "/panel/comunicados" },
  { correoDestino: "maria@urbanix.com", tipo: "exito", titulo: "Reparación completada", mensaje: "RD-003: Iluminación defectuosa en pasillo fue resuelto.", horasAtras: 5, leida: true, enlace: "/panel/reportes/3" },
  { correoDestino: "laura@urbanix.com", tipo: "info", titulo: "Nuevo comunicado", mensaje: "Asamblea general de copropietarios", horasAtras: 20, leida: false, enlace: "/panel/comunicados" },
  // Portero
  { correoDestino: "andres@urbanix.com", tipo: "info", titulo: "Visita esperada hoy", mensaje: "Camila Torres llega a las 16:20 (unidad A-101)", horasAtras: 1, leida: false, enlace: "/panel/visitas" },
  { correoDestino: "andres@urbanix.com", tipo: "info", titulo: "Nuevo comunicado", mensaje: "Asamblea general de copropietarios", horasAtras: 20, leida: true, enlace: "/panel/comunicados" },
];

let notificaciones: Notificacion[] = SEMILLAS.map((semilla, indice) => {
  const { horasAtras, ...resto } = semilla;
  return { id: String(indice + 1), fecha: haceHoras(horasAtras), ...resto };
});

// ---------- "Timbre": los componentes se SUSCRIBEN y el store avisa cuando cambia ----------
const oyentes = new Set<() => void>();
let version = 0;

function avisarCambio(): void {
  version += 1;
  oyentes.forEach((oyente) => oyente());
}

export function suscribir(oyente: () => void): () => void {
  oyentes.add(oyente);
  return () => {
    oyentes.delete(oyente);
  };
}

export function obtenerVersion(): number {
  return version;
}

// ---------- Lectura ----------
// Copia ordenada: la mas reciente primero
export function obtenerNotificacionesDeUsuario(correo: string): Notificacion[] {
  return notificaciones
    .filter((n) => n.correoDestino === correo)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
}

export function contarSinLeer(correo: string): number {
  return notificaciones.filter((n) => n.correoDestino === correo && !n.leida).length;
}

// ---------- Crear (lo llaman los demas modulos al ocurrir un evento) ----------
function siguienteId(): string {
  return (Math.max(0, ...notificaciones.map((n) => Number(n.id))) + 1).toString();
}

function crear(correoDestino: string, datos: DatosNotificacion, id: string): Notificacion {
  return {
    id,
    correoDestino,
    tipo: datos.tipo,
    titulo: datos.titulo,
    mensaje: datos.mensaje,
    fecha: new Date().toISOString(),
    leida: false,
    enlace: datos.enlace ?? null,
  };
}

// Avisar a UNA persona
export function notificarUsuario(correoDestino: string, datos: DatosNotificacion): void {
  notificaciones = [...notificaciones, crear(correoDestino, datos, siguienteId())];
  avisarCambio();
}

// Avisar a TODOS los usuarios activos de un rol (como un altavoz del edificio).
// "excluirCorreo": quien origino el evento no necesita avisarse a si mismo.
export function notificarARol(rol: Rol, datos: DatosNotificacion, excluirCorreo?: string): void {
  const destinatarios = obtenerUsuarios().filter(
    (u) => u.rol === rol && u.estado === "activo" && u.correo !== excluirCorreo
  );
  if (destinatarios.length === 0) return;

  let proximoId = Number(siguienteId());
  const nuevas = destinatarios.map((u) => crear(u.correo, datos, String(proximoId++)));

  notificaciones = [...notificaciones, ...nuevas];
  avisarCambio();
}

// ---------- Cambiar / borrar (siempre verificando que sean DEL usuario) ----------
export function marcarComoLeida(id: string, correo: string): void {
  notificaciones = notificaciones.map((n) => (n.id === id && n.correoDestino === correo ? { ...n, leida: true } : n));
  avisarCambio();
}

export function marcarTodasComoLeidas(correo: string): void {
  notificaciones = notificaciones.map((n) => (n.correoDestino === correo ? { ...n, leida: true } : n));
  avisarCambio();
}

export function eliminarNotificacion(id: string, correo: string): void {
  notificaciones = notificaciones.filter((n) => !(n.id === id && n.correoDestino === correo));
  avisarCambio();
}

export function eliminarTodas(correo: string): void {
  notificaciones = notificaciones.filter((n) => n.correoDestino !== correo);
  avisarCambio();
}