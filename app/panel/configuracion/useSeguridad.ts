"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { obtenerPreferencias, guardarPreferencias } from "@/lib/configuracionStore";

export function useSeguridad() {
  const { usuario } = useAuth();
  const correo = usuario?.correo ?? "";

  const [minutosInactividad, setMinutosInactividad] = useState(() => obtenerPreferencias(correo).minutosInactividad);

  // RNF-05: el vigilante del panel lee este valor la proxima vez que detecte actividad
  function handleCambiarMinutos(minutos: number) {
    guardarPreferencias(correo, { minutosInactividad: minutos });
    setMinutosInactividad(obtenerPreferencias(correo).minutosInactividad);
  }

  return { minutosInactividad, handleCambiarMinutos };
}