// Cliente HTTP único para hablar con el backend FastAPI.
// Todos los módulos llaman a apiFetch en vez de usar fetch directamente.

// Dirección del backend (viene de .env.local; en Vercel se configura en su panel)
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// Dónde guardamos la "pulsera" (token JWT) en el navegador
export const CLAVE_TOKEN = "urbanix_token";

// El backend responde los errores 422 así: { detail: "...", errores: [{ campo, mensaje }] }
export interface ErrorCampo {
  campo: string;
  mensaje: string;
}

// Error propio: lleva el código HTTP y los errores por campo
export class ApiError extends Error {
  status: number;
  errores: ErrorCampo[];

  constructor(status: number, mensaje: string, errores: ErrorCampo[] = []) {
    super(mensaje);
    this.status = status;
    this.errores = errores;
  }
}

interface Opciones {
  metodo?: string;
  cuerpo?: unknown;
}

export async function apiFetch<T>(ruta: string, opciones: Opciones = {}): Promise<T> {
  // Si hay sesión, adjuntamos la pulsera en cada petición
  const token = typeof window !== "undefined" ? localStorage.getItem(CLAVE_TOKEN) : null;

  let respuesta: Response;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      method: opciones.metodo ?? "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: opciones.cuerpo !== undefined ? JSON.stringify(opciones.cuerpo) : undefined,
    });
  } catch {
    // fetch solo falla así cuando NO hubo respuesta: servidor apagado, sin internet o bloqueo CORS
    throw new ApiError(0, "No se pudo conectar con el servidor. Intenta de nuevo en unos minutos.");
  }

  // Leemos el JSON; si la respuesta viene vacía, queda null
  const datos = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    const mensaje = typeof datos?.detail === "string" ? datos.detail : "Ocurrió un error inesperado";
    throw new ApiError(respuesta.status, mensaje, Array.isArray(datos?.errores) ? datos.errores : []);
  }
  return datos as T;
}

// Convierte los errores 422 al formato de tus formularios: { nombreDelInput: mensaje }
// "equivalencias" traduce nombres distintos (backend "password" -> input "contrasena")
export function erroresDeFormulario(
  error: ApiError,
  equivalencias: Record<string, string> = {},
): Record<string, string> {
  const resultado: Record<string, string> = {};
  for (const e of error.errores) {
    resultado[equivalencias[e.campo] ?? e.campo] = e.mensaje;
  }
  return resultado;
}