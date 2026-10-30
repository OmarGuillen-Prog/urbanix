"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { obtenerZonas, actualizarReglasZona } from "@/lib/reservasStore";

export function useReglasZonas() {
  const { usuario } = useAuth();

  const [zonas, setZonas] = useState(() => [...obtenerZonas()]);
  // Un solo estado dice CUAL zona se esta editando (null = ninguna).
  // Antes habia un cuadro de texto por zona siempre abierto.
  const [idEnEdicion, setIdEnEdicion] = useState<string | null>(null);
  const [borrador, setBorrador] = useState("");
  const [guardando, setGuardando] = useState(false);

  function iniciarEdicion(idZona: string, reglasActuales: string) {
    setIdEnEdicion(idZona);
    setBorrador(reglasActuales);
  }

  function cancelarEdicion() {
    setIdEnEdicion(null);
    setBorrador("");
  }

  async function guardarEdicion() {
    if (idEnEdicion === null) return;

    setGuardando(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setGuardando(false);

    actualizarReglasZona(idEnEdicion, borrador.trim());
    // Copia nueva del arreglo para que React note el cambio (la zona se edita dentro del store)
    setZonas([...obtenerZonas()]);
    cancelarEdicion();
  }

  return {
    zonas,
    esAdministrador: usuario?.rol === "administrador",
    idEnEdicion,
    borrador,
    setBorrador,
    guardando,
    iniciarEdicion,
    cancelarEdicion,
    guardarEdicion,
  };
}