"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  crearRegistroNomina,
  existeRegistroNomina,
  liquidar,
  type Departamento,
  type TipoContrato,
} from "@/lib/nominaStore";

interface ErroresNomina {
  [campo: string]: string;
}

export function useRegistrarNomina() {
  const router = useRouter();
  const { usuario } = useAuth();

  const [nombreEmpleado, setNombreEmpleado] = useState("");
  const [cargo, setCargo] = useState("");
  const [departamento, setDepartamento] = useState<Departamento>("seguridad");
  const [tipoContrato, setTipoContrato] = useState<TipoContrato>("tiempo_completo");
  const [salario, setSalario] = useState("");
  const [fechaPago, setFechaPago] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [errores, setErrores] = useState<ErroresNomina>({});
  const [guardando, setGuardando] = useState(false);

  // Vista previa: es un dato DERIVADO de lo que se escribe, se calcula en cada render
  const salarioNumero = Number(salario);
  const vistaPrevia = salarioNumero > 0 ? liquidar({ salario: salarioNumero, tipoContrato }) : null;

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();

    // RF-70/71: registrar informacion de pago de nomina
    const nuevosErrores: ErroresNomina = {};
    if (nombreEmpleado.trim() === "") nuevosErrores.nombreEmpleado = "El nombre es obligatorio";
    if (cargo.trim() === "") nuevosErrores.cargo = "El cargo es obligatorio";
    if (salario.trim() === "" || salarioNumero <= 0) nuevosErrores.salario = "Ingresa un salario válido";
    if (fechaPago === "") nuevosErrores.fechaPago = "La fecha de pago es obligatoria";
    else if (nombreEmpleado.trim() !== "" && existeRegistroNomina(nombreEmpleado, fechaPago.slice(0, 7))) {
      // Regla de negocio: un empleado no se liquida dos veces en el mismo periodo
      nuevosErrores.fechaPago = "Este empleado ya tiene un pago registrado en ese mes";
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    if (!usuario) return;

    setGuardando(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setGuardando(false);

    crearRegistroNomina({
      nombreEmpleado: nombreEmpleado.trim(),
      cargo: cargo.trim(),
      departamento,
      tipoContrato,
      salario: salarioNumero,
      fechaPago,
      observaciones: observaciones.trim(),
      estadoPago: "pendiente",
      correoAdministrador: usuario.correo,
    });

    router.push("/panel/nominas");
  }

  return {
    esAdministrador: usuario?.rol === "administrador",
    nombreEmpleado, setNombreEmpleado,
    cargo, setCargo,
    departamento, setDepartamento,
    tipoContrato, setTipoContrato,
    salario, setSalario,
    fechaPago, setFechaPago,
    observaciones, setObservaciones,
    vistaPrevia,
    errores,
    guardando,
    handleSubmit,
  };
}