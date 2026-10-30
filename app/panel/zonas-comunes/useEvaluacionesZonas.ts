"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { obtenerZonas } from "@/lib/reservasStore";
import { obtenerEvaluaciones, crearEvaluacion, type EvaluacionZona } from "@/lib/evaluacionesStore";

const MAX_COMENTARIOS_VISIBLES = 6;

export function useEvaluacionesZonas() {
  const { usuario } = useAuth();
  // HU-46: "Como residente, quiero evaluar..." -> solo el residente califica
  const esResidente = usuario?.rol === "residente";
  const zonas = obtenerZonas();

  const [evaluaciones, setEvaluaciones] = useState<EvaluacionZona[]>(() => obtenerEvaluaciones());
  const [filtroZona, setFiltroZona] = useState("todas");

  // Formulario de evaluacion
  const [idZona, setIdZona] = useState(zonas[0]?.id ?? "");
  const [calificacion, setCalificacion] = useState(5);
  const [comentario, setComentario] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  // Promedio y cantidad de una zona, calculados desde el ESTADO (siempre al dia)
  function resumenDeZona(id: string): { promedio: number | null; total: number } {
    const deLaZona = evaluaciones.filter((e) => e.idZona === id);
    if (deLaZona.length === 0) return { promedio: null, total: 0 };

    const suma = deLaZona.reduce((acumulado, e) => acumulado + e.calificacion, 0);
    return { promedio: suma / deLaZona.length, total: deLaZona.length };
  }

  // --- Metricas para las tarjetas de resumen ---
  const totalEvaluaciones = evaluaciones.length;
  const promedioGeneral =
    totalEvaluaciones === 0
      ? null
      : evaluaciones.reduce((acumulado, e) => acumulado + e.calificacion, 0) / totalEvaluaciones;

  const zonasCalificadas = zonas
    .map((z) => ({ nombre: z.nombre, ...resumenDeZona(z.id) }))
    .filter((z) => z.promedio !== null);
  const mejorZona =
    zonasCalificadas.length === 0
      ? null
      : zonasCalificadas.reduce((mejor, actual) => ((actual.promedio ?? 0) > (mejor.promedio ?? 0) ? actual : mejor));

  // --- Comentarios: filtrados por zona, el mas reciente primero ---
  const filtrados = useMemo(
    () =>
      [...evaluaciones]
        .filter((e) => filtroZona === "todas" || e.idZona === filtroZona)
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()),
    [evaluaciones, filtroZona]
  );
  const comentarios = filtrados.slice(0, MAX_COMENTARIOS_VISIBLES);

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();
    setEnviado(false);

    if (comentario.trim() === "") {
      setError("Cuéntanos brevemente tu experiencia");
      return;
    }
    if (!usuario) return;

    setError(null);
    setGuardando(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setGuardando(false);

    crearEvaluacion({ idZona, calificacion, comentario: comentario.trim(), correoResidente: usuario.correo });
    setEvaluaciones(obtenerEvaluaciones());
    setComentario("");
    setCalificacion(5);
    setEnviado(true);
  }

  return {
    esResidente,
    zonas,
    resumenDeZona,
    totalEvaluaciones,
    promedioGeneral,
    mejorZona,
    comentarios,
    totalComentarios: filtrados.length,
    filtroZona, setFiltroZona,
    idZona, setIdZona,
    calificacion, setCalificacion,
    comentario, setComentario,
    error,
    guardando,
    enviado,
    handleSubmit,
  };
}