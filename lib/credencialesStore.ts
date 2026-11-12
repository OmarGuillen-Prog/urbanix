import type { UsuarioSesion } from "@/context/AuthContext";
import { obtenerUsuarios, obtenerUsuarioPorCorreo, crearUsuario, existeCorreoUsuario } from "./usuariosStore";
import { notificarARol } from "./notificacionesStore";

// Aqui solo viven las CONTRASEÑAS (clave: id del usuario). Quien es cada persona (nombre, rol, estado)
// vive en usuariosStore: una sola fuente de verdad. Con una base de datos real, la contraseña seria una
// columna (cifrada) de la tabla Usuario, y nunca se enviaria al navegador.
const CONTRASENA_DE_EJEMPLO = "12345678";

let contrasenas: Record<string, string> = Object.fromEntries(
  obtenerUsuarios().map((usuario) => [usuario.id, CONTRASENA_DE_EJEMPLO])
);

// ---------- Iniciar sesion ----------
export type ResultadoLogin =
  | { ok: true; sesion: UsuarioSesion }
  | { ok: false; motivo: "credenciales" | "inactivo" };

export function verificarCredenciales(correo: string, contrasena: string): Promise<ResultadoLogin> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const usuario = obtenerUsuarioPorCorreo(correo.toLowerCase().trim());

      // Mismo resultado si el correo no existe o la contraseña no coincide: asi nadie puede
      // descubrir probando que correos estan registrados.
      if (!usuario || contrasenas[usuario.id] !== contrasena) {
        resolve({ ok: false, motivo: "credenciales" });
        return;
      }

      // Contraseña correcta, pero la cuenta fue desactivada por el administrador
      if (usuario.estado !== "activo") {
        resolve({ ok: false, motivo: "inactivo" });
        return;
      }

      // La sesion lleva SOLO estos datos (nunca la contraseña, ni aunque manana se agreguen mas campos al usuario)
      resolve({
        ok: true,
        sesion: { correo: usuario.correo, nombres: usuario.nombres, apellidos: usuario.apellidos, rol: usuario.rol },
      });
    }, 500);
  });
}

// ¿La persona de esta sesion sigue existiendo y activa? La sesion vive en el navegador, pero la
// "verdad" es la lista de usuarios (un servidor real lo comprueba en cada peticion).
export function sesionSigueSiendoValida(correo: string): boolean {
  const usuario = obtenerUsuarioPorCorreo(correo);
  return usuario !== undefined && usuario.estado === "activo";
}

// ---------- Registro (HU-01) ----------
export interface DatosRegistro {
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  numeroUnidad: string;
  contrasena: string;
}

export type ResultadoRegistro = { exito: true; sesion: UsuarioSesion } | { exito: false; mensaje: string };

export function registrarCuenta(datos: DatosRegistro): ResultadoRegistro {
  const correo = datos.correo.toLowerCase().trim();

  if (existeCorreoUsuario(correo)) {
    return { exito: false, mensaje: "Este correo ya está registrado" };
  }

  // Todo registro nace como RESIDENTE y activo. La persona NO elige su rol: asignar otro es tarea
  // del administrador (HU-04). Dar siempre el minimo de permisos al empezar es una regla basica de seguridad.
  const nuevo = crearUsuario({
    nombres: datos.nombres.trim(),
    apellidos: datos.apellidos.trim(),
    correo,
    telefono: datos.telefono.trim(),
    documento: "",
    estado: "activo",
    rol: "residente",
    unidadSolicitada: datos.numeroUnidad.trim(),
  });
  contrasenas = { ...contrasenas, [nuevo.id]: datos.contrasena };

  // El administrador se entera, y de que unidad dice ser
  notificarARol("administrador", {
    tipo: "info",
    titulo: "Nuevo usuario registrado",
    mensaje: `${nuevo.nombres} ${nuevo.apellidos} pidió la unidad ${nuevo.unidadSolicitada}`,
    enlace: "/panel/usuarios",
  });

  return {
    exito: true,
    sesion: { correo: nuevo.correo, nombres: nuevo.nombres, apellidos: nuevo.apellidos, rol: nuevo.rol },
  };
}

// ---------- Cambiar contraseña (HU-42) ----------
export function cambiarContrasena(
  correo: string,
  actual: string,
  nueva: string
): { exito: boolean; mensaje?: string } {
  const usuario = obtenerUsuarioPorCorreo(correo);

  if (!usuario) {
    return { exito: false, mensaje: "Usuario no encontrado" };
  }
  if (contrasenas[usuario.id] !== actual) {
    return { exito: false, mensaje: "La contraseña actual es incorrecta" };
  }

  contrasenas = { ...contrasenas, [usuario.id]: nueva };
  return { exito: true };
}