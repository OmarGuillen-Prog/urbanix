"use client";

import { useState, useMemo } from "react";
import {
  obtenerTodasLasCuotas,
  estadoVisual,
  resumenDeCuotas,
  detalleDeCuota,
  codigoCuota,
  mesesConCuotas,
  enviarRecordatorios,
  type Cuota,
  type EstadoVisualCuota,
} from "@/lib/cuotasStore";

const TAMANO_PAGINA = 8;

export function useCuotasAdmin() {
  const [cuotas] = useState<Cuota[]>(() => obtenerTodasLasCuotas());

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<EstadoVisualCuota | "todos">("todos");
  const [filtroPeriodo, setFiltroPeriodo] = useState<string>("todos"); // "todos" o "2026-11"
  const [pagina, setPagina] = useState(1);
  const [mensajeRecordatorios, setMensajeRecordatorios] = useState<string | null>(null);

  // Cada cambio de filtro vuelve a la pagina 1 en el manejador (no en un useEffect)
  function cambiarBusqueda(valor: string) { setBusqueda(valor); setPagina(1); }
  function cambiarEstado(valor: EstadoVisualCuota | "todos") { setFiltroEstado(valor); setPagina(1); }
  function cambiarPeriodo(valor: string) { setFiltroPeriodo(valor); setPagina(1); }

  const periodos = mesesConCuotas();

  // El PERIODO define el "alcance": tarjetas y barra de progreso miran solo ese mes.
  // La busqueda y el estado solo afectan a la tabla.
  const enPeriodo = useMemo(
    () => (filtroPeriodo === "todos" ? cuotas : cuotas.filter((c) => c.fechaLimite.startsWith(filtroPeriodo))),
    [cuotas, filtroPeriodo]
  );

  const resumen = resumenDeCuotas(enPeriodo);
  const etiquetaPeriodo =
    filtroPeriodo === "todos" ? "todos los periodos" : (periodos.find((p) => p.valor === filtroPeriodo)?.etiqueta ?? filtroPeriodo);

  const filtradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return enPeriodo.filter((c) => {
      const detalle = detalleDeCuota(c);
      const coincideTexto =
        termino === "" ||
        codigoCuota(c.id).toLowerCase().includes(termino) ||
        detalle.unidad.toLowerCase().includes(termino) ||
        detalle.residente.toLowerCase().includes(termino) ||
        c.descripcion.toLowerCase().includes(termino);
      const coincideEstado = filtroEstado === "todos" || estadoVisual(c) === filtroEstado;
      return coincideTexto && coincideEstado;
    });
  }, [enPeriodo, busqueda, filtroEstado]);

  // --- Paginacion ---
  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / TAMANO_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const inicio = (paginaActual - 1) * TAMANO_PAGINA;
  const visibles = filtradas.slice(inicio, inicio + TAMANO_PAGINA);

  function handleEnviarRecordatorios() {
    const { enviados, residentes } = enviarRecordatorios();

    setMensajeRecordatorios(
      enviados === 0
        ? "No hay recordatorios nuevos: todos los residentes con cuotas por vencer o vencidas ya tienen su aviso sin leer."
        : `Se enviaron ${enviados} recordatorio(s) a ${residentes} residente(s).`
    );
  }

  return {
    visibles,
    totalFiltradas: filtradas.length,
    paginaActual,
    totalPaginas,
    setPagina,
    busqueda, cambiarBusqueda,
    filtroEstado, cambiarEstado,
    filtroPeriodo, cambiarPeriodo,
    periodos,
    resumen,
    etiquetaPeriodo,
    mensajeRecordatorios,
    handleEnviarRecordatorios,
  };
}