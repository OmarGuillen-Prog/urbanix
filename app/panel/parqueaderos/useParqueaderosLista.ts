"use client";

import { useState } from "react";
import {
  obtenerParqueaderos,
  asignarParqueadero,
  liberarParqueadero,
  type Parqueadero,
} from "@/lib/parqueaderosStore";
import { obtenerPropiedades } from "@/lib/propiedadesStore";

export function useParqueaderosLista() {
  const [parqueaderos, setParqueaderos] = useState<Parqueadero[]>(() => obtenerParqueaderos());
  const [error, setError] = useState<string | null>(null);
  const propiedades = obtenerPropiedades();

  function handleAsignar(idParqueadero: string, idPropiedad: string) {
    if (idPropiedad === "") {
      liberarParqueadero(idParqueadero);
      setParqueaderos(obtenerParqueaderos());
      setError(null);
      return;
    }

    const resultado = asignarParqueadero(idParqueadero, idPropiedad);

    if (!resultado.exito) {
      setError(resultado.mensaje ?? "No se pudo asignar el parqueadero");
      return;
    }

    setError(null);
    setParqueaderos(obtenerParqueaderos());
  }

  return { parqueaderos, propiedades, handleAsignar, error };
}