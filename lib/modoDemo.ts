import { CLAVE_TOKEN } from "@/lib/api";
import { sesionApiSigueValida } from "@/lib/authApi";
import { sesionSigueSiendoValida } from "@/lib/credencialesStore";

// 🎭 El interruptor. Solo con el texto exacto "true" se enciende (si falta o dice otra cosa: apagado).
// OJO: las variables NEXT_PUBLIC_ se "congelan" al arrancar/compilar: si la cambias, reinicia npm run dev.
export const MODO_DEMO = process.env.NEXT_PUBLIC_MODO_DEMO === "true";

// ¿Esta sesión sigue valiendo? Hay dos tipos:
//  - sesión REAL: tiene token → el servidor decide (GET /auth/yo)
//  - sesión de DEMO (lista simulada): NO tiene token → decide la lista simulada, y solo si el modo demo está encendido
export async function sesionSigueValida(correo: string): Promise<boolean> {
  const esSesionReal = localStorage.getItem(CLAVE_TOKEN) !== null;
  if (esSesionReal || !MODO_DEMO) return sesionApiSigueValida();
  return sesionSigueSiendoValida(correo);
}