"use client";

import { useState, useMemo } from "react";
import {
  obtenerTodasLasPQRS,
  codigoTicket,
  unidadDelCreador,
  type PQRS,
  type TipoPQRS,
  type EstadoPQRS,
  type PrioridadPQRS,
} from "@/lib/pqrsStore";

const TAMANO_PAGINA = 6;

export function usePQRSAdmin() {
  const [todas] = useState<PQRS[]>(() => obtenerTodasLasPQRS());

  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<TipoPQRS | "todos">("todos");
  const [filtroEstado, setFiltroEstado] = useState<EstadoPQRS | "todos">("todos");
  const [filtroPrioridad, setFiltroPrioridad] = useState<PrioridadPQRS | "todos">("todos");
  const [pagina, setPagina] = useState(1);

  // Cada cambio de filtro vuelve a la pagina 1 AQUI, en el manejador del
  // evento, y no en un useEffect (la leccion de HU-03).
  function cambiarBusqueda(valor: string) { setBusqueda(valor); setPagina(1); }
  function cambiarTipo(valor: TipoPQRS | "todos") { setFiltroTipo(valor); setPagina(1); }
  function cambiarEstado(valor: EstadoPQRS | "todos") { setFiltroEstado(valor); setPagina(1); }
  function cambiarPrioridad(valor: PrioridadPQRS | "todos") { setFiltroPrioridad(valor); setPagina(1); }

  const filtradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return todas.filter((p) => {
      const coincideTexto =
        termino === "" ||
        codigoTicket(p.id).toLowerCase().includes(termino) ||
        p.asunto.toLowerCase().includes(termino) ||
        unidadDelCreador(p.correoCreador).toLowerCase().includes(termino);
      const coincideTipo = filtroTipo === "todos" || p.tipo === filtroTipo;
      const coincideEstado = filtroEstado === "todos" || p.estado === filtroEstado;
      const coincidePrioridad = filtroPrioridad === "todos" || p.prioridad === filtroPrioridad;
      return coincideTexto && coincideTipo && coincideEstado && coincidePrioridad;
    });
  }, [todas, busqueda, filtroTipo, filtroEstado, filtroPrioridad]);

  // --- Paginacion ---
  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / TAMANO_PAGINA));
  // "Pagina segura": nunca mayor que el total real de paginas disponibles.
  const paginaActual = Math.min(pagina, totalPaginas);
  const inicio = (paginaActual - 1) * TAMANO_PAGINA;
  const visibles = filtradas.slice(inicio, inicio + TAMANO_PAGINA);

  // --- Metricas (sobre TODAS las PQRS, no solo las filtradas) ---
  const pendientes = todas.filter((p) => p.estado === "pendiente").length;
  const enProceso = todas.filter((p) => p.estado === "en_proceso").length;
  const resueltas = todas.filter((p) => p.estado === "resuelto").length;
  // Alta prioridad = urgentes que siguen abiertas
  const altaPrioridad = todas.filter((p) => p.prioridad === "alta" && p.estado !== "resuelto").length;

  return {
    visibles,
    totalFiltradas: filtradas.length,
    paginaActual,
    totalPaginas,
    setPagina,
    busqueda, cambiarBusqueda,
    filtroTipo, cambiarTipo,
    filtroEstado, cambiarEstado,
    filtroPrioridad, cambiarPrioridad,
    pendientes,
    enProceso,
    resueltas,
    altaPrioridad,
  };
}