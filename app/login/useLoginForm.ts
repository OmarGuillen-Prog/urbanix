"use client";

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
      if (error instanceof ApiError && error.errores.length > 0) {
        // 422: el backend señala qué campo está mal (ej. formato de correo)
        setErrores(erroresDeFormulario(error, { password: "contrasena" }));
      } else {
        // 401 (credenciales), 403 (cuenta inactiva) o sin conexión: el backend ya manda el texto en español
        setErrores({ general: error instanceof ApiError ? error.message : "Ocurrió un error inesperado" });
      }
    } finally {
      setEnviando(false);
    }
  }

  return { correo, setCorreo, contrasena, setContrasena, errores, enviando, handleSubmit };
}