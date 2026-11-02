import { notificarUsuario } from "./notificacionesStore";
import { obtenerUsuarios, type Usuario } from "./usuariosStore";
import { obtenerPropiedades } from "./propiedadesStore";
import { fechaHoraEnDias, hoyLocal } from "./fechas";
import type { Rol } from "@/context/AuthContext";

export type CategoriaComunicado = "mantenimiento" | "administrativo" | "normativo" | "comunidad";
export type DestinoComunicado = "todos" | "propietarios" | "arrendatarios";
export type EstadoComunicado = "publicado" | "borrador" | "archivado";

// Refleja "Comunicado" del MER: titulo, contenido, fecha_publicacion, estado, id_administrador (FK),
// ahora con categoria, destinatarios, "fijado" y quienes ya lo vieron.
export interface Comunicado {
  id: string;
  titulo: string;
  contenido: string;
  categoria: CategoriaComunicado;
  destino: DestinoComunicado;
  estado: EstadoComunicado;
  fijado: boolean; // los fijados aparecen primero
  fechaPublicacion: string; // ISO (de un borrador: cuando se creo; se actualiza al publicarlo)
  correoAutor: string;
  vistoPor: string[]; // correos unicos de quienes lo abrieron (los administradores no cuentan)
}

// Lo que escribe el administrador en el formulario
export interface DatosComunicado {
  titulo: string;
  contenido: string;
  categoria: CategoriaComunicado;
  destino: DestinoComunicado;
  fijado: boolean;
}

let comunicados: Comunicado[] = [
  {
    id: "1",
    titulo: "Mantenimiento preventivo de ascensores",
    contenido:
      "Estimados residentes, les informamos que se realizará el mantenimiento preventivo de los ascensores de las torres A y B. El servicio estará suspendido de 8:00 AM a 12:00 PM. Pedimos disculpas por los inconvenientes.",
    categoria: "mantenimiento",
    destino: "todos",
    estado: "publicado",
    fijado: true,
    fechaPublicacion: fechaHoraEnDias(-9, "09:00"),
    correoAutor: "omar@urbanix.com",
    vistoPor: ["juan@urbanix.com", "maria@urbanix.com", "laura@urbanix.com", "andres@urbanix.com"],
  },
  {
    id: "2",
    titulo: "Asamblea general de propietarios",
    contenido:
      "Se convoca a todos los propietarios a la Asamblea General Ordinaria que se realizará el próximo mes a las 6:00 PM en el Salón Social del conjunto. Orden del día: rendición de cuentas, presupuesto del próximo año y elección del Consejo de Administración.",
    categoria: "administrativo",
    destino: "propietarios",
    estado: "publicado",
    fijado: true,
    fechaPublicacion: fechaHoraEnDias(0, "07:30"),
    correoAutor: "omar@urbanix.com",
    vistoPor: ["juan@urbanix.com", "maria@urbanix.com"],
  },
  {
    id: "3",
    titulo: "Nuevas normas de uso de zonas comunes",
    contenido:
      "A partir del próximo mes entrarán en vigencia las nuevas normas de convivencia para el uso de las zonas comunes. Por favor consulta las reglas de cada zona en la sección Zonas comunes y familiarízate con las nuevas disposiciones.",
    categoria: "normativo",
    destino: "todos",
    estado: "publicado",
    fijado: false,
    fechaPublicacion: fechaHoraEnDias(-14, "08:15"),
    correoAutor: "omar@urbanix.com",
    vistoPor: ["juan@urbanix.com", "maria@urbanix.com", "laura@urbanix.com"],
  },
  {
    id: "4",
    titulo: "Jornada de reciclaje comunitario",
    contenido:
      "Este sábado realizaremos una jornada de reciclaje en el conjunto. Podrá depositar papel, cartón, plástico y vidrio en los puntos de acopio habilitados en cada piso. Contribuye al medio ambiente.",
    categoria: "comunidad",
    destino: "todos",
    estado: "publicado",
    fijado: false,
    fechaPublicacion: fechaHoraEnDias(-18, "16:40"),
    correoAutor: "omar@urbanix.com",
    vistoPor: ["juan@urbanix.com"],
  },
  {
    id: "5",
    titulo: "Corte de agua programado",
    contenido: "Borrador: confirmar con la empresa de acueducto la fecha y la duración del corte antes de publicar.",
    categoria: "mantenimiento",
    destino: "todos",
    estado: "borrador",
    fijado: false,
    fechaPublicacion: fechaHoraEnDias(-1, "11:00"),
    correoAutor: "omar@urbanix.com",
    vistoPor: [],
  },
];

// ---------- A quien le toca ----------
// Los destinatarios de un comunicado: usuarios ACTIVOS segun a quien va dirigido.
// "todos" = residentes y porteria; "propietarios" / "arrendatarios" = residentes con esa relacion.
export function destinatariosDe(destino: DestinoComunicado): Usuario[] {
  const propiedades = obtenerPropiedades();
  const idsPropietarios = new Set(propiedades.map((p) => p.idPropietario).filter((id): id is string => id !== null));
  const idsArrendatarios = new Set(propiedades.map((p) => p.idArrendatario).filter((id): id is string => id !== null));

  return obtenerUsuarios().filter((usuario) => {
    if (usuario.estado !== "activo") return false;
    if (destino === "todos") return usuario.rol === "residente" || usuario.rol === "portero";
    if (usuario.rol !== "residente") return false;
    return destino === "propietarios" ? idsPropietarios.has(usuario.id) : idsArrendatarios.has(usuario.id);
  });
}

// Regla unica de visibilidad: el administrador ve todo; los demas, solo lo PUBLICADO que va para ellos
export function puedeVerComunicado(comunicado: Comunicado, correo: string, rol: Rol): boolean {
  if (rol === "administrador") return true;
  if (comunicado.estado !== "publicado") return false;
  return destinatariosDe(comunicado.destino).some((usuario) => usuario.correo === correo);
}

// ---------- Lectura ----------
// Copia ordenada: primero los fijados, y dentro de cada grupo el mas reciente primero
function ordenar(lista: Comunicado[]): Comunicado[] {
  return [...lista].sort((a, b) => {
    if (a.fijado !== b.fijado) return a.fijado ? -1 : 1;
    return new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime();
  });
}

export function obtenerTodosLosComunicados(): Comunicado[] {
  return ordenar(comunicados);
}

export function obtenerComunicadosParaUsuario(correo: string, rol: Rol): Comunicado[] {
  return ordenar(comunicados.filter((c) => puedeVerComunicado(c, correo, rol)));
}

export function obtenerComunicadoPorId(id: string): Comunicado | undefined {
  return comunicados.find((c) => c.id === id);
}

export function contarPublicadosEsteMes(lista: Comunicado[]): number {
  const mes = hoyLocal().slice(0, 7);
  return lista.filter(
    (c) => c.estado === "publicado" && new Date(c.fechaPublicacion).toLocaleDateString("en-CA").startsWith(mes)
  ).length;
}

// ---------- Escritura ----------
// RF-35: al PUBLICAR, se avisa a los destinatarios (no a todo el mundo)
function avisarAlPublico(titulo: string, destino: DestinoComunicado): void {
  for (const usuario of destinatariosDe(destino)) {
    notificarUsuario(usuario.correo, {
      tipo: "info",
      titulo: "Nuevo comunicado",
      mensaje: titulo,
      enlace: "/panel/comunicados",
    });
  }
}

export function crearComunicado(
  datos: DatosComunicado & { estado: "publicado" | "borrador"; correoAutor: string }
): void {
  const nuevoId = (Math.max(0, ...comunicados.map((c) => Number(c.id))) + 1).toString();
  comunicados = [...comunicados, { id: nuevoId, ...datos, fechaPublicacion: new Date().toISOString(), vistoPor: [] }];

  // Un borrador NO avisa a nadie: solo se avisa cuando se publica
  if (datos.estado === "publicado") avisarAlPublico(datos.titulo, datos.destino);
}

export function actualizarComunicado(id: string, cambios: DatosComunicado & { estado: EstadoComunicado }): void {
  const anterior = comunicados.find((c) => c.id === id);
  if (!anterior) return;

  // "Se acaba de publicar" = pasa de BORRADOR a PUBLICADO (un archivado que vuelve no avisa de nuevo)
  const seAcabaDePublicar = anterior.estado === "borrador" && cambios.estado === "publicado";

  comunicados = comunicados.map((c) =>
    c.id === id
      ? { ...c, ...cambios, fechaPublicacion: seAcabaDePublicar ? new Date().toISOString() : c.fechaPublicacion }
      : c
  );

  if (seAcabaDePublicar) avisarAlPublico(cambios.titulo, cambios.destino);
}

export function alternarFijado(id: string): void {
  comunicados = comunicados.map((c) => (c.id === id ? { ...c, fijado: !c.fijado } : c));
}

export function eliminarComunicado(id: string): void {
  comunicados = comunicados.filter((c) => c.id !== id);
}

// Cuenta UNA visualizacion por persona. Los administradores no cuentan (son quienes publican).
export function registrarVisualizacion(id: string, correo: string, rol: Rol): void {
  if (rol === "administrador") return;

  comunicados = comunicados.map((c) =>
    c.id === id && !c.vistoPor.includes(correo) ? { ...c, vistoPor: [...c.vistoPor, correo] } : c
  );
}