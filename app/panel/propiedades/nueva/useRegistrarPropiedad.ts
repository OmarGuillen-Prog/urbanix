"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { crearPropiedad } from "@/lib/propiedadesStore";

interface ErroresPropiedad {
  [campo: string]: string;
}

export function useRegistrarPropiedad() {
  const router = useRouter();

  const [numero, setNumero] = useState("");
  const [torre, setTorre] = useState("");
  const [tipo, setTipo] = useState<"apartamento" | "casa" | "local">("apartamento");
  const [area, setArea] = useState("");
  const [errores, setErrores] = useState<ErroresPropiedad>({});
  const [guardando, setGuardando] = useState(false);

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();

    // RF-18: validar datos obligatorios al registrar propiedades
    const nuevosErrores: ErroresPropiedad = {};
    if (numero.trim() === "") nuevosErrores.numero = "El número es obligatorio";
    if (torre.trim() === "") nuevosErrores.torre = "La torre/bloque es obligatoria";
    if (area.trim() === "" || Number(area) <= 0) {
      nuevosErrores.area = "Ingresa un área válida (mayor a 0)";
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setGuardando(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setGuardando(false);

    // Toda propiedad nueva nace "vacia" y sin propietario/arrendatario
    // asignado - eso se hace despues, desde la pantalla de edicion
    // (HU-13/HU-14), no en el momento de crearla.
    crearPropiedad({
      numero,
      torre,
      tipo,
      area: Number(area),
      estadoOcupacion: "vacio",
      idPropietario: null,
      idArrendatario: null,
    });

    router.push("/panel/propiedades");
  }

  return { numero, setNumero, torre, setTorre, tipo, setTipo, area, setArea, errores, guardando, handleSubmit };
}