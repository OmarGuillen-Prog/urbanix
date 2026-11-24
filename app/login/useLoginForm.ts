"use client";

import { MODO_DEMO } from "@/lib/modoDemo";
import { verificarCredenciales } from "@/lib/credencialesStore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ApiError, erroresDeFormulario } from "@/lib/api";
import { iniciarSesionApi } from "@/lib/authApi";

interface ErroresLogin {
  [campo: string]: string;
}

export function useLoginForm() {
  const router = useRouter();
  const { iniciarSesion } = useAuth();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [errores, setErrores] = useState<ErroresLogin>({});
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();

    // Validación rápida en el navegador (el backend valida de nuevo: es la autoridad)
    const nuevosErrores: ErroresLogin = {};
    if (correo.trim() === "") nuevosErrores.correo = "El correo es obligatorio";
    if (contrasena.trim() === "") nuevosErrores.contrasena = "La contraseña es obligatoria";

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setEnviando(true);
    try {
      const { token, sesion } = await iniciarSesionApi(correo, contrasena);
      setErrores({});
      iniciarSesion(sesion, token);
      router.push("/panel");
    } catch (error) {
      // 🎭 MODO DEMO: si la API no te conoce (401) o no hay servidor (0), probamos la lista simulada.
      // El 403 (cuenta inactiva) NO entra aquí: esa respuesta es válida y se muestra tal cual.
      if (MODO_DEMO && error instanceof ApiError && (error.status === 401 || error.status === 0)) {
        const simulado = await verificarCredenciales(correo, contrasena);
        if (simulado.ok) {
          setErrores({});
          iniciarSesion(simulado.sesion, null); // null = sesión sin token
          router.push("/panel");
          return; // el "finally" de abajo igual apaga el "Verificando..."
        }
      }

      // (lo de siempre)
      if (error instanceof ApiError && error.errores.length > 0) {
        // 422: el backend señala qué campo está mal (ej. formato de correo)
        setErrores(erroresDeFormulario(error, { password: "contrasena" }));
      } else {
        // 401, 403 o sin conexión: el backend ya manda el texto en español
        setErrores({ general: error instanceof ApiError ? error.message : "Ocurrió un error inesperado" });
      }
    } finally {
      setEnviando(false);
    }
  }

  return { correo, setCorreo, contrasena, setContrasena, errores, enviando, handleSubmit };
}