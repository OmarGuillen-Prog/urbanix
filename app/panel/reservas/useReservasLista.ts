"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { obtenerReservasPorUsuario, obtenerZonas, cancelarReserva, type Reserva } from "@/lib/reservasStore";

export function useReservasLista() {
  const { usuario } = useAuth();
  const zonas = obtenerZonas();

  const [reservas, setReservas] = useState<Reserva[]>(() =>
    usuario ? obtenerReservasPorUsuario(usuario.correo) : []
  );

  function refrescar() {
    if (usuario) setReservas(obtenerReservasPorUsuario(usuario.correo));
  }

  function nombreZona(idZona: string): string {
    return zonas.find((z) => z.id === idZona)?.nombre ?? "Zona desconocida";
  }

  function handleCancelar(id: string) {
    const confirmado = window.confirm("¿Seguro que quieres cancelar esta reserva?");
    if (!confirmado) return;

    cancelarReserva(id);
    refrescar();
  }

  return { reservas, nombreZona, handleCancelar, refrescar };
}