// Llamadas de autenticación al backend + traducción de sus respuestas al formato del frontend.

import { apiFetch, ApiError } from "@/lib/api";
import type { Rol, UsuarioSesion } from "@/context/AuthContext";

// Así responde el backend (esquema UsuarioSalida / TokenSalida)
interface UsuarioApi {
  id_usuario: number;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string | null;
  documento: string;
  foto_url: string | null;
  estado: string;
  fecha_registro: string;
  rol: { id_rol: number; nombre_rol: string };
}

interface TokenApi {
  access_token: string;
  token_type: string;
  usuario: UsuarioApi;
}

// "Administrador" (backend) -> "administrador" (tu tipo Rol)
function aRol(nombreRol: string): Rol {
  const rol = nombreRol.toLowerCase();
  if (rol === "administrador" || rol === "residente" || rol === "portero") return rol;
  throw new Error(`Rol desconocido recibido del servidor: ${nombreRol}`);
}

function aSesion(usuario: UsuarioApi): UsuarioSesion {
  return {
    nombres: usuario.nombres,
    apellidos: usuario.apellidos,
    correo: usuario.correo,
    rol: aRol(usuario.rol.nombre_rol),
  };
}

export async function iniciarSesionApi(correo: string, contrasena: string) {
  const respuesta = await apiFetch<TokenApi>("/auth/login", {
    metodo: "POST",
    cuerpo: { correo: correo.trim(), password: contrasena },
  });
  return { token: respuesta.access_token, sesion: aSesion(respuesta.usuario) };
}

export interface DatosRegistro {
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  documento: string;
  contrasena: string;
  aceptoPolitica: boolean;
}

export async function registrarCuentaApi(datos: DatosRegistro) {
  await apiFetch<UsuarioApi>("/auth/registro", {
    metodo: "POST",
    cuerpo: {
      nombres: datos.nombres.trim(),
      apellidos: datos.apellidos.trim(),
      correo: datos.correo.trim(),
      telefono: datos.telefono.trim() || null,
      documento: datos.documento.trim(),
      password: datos.contrasena,
      acepto_politica_datos: datos.aceptoPolitica,
    },
  });
}

// ¿El servidor sigue reconociendo esta sesión? (el "portero real" revisando tu credencial)
// GET /auth/yo responde 401 si el token está vencido, es falso, o el usuario fue desactivado/eliminado.
export async function sesionApiSigueValida(): Promise<boolean> {
  try {
    await apiFetch<unknown>("/auth/yo"); // no nos importa el contenido, solo si el servidor dice OK
    return true;
  } catch (error) {
    // SOLO un 401 significa "tu sesión ya no vale"
    if (error instanceof ApiError && error.status === 401) return false;

    // Cualquier otro fallo (servidor apagado, red caída) NO es culpa de la sesión:
    // no sacamos a la persona del panel por eso.
    return true;
  }
}