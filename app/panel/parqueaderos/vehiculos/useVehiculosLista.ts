"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { obtenerVehiculos, type Vehiculo } from "@/lib/vehiculosStore";
import { obtenerParqueaderos } from "@/lib/parqueaderosStore";

export function useVehiculosLista() {
  const { usuario } = useAuth();
  const [vehiculos] = useState<Vehiculo[]>(() => obtenerVehiculos());

  // Lee el espacio ACTUAL desde el store de parqueaderos: si alguien lo libera
  // alla, el vehiculo ya aparece "Sin parqueadero" aca (gracias a la fuente unica).
  function etiquetaParqueadero(idParqueadero: string | null): string | null {
    if (!idParqueadero) return null;
    const parqueadero = obtenerParqueaderos().find((p) => p.id === idParqueadero);
    return parqueadero ? `${parqueadero.numero} · Nivel ${parqueadero.nivel}` : null;
  }

  return {
    esAdministrador: usuario?.rol === "administrador",
    vehiculos,
    etiquetaParqueadero,
  };
}