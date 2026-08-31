// app/restablecer/useRestablecerForm.ts
"use client";

import { useState } from "react";
import { validarToken } from "@/lib/passwordResetStore";

interface ErroresRestablecer {
  [campo: string]: string;
}

export function useRestablecerForm(token: string) {
  // Ya NO es useState + useEffect. Es un calculo directo, que se
  // vuelve a ejecutar automaticamente cada vez que el componente
  // se re-renderiza (y si "token" no cambia, siempre da el mismo
  // resultado - no hay riesgo de quedar "desactualizado").
  const tokenValido = validarToken(token);

  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [errores, setErrores] = useState<ErroresRestablecer>({});
  const [enviando, setEnviando] = useState(false);
  const [completado, setCompletado] = useState(false);

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();

    const nuevosErrores: ErroresRestablecer = {};
    if (nuevaContrasena.length < 8) {
      nuevosErrores.nuevaContrasena = "Debe tener mínimo 8 caracteres";
    }
    if (confirmarContrasena !== nuevaContrasena) {
      nuevosErrores.confirmarContrasena = "Las contraseñas no coinciden";
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setErrores({});
    setEnviando(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setEnviando(false);

    console.log("Contraseña actualizada (simulado) para el token:", token);
    setCompletado(true);
  }

  return {
    tokenValido,
    nuevaContrasena,
    setNuevaContrasena,
    confirmarContrasena,
    setConfirmarContrasena,
    errores,
    enviando,
    completado,
    handleSubmit,
  };
}