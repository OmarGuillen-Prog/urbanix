"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { crearReserva, obtenerZonas } from "@/lib/reservasStore";

interface ErroresReserva {
  [campo: string]: string;
}

export function useReservarForm(alReservarExito: () => void) {
  const { usuario } = useAuth();
  const zonas = obtenerZonas();

  const [idZona, setIdZona] = useState(zonas[0]?.id ?? "");
  const [fecha, setFecha] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [errores, setErrores] = useState<ErroresReserva>({});
  const [guardando, setGuardando] = useState(false);

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();

    const nuevosErrores: ErroresReserva = {};
    if (fecha === "") nuevosErrores.fecha = "La fecha es obligatoria";
    if (horaInicio === "") nuevosErrores.horaInicio = "La hora de inicio es obligatoria";
    if (horaFin === "") nuevosErrores.horaFin = "La hora de fin es obligatoria";
    // Validacion logica, no solo "esta vacio o no": el fin debe ser
    // realmente despues del inicio.
    if (horaInicio && horaFin && horaFin <= horaInicio) {
      nuevosErrores.horaFin = "La hora de fin debe ser posterior a la de inicio";
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    if (!usuario) return;

    setGuardando(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setGuardando(false);

    // Aqui es donde el resultado del store (exito o conflicto) decide
    // que le mostramos al usuario - a diferencia de formularios
    // anteriores donde el "guardar" siempre funcionaba si pasaba las
    // validaciones basicas.
    const resultado = crearReserva({ idZona, fecha, horaInicio, horaFin, correoResidente: usuario.correo });

    if (!resultado.exito) {
      setErrores({ general: resultado.mensaje ?? "No se pudo crear la reserva" });
      return;
    }

    setFecha("");
    setHoraInicio("");
    setHoraFin("");
    setErrores({});
    alReservarExito();
  }

  return {
    zonas,
    idZona, setIdZona,
    fecha, setFecha,
    horaInicio, setHoraInicio,
    horaFin, setHoraFin,
    errores,
    guardando,
    handleSubmit,
  };
}