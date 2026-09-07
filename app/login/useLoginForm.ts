"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { verificarCredenciales } from "@/lib/credencialesStore";

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

    const nuevosErrores: ErroresLogin = {};
    if (correo.trim() === "") nuevosErrores.correo = "El correo es obligatorio";
    if (contrasena.trim() === "") nuevosErrores.contrasena = "La contraseña es obligatoria";

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setEnviando(true);
    const sesion = await verificarCredenciales(correo, contrasena);
    setEnviando(false);

    if (!sesion) {
      setErrores({ general: "Correo o contraseña incorrectos" });
      return;
    }

    setErrores({});
    iniciarSesion(sesion);
    router.push("/panel");
  }

  return { correo, setCorreo, contrasena, setContrasena, errores, enviando, handleSubmit };
}