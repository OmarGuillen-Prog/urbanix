"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { obtenerZonas } from "@/lib/reservasStore";
import { obtenerEvaluaciones, crearEvaluacion, promedioDeZona, type EvaluacionZona } from "@/lib/evaluacionesStore";

interface ErroresEvaluacion {
  [campo: string]: string;
}

export function useEvaluacionesZonas() {
  const { usuario } = useAuth();
  const zonas = obtenerZonas();

  const [evaluaciones, setEvaluaciones] = useState<EvaluacionZona[]>(() => obtenerEvaluaciones());
  const [idZona, setIdZona] = useState(zonas[0]?.id ?? "");
  const [calificacion, setCalificacion] = useState(5);
  const [comentario, setComentario] = useState("");
  const [errores, setErrores] = useState<ErroresEvaluacion>({});
  const [guardando, setGuardando] = useState(false);

  function nombreZona(id: string): string {
    return zonas.find((z) => z.id === id)?.nombre ?? "Zona desconocida";
  }

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();

    if (comentario.trim() === "") {
      setErrores({ comentario: "Cuéntanos brevemente tu experiencia" });
      return;
    }

    if (!usuario) return;

    setGuardando(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setGuardando(false);

    crearEvaluacion({ idZona, calificacion, comentario, correoResidente: usuario.correo });
    setEvaluaciones(obtenerEvaluaciones());
    setComentario("");
    setCalificacion(5);
    setErrores({});
  }

  return {
    zonas,
    evaluaciones,
    nombreZona,
    idZona, setIdZona,
    calificacion, setCalificacion,
    comentario, setComentario,
    errores,
    guardando,
    handleSubmit,
  };
}