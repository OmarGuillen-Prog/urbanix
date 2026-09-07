"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { obtenerReportePorId, actualizarEstadoReporte, type ReporteDano } from "@/lib/reportesStore";

export function useDetalleReporte(id: string) {
  const { usuario } = useAuth();
  const [reporte, setReporte] = useState(() => obtenerReportePorId(id));
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<ReporteDano["estado"]>(
    reporte?.estado ?? "pendiente"
  );
  const [comentario, setComentario] = useState(reporte?.comentarioAdmin ?? "");
  const [guardando, setGuardando] = useState(false);

  const esAdministrador = usuario?.rol === "administrador";
  const tieneAcceso = esAdministrador || reporte?.correoCreador === usuario?.correo;

  async function handleActualizar(evento: React.FormEvent) {
    evento.preventDefault();
    if (!reporte) return;

    setGuardando(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setGuardando(false);

    actualizarEstadoReporte(reporte.id, estadoSeleccionado, comentario);
    setReporte(obtenerReportePorId(id));
  }

  return {
    reporte,
    tieneAcceso,
    esAdministrador,
    estadoSeleccionado,
    setEstadoSeleccionado,
    comentario,
    setComentario,
    guardando,
    handleActualizar,
  };
}