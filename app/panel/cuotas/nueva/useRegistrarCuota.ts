"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { obtenerPropiedades } from "@/lib/propiedadesStore";
import { crearCuota, existeCuota } from "@/lib/cuotasStore";

interface ErroresCuota {
  [campo: string]: string;
}

export function useRegistrarCuota() {
  const router = useRouter();
  const { usuario } = useAuth();
  const propiedades = obtenerPropiedades();

  const [idPropiedad, setIdPropiedad] = useState(propiedades[0]?.id ?? "");
  const [valor, setValor] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaLimite, setFechaLimite] = useState("");
  const [errores, setErrores] = useState<ErroresCuota>({});
  const [guardando, setGuardando] = useState(false);

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();

    const nuevosErrores: ErroresCuota = {};
    if (valor.trim() === "" || Number(valor) <= 0) nuevosErrores.valor = "Ingresa un valor válido";
    if (descripcion.trim() === "") nuevosErrores.descripcion = "El concepto es obligatorio";
    else if (existeCuota(idPropiedad, descripcion)) {
      // Regla de negocio: no se factura dos veces el mismo concepto a la misma propiedad
      nuevosErrores.descripcion = "Esta propiedad ya tiene una cuota con ese concepto";
    }
    if (fechaLimite === "") nuevosErrores.fechaLimite = "La fecha límite es obligatoria";

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setGuardando(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setGuardando(false);

    crearCuota({ idPropiedad, valor: Number(valor), descripcion: descripcion.trim(), fechaLimite });
    router.push("/panel/cuotas");
  }

  return {
    esAdministrador: usuario?.rol === "administrador",
    propiedades,
    idPropiedad, setIdPropiedad,
    valor, setValor,
    descripcion, setDescripcion,
    fechaLimite, setFechaLimite,
    errores,
    guardando,
    handleSubmit,
  };
}