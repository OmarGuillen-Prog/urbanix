"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { cambiarContrasena } from "@/lib/credencialesStore";

interface ErroresContrasena {
  [campo: string]: string;
}

export function useCambiarContrasena() {
  const { usuario } = useAuth();

  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [errores, setErrores] = useState<ErroresContrasena>({});
  const [guardando, setGuardando] = useState(false);
  const [exito, setExito] = useState(false);

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();
    setExito(false);

    const nuevosErrores: ErroresContrasena = {};
    if (actual.trim() === "") nuevosErrores.actual = "Ingresa tu contraseña actual";
    if (nueva.length < 8) nuevosErrores.nueva = "Debe tener mínimo 8 caracteres";
    if (confirmar !== nueva) nuevosErrores.confirmar = "Las contraseñas no coinciden";

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    if (!usuario) return;

    setGuardando(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setGuardando(false);

    const resultado = cambiarContrasena(usuario.correo, actual, nueva);

    if (!resultado.exito) {
      // RF-08/criterio HU-42: contraseña actual incorrecta -> error
      setErrores({ actual: resultado.mensaje ?? "No se pudo cambiar la contraseña" });
      return;
    }

    setErrores({});
    setActual("");
    setNueva("");
    setConfirmar("");
    setExito(true);
  }

  return { actual, setActual, nueva, setNueva, confirmar, setConfirmar, errores, guardando, exito, handleSubmit };
}