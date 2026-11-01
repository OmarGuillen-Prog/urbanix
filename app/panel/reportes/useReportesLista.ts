"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  obtenerTodosLosReportes,
  obtenerReportesPorUsuario,
  codigoReporte,
  type ReporteDano,
  type EstadoReporte,
  type PrioridadReporte,
} from "@/lib/reportesStore";
import { nombrePorCorreo, unidadDeUsuario } from "@/lib/personasHelpers";

const TAMANO_PAGINA = 6;

export function useReportesLista() {
  const { usuario } = useAuth();
  const esAdministrador = usuario?.rol === "administrador";

  // El administrador ve todos; el residente, solo los suyos
  const [reportes] = useState<ReporteDano[]>(() => {
    if (!usuario) return [];
    return esAdministrador ? obtenerTodosLosReportes() : obtenerReportesPorUsuario(usuario.correo);
  });

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<EstadoReporte | "todos">("todos");
  const [filtroPrioridad, setFiltroPrioridad] = useState<PrioridadReporte | "todas">("todas");
  const [pagina, setPagina] = useState(1);

  // Cada cambio de filtro vuelve a la pagina 1 en el manejador (no en un useEffect)
  function cambiarBusqueda(valor: string) { setBusqueda(valor); setPagina(1); }
  function cambiarEstado(valor: EstadoReporte | "todos") { setFiltroEstado(valor); setPagina(1); }
  function cambiarPrioridad(valor: PrioridadReporte | "todas") { setFiltroPrioridad(valor); setPagina(1); }

  const filtrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return reportes.filter((r) => {
      const coincideTexto =
        termino === "" ||
        codigoReporte(r.id).toLowerCase().includes(termino) ||
        r.titulo.toLowerCase().includes(termino) ||
        r.ubicacion.toLowerCase().includes(termino) ||
        nombrePorCorreo(r.correoCreador).toLowerCase().includes(termino) ||
        unidadDeUsuario(r.correoCreador).toLowerCase().includes(termino);
      const coincideEstado = filtroEstado === "todos" || r.estado === filtroEstado;
      const coincidePrioridad = filtroPrioridad === "todas" || r.prioridad === filtroPrioridad;
      return coincideTexto && coincideEstado && coincidePrioridad;
    });
  }, [reportes, busqueda, filtroEstado, filtroPrioridad]);

  // --- Paginacion ---
  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / TAMANO_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const inicio = (paginaActual - 1) * TAMANO_PAGINA;
  const visibles = filtrados.slice(inicio, inicio + TAMANO_PAGINA);

  // --- Metricas (sobre lo que este rol puede ver) ---
  const pendientes = reportes.filter((r) => r.estado === "pendiente").length;
  const enReparacion = reportes.filter((r) => r.estado === "en_proceso").length;
  const resueltos = reportes.filter((r) => r.estado === "resuelto").length;
  // Alta prioridad = urgentes que siguen abiertos
  const altaPrioridad = reportes.filter((r) => r.prioridad === "alta" && r.estado !== "resuelto").length;

  return {
    esAdministrador,
    visibles,
    totalFiltrados: filtrados.length,
    paginaActual,
    totalPaginas,
    setPagina,
    busqueda, cambiarBusqueda,
    filtroEstado, cambiarEstado,
    filtroPrioridad, cambiarPrioridad,
    pendientes, enReparacion, resueltos, altaPrioridad,
  };
}