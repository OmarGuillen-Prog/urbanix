"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { obtenerTodosLosReportes, obtenerReportesPorUsuario, type ReporteDano } from "@/lib/reportesStore";

export function useReportesLista() {
  const { usuario } = useAuth();

  const [reportes] = useState<ReporteDano[]>(() => {
    if (!usuario) return [];
    if (usuario.rol === "administrador") return obtenerTodosLosReportes();
    return obtenerReportesPorUsuario(usuario.correo);
  });

  return { reportes, esAdministrador: usuario?.rol === "administrador" };
}