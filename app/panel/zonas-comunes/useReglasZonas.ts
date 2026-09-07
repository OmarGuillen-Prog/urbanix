"use client";

import { useState } from "react";
import { obtenerZonas, actualizarReglasZona } from "@/lib/reservasStore";

export function useReglasZonas() {
  const [zonas, setZonas] = useState(() => obtenerZonas());
  // Un borrador de texto por cada zona, mientras el administrador
  // edita - separado de los datos "guardados" en el store, para que
  // escribir no aplique el cambio letra por letra.
  const [borradores, setBorradores] = useState<Record<string, string>>(() =>
    Object.fromEntries(obtenerZonas().map((z) => [z.id, z.reglas]))
  );
  const [guardandoId, setGuardandoId] = useState<string | null>(null);

  function actualizarBorrador(idZona: string, texto: string) {
    setBorradores((anterior) => ({ ...anterior, [idZona]: texto }));
  }

  async function handleGuardar(idZona: string) {
    setGuardandoId(idZona);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setGuardandoId(null);

    actualizarReglasZona(idZona, borradores[idZona] ?? "");
    setZonas(obtenerZonas());
  }

  return { zonas, borradores, actualizarBorrador, guardandoId, handleGuardar };
}