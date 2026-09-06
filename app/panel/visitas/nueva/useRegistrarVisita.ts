"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { crearVisita } from "@/lib/visitasStore";

interface ErroresVisita {
  [campo: string]: string;
}

export function useRegistrarVisita() {
  const router = useRouter();
  const { usuario } = useAuth();

  const [nombreVisitante, setNombreVisitante] = useState("");
  const [documentoVisitante, setDocumentoVisitante] = useState("");
  const [fechaVisita, setFechaVisita] = useState("");
  const [errores, setErrores] = useState<ErroresVisita>({});
  const [guardando, setGuardando] = useState(false);

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();

    // RF-45 y criterio de HU-27: validar datos del visitante
    const nuevosErrores: ErroresVisita = {};
    if (nombreVisitante.trim() === "") nuevosErrores.nombreVisitante = "El nombre es obligatorio";
    if (documentoVisitante.trim() === "") nuevosErrores.documentoVisitante = "El documento es obligatorio";
    if (fechaVisita === "") nuevosErrores.fechaVisita = "La fecha es obligatoria";

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    if (!usuario) return;

    setGuardando(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setGuardando(false);

    crearVisita({ nombreVisitante, documentoVisitante, fechaVisita, correoResidente: usuario.correo });
    router.push("/panel/visitas");
  }

  return {
    nombreVisitante, setNombreVisitante,
    documentoVisitante, setDocumentoVisitante,
    fechaVisita, setFechaVisita,
    errores,
    guardando,
    handleSubmit,
  };
}