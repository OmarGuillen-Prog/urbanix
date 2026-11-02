// Preferencias de cada persona y parametros del conjunto.

// Categorias de notificaciones que cada persona puede activar o desactivar
export type CategoriaNotificacion = "comunicados" | "reservas" | "visitas" | "pqrs" | "reportes" | "cuotas";

export interface PreferenciasUsuario {
  categorias: Record<CategoriaNotificacion, boolean>;
  porCorreo: boolean; // recibir tambien por correo (se activa de verdad cuando exista el backend)
  minutosInactividad: number; // RNF-05: cierre de sesion automatico
}

export const OPCIONES_INACTIVIDAD = [15, 30, 60];

const PREFERENCIAS_INICIALES: PreferenciasUsuario = {
  categorias: { comunicados: true, reservas: true, visitas: true, pqrs: true, reportes: true, cuotas: true },
  porCorreo: true,
  minutosInactividad: 30,
};

// Una entrada por persona (clave: su correo). Si nunca configuro nada, aplican las iniciales.
let preferencias: Record<string, PreferenciasUsuario> = {};

export function obtenerPreferencias(correo: string): PreferenciasUsuario {
  const base = preferencias[correo] ?? PREFERENCIAS_INICIALES;
  // Los avisos de cuotas y pagos son obligatorios: no se pueden apagar
  return { ...base, categorias: { ...base.categorias, cuotas: true } };
}

export function guardarPreferencias(
  correo: string,
  cambios: {
    categorias?: Partial<PreferenciasUsuario["categorias"]>;
    porCorreo?: boolean;
    minutosInactividad?: number;
  }
): void {
  const actual = obtenerPreferencias(correo);

  // Solo se aceptan las opciones de inactividad que ofrecemos
  const minutos =
    cambios.minutosInactividad !== undefined && OPCIONES_INACTIVIDAD.includes(cambios.minutosInactividad)
      ? cambios.minutosInactividad
      : actual.minutosInactividad;

  preferencias = {
    ...preferencias,
    [correo]: {
      categorias: { ...actual.categorias, ...cambios.categorias, cuotas: true },
      porCorreo: cambios.porCorreo ?? actual.porCorreo,
      minutosInactividad: minutos,
    },
  };
}

// ---------- Que categoria es una notificacion? Se deduce de la pantalla a la que lleva ----------
const PREFIJOS: [string, CategoriaNotificacion][] = [
  ["/panel/cuotas", "cuotas"],
  ["/panel/comunicados", "comunicados"],
  ["/panel/reservas", "reservas"],
  ["/panel/visitas", "visitas"],
  ["/panel/pqrs", "pqrs"],
  ["/panel/reportes", "reportes"],
];

export function categoriaDeEnlace(enlace: string | undefined): CategoriaNotificacion | null {
  if (!enlace) return null;
  return PREFIJOS.find(([prefijo]) => enlace.startsWith(prefijo))?.[1] ?? null;
}

// El store de notificaciones pregunta aqui antes de crear un aviso
export function quiereRecibir(correo: string, enlace: string | undefined): boolean {
  const categoria = categoriaDeEnlace(enlace);
  if (categoria === null) return true; // sin categoria conocida: se entrega siempre
  return obtenerPreferencias(correo).categorias[categoria];
}

// ---------- Parametros del conjunto (los edita el administrador) ----------
export interface ConfiguracionConjunto {
  nombre: string;
  direccion: string;
  ciudad: string;
  telefonoPorteria: string;
  correoContacto: string;
  diasRecordatorio: number; // cuantos dias antes del vencimiento se recuerda una cuota
}

export const LIMITES_RECORDATORIO = { minimo: 1, maximo: 15 };

let conjunto: ConfiguracionConjunto = {
  nombre: "Conjunto Residencial Torres del Parque",
  direccion: "Carrera 43A # 10-25",
  ciudad: "Medellín, Antioquia",
  telefonoPorteria: "604 123 4567",
  correoContacto: "administracion@urbanix.com",
  diasRecordatorio: 7,
};

export function obtenerConfigConjunto(): ConfiguracionConjunto {
  return conjunto;
}

export function guardarConfigConjunto(datos: ConfiguracionConjunto): void {
  conjunto = { ...datos };
}