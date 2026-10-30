"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { obtenerUsuarios } from "@/lib/usuariosStore";
import { crearVisita, type TipoVisita } from "@/lib/visitasStore";
import { hoyLocal } from "@/lib/fechas";

interface ErroresVisita {
  [campo: string]: string;
}

export function useRegistrarVisita() {
  const router = useRouter();
  const { usuario } = useAuth();
  const esResidente = usuario?.rol === "residente";

  // Portero y administrador registran "a nombre de" un residente anfitrion
  const residentes = obtenerUsuarios().filter((u) => u.rol === "residente" && u.estado === "activo");

  const [tipo, setTipo] = useState<TipoVisita>("visitante");
  const [nombreVisitante, setNombreVisitante] = useState("");
  const [documentoVisitante, setDocumentoVisitante] = useState("");
  const [fechaVisita, setFechaVisita] = useState(hoyLocal());
  const [horaEstimada, setHoraEstimada] = useState("");
  const [correoAnfitrion, setCorreoAnfitrion] = useState(residentes[0]?.correo ?? "");
  const [errores, setErrores] = useState<ErroresVisita>({});
  const [guardando, setGuardando] = useState(false);

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();

    const nuevosErrores: ErroresVisita = {};

    if (nombreVisitante.trim() === "") nuevosErrores.nombreVisitante = "El nombre es obligatorio";

    // Validacion CONDICIONAL: el documento solo es obligatorio para visitantes
    if (tipo === "visitante" && documentoVisitante.trim() === "") {
      nuevosErrores.documentoVisitante = "El documento es obligatorio para visitantes";
    }

    if (fechaVisita === "") nuevosErrores.fechaVisita = "La fecha es obligatoria";
    else if (fechaVisita < hoyLocal()) nuevosErrores.fechaVisita = "La fecha no puede ser anterior a hoy";

    if (horaEstimada === "") nuevosErrores.horaEstimada = "La hora estimada es obligatoria";

    if (!esResidente && correoAnfitrion === "") {
      nuevosErrores.correoAnfitrion = "Selecciona el residente anfitrión";
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    if (!usuario) return;

    setGuardando(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setGuardando(false);

    crearVisita({
      tipo,
      nombreVisitante,
      documentoVisitante,
      fechaVisita,
      horaEstimada,
      correoResidente: esResidente ? usuario.correo : correoAnfitrion,
    });
    router.push("/panel/visitas");
  }

  return {
    esResidente,
    residentes,
    tipo, setTipo,
    nombreVisitante, setNombreVisitante,
    documentoVisitante, setDocumentoVisitante,
    fechaVisita, setFechaVisita,
    horaEstimada, setHoraEstimada,
    correoAnfitrion, setCorreoAnfitrion,
    errores,
    guardando,
    handleSubmit,
  };
}