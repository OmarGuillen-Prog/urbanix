"use client";

import { useState } from "react";
import { obtenerTodasLasCuotas, crearCuota, type Cuota } from "@/lib/cuotasStore";
import { obtenerPropiedades } from "@/lib/propiedadesStore";

interface ErroresCuota {
  [campo: string]: string;
}

export function useCuotasAdmin() {
  const propiedades = obtenerPropiedades();

  const [cuotas, setCuotas] = useState<Cuota[]>(() => obtenerTodasLasCuotas());
  const [idPropiedad, setIdPropiedad] = useState(propiedades[0]?.id ?? "");
  const [valor, setValor] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaLimite, setFechaLimite] = useState("");
  const [errores, setErrores] = useState<ErroresCuota>({});
  const [guardando, setGuardando] = useState(false);

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();

    const nuevosErrores: ErroresCuota = {};
    if (valor.trim() === "" || Number(valor) <= 0) nuevosErrores.valor = "Ingresa un valor válido";
    if (descripcion.trim() === "") nuevosErrores.descripcion = "La descripción es obligatoria";
    if (fechaLimite === "") nuevosErrores.fechaLimite = "La fecha límite es obligatoria";

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setGuardando(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setGuardando(false);

    crearCuota({ idPropiedad, valor: Number(valor), descripcion, fechaLimite });
    setCuotas(obtenerTodasLasCuotas());
    setValor("");
    setDescripcion("");
    setFechaLimite("");
    setErrores({});
  }

  return {
    propiedades,
    cuotas,
    idPropiedad, setIdPropiedad,
    valor, setValor,
    descripcion, setDescripcion,
    fechaLimite, setFechaLimite,
    errores,
    guardando,
    handleSubmit,
  };
}