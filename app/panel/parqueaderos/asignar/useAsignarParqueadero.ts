"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  obtenerParqueaderos,
  estadoDeParqueadero,
  asignarParqueadero,
  cantidadAsignadaAPropiedad,
  MAX_PARQUEADEROS_POR_PROPIEDAD,
} from "@/lib/parqueaderosStore";
import { obtenerPropiedades } from "@/lib/propiedadesStore";

export function useAsignarParqueadero() {
  const router = useRouter();
  const { usuario } = useAuth();

  // Solo ofrecemos espacios realmente DISPONIBLES (ni ocupados ni reservados):
  // prevenir el error de raiz, como en el formulario de vehiculos
  const disponibles = obtenerParqueaderos().filter((p) => estadoDeParqueadero(p) === "disponible");
  const propiedades = obtenerPropiedades();

  const [idParqueadero, setIdParqueadero] = useState(disponibles[0]?.id ?? "");
  const [idPropiedad, setIdPropiedad] = useState(propiedades[0]?.id ?? "");
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  const usados = idPropiedad ? cantidadAsignadaAPropiedad(idPropiedad) : 0;

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();

    if (idParqueadero === "" || idPropiedad === "") {
      setError("Selecciona un espacio y una propiedad.");
      return;
    }

    setGuardando(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setGuardando(false);

    // El store aplica TODAS las reglas (incluido el cupo maximo por propiedad)
    const resultado = asignarParqueadero(idParqueadero, idPropiedad);

    if (!resultado.exito) {
      setError(resultado.mensaje ?? "No se pudo asignar el espacio.");
      return;
    }

    router.push("/panel/parqueaderos");
  }

  return {
    esAdministrador: usuario?.rol === "administrador",
    disponibles,
    propiedades,
    idParqueadero, setIdParqueadero,
    idPropiedad, setIdPropiedad,
    usados,
    maximo: MAX_PARQUEADEROS_POR_PROPIEDAD,
    error,
    guardando,
    handleSubmit,
  };
}