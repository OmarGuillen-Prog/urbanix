// lib/useNotificaciones.ts
"use client";

import { useSyncExternalStore } from "react";
import { suscribir, obtenerVersion } from "./notificacionesStore";

// Usar este hook en un componente lo SUSCRIBE al store de notificaciones:
// cada vez que el store cambia, React vuelve a dibujar el componente.
// (Los datos se leen del store; el hook solo "avisa" que hubo un cambio.)
export function useVersionNotificaciones(): number {
  return useSyncExternalStore(suscribir, obtenerVersion, () => 0);
}