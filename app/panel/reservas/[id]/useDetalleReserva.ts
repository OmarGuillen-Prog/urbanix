"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { obtenerReservaPorId, confirmarReserva, cancelarReserva, type Reserva } from "@/lib/reservasStore";

export function useDetalleReserva(id: string) {
  const { usuario } = useAuth();
  const [reserva, setReserva] = useState<Reserva | undefined>(() => obtenerReservaPorId(id));

  const esAdministrador = usuario?.rol === "administrador";
  // Un residente solo ve SUS reservas (cosmetico: la seguridad real vive en el backend)
  const tieneAcceso = esAdministrador || reserva?.correoResidente === usuario?.correo;

  // Transicion de estado: pendiente -> confirmada (solo administrador)
  function handleConfirmar() {
    if (!reserva) return;
    confirmarReserva(reserva.id);
    setReserva(obtenerReservaPorId(id));
  }

  // Transicion de estado: pendiente/confirmada -> cancelada
  function handleCancelar() {
    if (!reserva) return;
    const confirmado = window.confirm(
      "¿Seguro que quieres cancelar esta reserva? El horario quedará libre para otros residentes."
    );
    if (!confirmado) return;

    cancelarReserva(reserva.id);
    setReserva(obtenerReservaPorId(id));
  }

  return { reserva, tieneAcceso, esAdministrador, handleConfirmar, handleCancelar };
}