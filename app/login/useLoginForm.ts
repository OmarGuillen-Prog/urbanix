"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ErroresLogin {
  [campo: string]: string;
}

// --- SIMULACION DE BACKEND ---
// "Base de datos" falsa de usuarios validos, mientras Juan Manuel
// construye el backend real con FastAPI. La estructura de esta
// funcion (async, devuelve una Promise) es la misma que tendra la
// llamada real a la API - solo cambiara lo que hay DENTRO de la funcion.
const usuariosValidos = [
  { correo: "omar@urbanix.com", contrasena: "12345678" },
  { correo: "juan@urbanix.com", contrasena: "12345678" },
];

function verificarCredenciales(
  correo: string,
  contrasena: string
): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const coincide = usuariosValidos.some(
        (usuario) =>
          usuario.correo === correo.toLowerCase().trim() &&
          usuario.contrasena === contrasena
      );
      resolve(coincide);
    }, 500);
  });
}
// --- FIN SIMULACION ---

export function useLoginForm() {
  const router = useRouter();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [errores, setErrores] = useState<ErroresLogin>({});
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();

    // Validacion basica: campos no vacios (RF-04, RF-05)
    const nuevosErrores: ErroresLogin = {};
    if (correo.trim() === "") {
      nuevosErrores.correo = "El correo es obligatorio";
    }
    if (contrasena.trim() === "") {
      nuevosErrores.contrasena = "La contraseña es obligatoria";
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setEnviando(true);
    const sonValidas = await verificarCredenciales(correo, contrasena);
    setEnviando(false);

    if (!sonValidas) {
      // Nota importante de seguridad: el mensaje NO dice cual de los
      // dos campos esta mal (¿correo o contraseña?). Si fueras mas
      // especifico, le darias pistas a alguien intentando adivinar
      // credenciales ajenas sobre cual dato acerto.
      setErrores({ general: "Correo o contraseña incorrectos" });
      return;
    }

    // Credenciales correctas: limpiamos errores y navegamos.
    setErrores({});
    router.push("/panel");
  }

  return {
    correo,
    setCorreo,
    contrasena,
    setContrasena,
    errores,
    enviando,
    handleSubmit,
  };
}