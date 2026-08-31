"use client";

import { useState } from "react";
import { generarTokenRecuperacion } from "@/lib/passwordResetStore";

interface ErroresRecuperar {
  [campo: string]: string;
}

// Simula el "envio de correo": genera el token y espera, como si
// realmente estuviera viajando por internet a un servicio de email.
function simularEnvioCorreo(correo: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const token = generarTokenRecuperacion(correo);
      resolve(token);
    }, 500);
  });
}

export function useRecuperarForm() {
  const [correo, setCorreo] = useState("");
  const [errores, setErrores] = useState<ErroresRecuperar>({});
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [enlaceSimulado, setEnlaceSimulado] = useState("");

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();

    if (correo.trim() === "") {
      setErrores({ correo: "El correo es obligatorio" });
      return;
    }

    setErrores({});
    setEnviando(true);
    const token = await simularEnvioCorreo(correo);
    setEnviando(false);

    // En produccion, esto NO se mostraria en pantalla - viajaria
    // dentro de un correo real. Lo exponemos aqui solo para poder
    // probar el flujo completo sin backend.
    setEnlaceSimulado(`/restablecer?token=${token}`);
    setEnviado(true);
  }

  return {
    correo,
    setCorreo,
    errores,
    enviando,
    enviado,
    enlaceSimulado,
    handleSubmit,
  };
}