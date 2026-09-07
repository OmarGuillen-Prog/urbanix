"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { obtenerNomina, crearRegistroNomina, marcarNominaComoPagada, type RegistroNomina } from "@/lib/nominaStore";

interface ErroresNomina {
  [campo: string]: string;
}

export function useNominaForm() {
  const { usuario } = useAuth();

  const [registros, setRegistros] = useState<RegistroNomina[]>(() => obtenerNomina());
  const [nombreEmpleado, setNombreEmpleado] = useState("");
  const [cargo, setCargo] = useState("");
  const [salario, setSalario] = useState("");
  const [fechaPago, setFechaPago] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [errores, setErrores] = useState<ErroresNomina>({});
  const [guardando, setGuardando] = useState(false);

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();

    // RF-70/71: registrar informacion de pago de nomina
    const nuevosErrores: ErroresNomina = {};
    if (nombreEmpleado.trim() === "") nuevosErrores.nombreEmpleado = "El nombre es obligatorio";
    if (cargo.trim() === "") nuevosErrores.cargo = "El cargo es obligatorio";
    if (salario.trim() === "" || Number(salario) <= 0) nuevosErrores.salario = "Ingresa un salario válido";
    if (fechaPago === "") nuevosErrores.fechaPago = "La fecha de pago es obligatoria";

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    if (!usuario) return;

    setGuardando(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setGuardando(false);

    crearRegistroNomina({
      nombreEmpleado,
      cargo,
      salario: Number(salario),
      fechaPago,
      observaciones,
      estadoPago: "pendiente",
      correoAdministrador: usuario.correo,
    });

    setRegistros(obtenerNomina());
    setNombreEmpleado("");
    setCargo("");
    setSalario("");
    setFechaPago("");
    setObservaciones("");
    setErrores({});
  }

  function handleMarcarPagado(id: string) {
    marcarNominaComoPagada(id);
    setRegistros(obtenerNomina());
  }

  return {
    registros,
    nombreEmpleado, setNombreEmpleado,
    cargo, setCargo,
    salario, setSalario,
    fechaPago, setFechaPago,
    observaciones, setObservaciones,
    errores,
    guardando,
    handleSubmit,
    handleMarcarPagado,
  };
}