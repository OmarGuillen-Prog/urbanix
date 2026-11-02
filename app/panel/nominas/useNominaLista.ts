"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  obtenerNomina,
  periodosDeNomina,
  periodoDe,
  liquidar,
  resumenDeNomina,
  resumenPorDepartamento,
  type Departamento,
  type TipoContrato,
  type RegistroNomina,
} from "@/lib/nominaStore";

export function useNominaLista() {
  const { usuario } = useAuth();

  const [registros] = useState<RegistroNomina[]>(() => obtenerNomina());
  const periodos = periodosDeNomina();

  // Por defecto, el periodo mas reciente
  const [periodo, setPeriodo] = useState<string>(() => periodosDeNomina()[0]?.valor ?? "");
  const [busqueda, setBusqueda] = useState("");
  const [filtroDepartamento, setFiltroDepartamento] = useState<Departamento | "todos">("todos");
  const [filtroContrato, setFiltroContrato] = useState<TipoContrato | "todos">("todos");
  const [filtroEstado, setFiltroEstado] = useState<"pagado" | "pendiente" | "todos">("todos");

  // El PERIODO define el alcance: tarjetas y resumen por departamento miran solo ese mes.
  // La busqueda y los filtros solo afectan a la tabla.
  const delPeriodo = registros.filter((r) => periodoDe(r) === periodo);

  const resumen = resumenDeNomina(delPeriodo);
  const porDepartamento = resumenPorDepartamento(delPeriodo);

  const termino = busqueda.trim().toLowerCase();
  const filas = delPeriodo
    .filter(
      (r) =>
        (termino === "" || r.nombreEmpleado.toLowerCase().includes(termino) || r.cargo.toLowerCase().includes(termino)) &&
        (filtroDepartamento === "todos" || r.departamento === filtroDepartamento) &&
        (filtroContrato === "todos" || r.tipoContrato === filtroContrato) &&
        (filtroEstado === "todos" || r.estadoPago === filtroEstado)
    )
    .map((registro) => ({ registro, liquidacion: liquidar(registro) }));

  return {
    esAdministrador: usuario?.rol === "administrador",
    periodos,
    periodo, setPeriodo,
    busqueda, setBusqueda,
    filtroDepartamento, setFiltroDepartamento,
    filtroContrato, setFiltroContrato,
    filtroEstado, setFiltroEstado,
    resumen,
    porDepartamento,
    filas,
  };
}