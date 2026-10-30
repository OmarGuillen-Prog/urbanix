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
  const [habitaciones, setHabitaciones] = useState("");
  const [banos, setBanos] = useState("");
  const [errores, setErrores] = useState<ErroresPropiedad>({});
  const [guardando, setGuardando] = useState(false);

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();

    const nuevosErrores: ErroresPropiedad = {};
    if (numero.trim() === "") nuevosErrores.numero = "El número es obligatorio";
    if (torre.trim() === "") nuevosErrores.torre = "La torre/bloque es obligatoria";
    if (area.trim() === "" || Number(area) <= 0) nuevosErrores.area = "Ingresa un área válida (mayor a 0)";
    if (habitaciones.trim() === "" || Number(habitaciones) < 0) nuevosErrores.habitaciones = "Ingresa un número válido";
    if (banos.trim() === "" || Number(banos) < 0) nuevosErrores.banos = "Ingresa un número válido";

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setGuardando(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setGuardando(false);

    crearPropiedad({
      numero,
      torre,
      tipo,
      area: Number(area),
      habitaciones: Number(habitaciones),
      banos: Number(banos),
      estadoOcupacion: "vacio",
      idPropietario: null,
      idArrendatario: null,
    });

    router.push("/panel/propiedades");
  }

  return {
    numero, setNumero,
    torre, setTorre,
    tipo, setTipo,
    area, setArea,
    habitaciones, setHabitaciones,
    banos, setBanos,
    errores,
    guardando,
    handleSubmit,
  };
}