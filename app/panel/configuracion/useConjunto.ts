"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { obtenerConfigConjunto, guardarConfigConjunto, LIMITES_RECORDATORIO } from "@/lib/configuracionStore";

interface ErroresConjunto {
  [campo: string]: string;
}

export function useConjunto() {
  const { usuario } = useAuth();
  const inicial = obtenerConfigConjunto();

  const [nombre, setNombre] = useState(inicial.nombre);
  const [direccion, setDireccion] = useState(inicial.direccion);
  const [ciudad, setCiudad] = useState(inicial.ciudad);
  const [telefonoPorteria, setTelefonoPorteria] = useState(inicial.telefonoPorteria);
  const [correoContacto, setCorreoContacto] = useState(inicial.correoContacto);
  const [diasRecordatorio, setDiasRecordatorio] = useState(String(inicial.diasRecordatorio));
  const [errores, setErrores] = useState<ErroresConjunto>({});
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();
    setGuardado(false);

    const dias = Number(diasRecordatorio);
    const nuevosErrores: ErroresConjunto = {};
    if (nombre.trim() === "") nuevosErrores.nombre = "El nombre del conjunto es obligatorio";
    if (direccion.trim() === "") nuevosErrores.direccion = "La dirección es obligatoria";
    if (correoContacto.trim() !== "" && !correoContacto.includes("@")) nuevosErrores.correoContacto = "Ingresa un correo válido";
    if (!Number.isInteger(dias) || dias < LIMITES_RECORDATORIO.minimo || dias > LIMITES_RECORDATORIO.maximo) {
      nuevosErrores.diasRecordatorio = `Ingresa un número entero entre ${LIMITES_RECORDATORIO.minimo} y ${LIMITES_RECORDATORIO.maximo}`;
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setGuardando(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setGuardando(false);

    guardarConfigConjunto({
      nombre: nombre.trim(),
      direccion: direccion.trim(),
      ciudad: ciudad.trim(),
      telefonoPorteria: telefonoPorteria.trim(),
      correoContacto: correoContacto.trim(),
      diasRecordatorio: dias,
    });

    setErrores({});
    setGuardado(true);
  }

  return {
    esAdministrador: usuario?.rol === "administrador",
    nombre, setNombre,
    direccion, setDireccion,
    ciudad, setCiudad,
    telefonoPorteria, setTelefonoPorteria,
    correoContacto, setCorreoContacto,
    diasRecordatorio, setDiasRecordatorio,
    errores,
    guardando,
    guardado,
    handleSubmit,
  };
}