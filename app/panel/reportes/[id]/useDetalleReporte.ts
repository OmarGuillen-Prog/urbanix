"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  obtenerReportePorId,
  actualizarReporte,
  type ReporteDano,
  type EstadoReporte,
  type PrioridadReporte,
} from "@/lib/reportesStore";

export function useDetalleReporte(id: string) {
  const { usuario } = useAuth();

  const [reporte, setReporte] = useState<ReporteDano | undefined>(() => obtenerReportePorId(id));
  const [estado, setEstado] = useState<EstadoReporte>(reporte?.estado ?? "pendiente");
  const [prioridad, setPrioridad] = useState<PrioridadReporte>(reporte?.prioridad ?? "media");
  const [comentario, setComentario] = useState(reporte?.comentarioAdmin ?? "");
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);

  const esAdministrador = usuario?.rol === "administrador";
  // Un residente solo ve SUS reportes (cosmetico: la seguridad real vive en el backend)
  const tieneAcceso = esAdministrador || reporte?.correoCreador === usuario?.correo;

  async function handleGuardar(evento: React.FormEvent) {
    evento.preventDefault();
    if (!reporte) return;

    setGuardado(false);

    // Regla de negocio: un reporte no se cierra sin explicar que se hizo
    if (estado === "resuelto" && comentario.trim() === "") {
      setError("Escribe un comentario de cierre antes de marcar el reporte como resuelto.");
      return;
    }
    setError(null);

    setGuardando(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setGuardando(false);

    actualizarReporte(reporte.id, { estado, prioridad, comentarioAdmin: comentario });
    setReporte(obtenerReportePorId(id));
    setGuardado(true);
  }

  return {
    reporte,
    tieneAcceso,
    esAdministrador,
    estado, setEstado,
    prioridad, setPrioridad,
    comentario, setComentario,
    error,
    guardando,
    guardado,
    handleGuardar,
  };
}