"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { obtenerComunicados, eliminarComunicado, type Comunicado } from "@/lib/comunicadosStore";

export function useComunicadosLista() {
  const { usuario } = useAuth();
  const [comunicados, setComunicados] = useState<Comunicado[]>(() => obtenerComunicados());

  function handleEliminar(id: string, titulo: string) {
    const confirmado = window.confirm(`¿Eliminar el comunicado "${titulo}"?`);
    if (!confirmado) return;

    eliminarComunicado(id);
    setComunicados(obtenerComunicados());
  }

  return {
    comunicados,
    esAdministrador: usuario?.rol === "administrador",
    handleEliminar,
  };
}