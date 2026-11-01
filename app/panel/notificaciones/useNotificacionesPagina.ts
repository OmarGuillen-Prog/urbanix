// app/panel/notificaciones/useNotificacionesPagina.ts
"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useVersionNotificaciones } from "@/lib/useNotificaciones";
import {
  obtenerNotificacionesDeUsuario,
  marcarComoLeida,
  marcarTodasComoLeidas,
  eliminarNotificacion,
  eliminarTodas,
  type TipoNotificacion,
} from "@/lib/notificacionesStore";
import { fueHaceMenosDe } from "@/lib/formatos";

const TAMANO_PAGINA = 8;

type FiltroLectura = "todas" | "sin_leer" | "leidas";
type FiltroPeriodo = "7" | "30" | "todo";

export function useNotificacionesPagina() {
  const { usuario } = useAuth();
  const correo = usuario?.correo ?? "";

  // Suscripcion: la pagina se redibuja sola cuando cambia el store
  // (por ejemplo, si otro modulo crea una notificacion).
  useVersionNotificaciones();

  // Son datos DERIVADOS del store: se calculan en cada render, sin useState
  const todas = correo === "" ? [] : obtenerNotificacionesDeUsuario(correo);

  const [filtroLectura, setFiltroLectura] = useState<FiltroLectura>("todas");
  const [filtroTipo, setFiltroTipo] = useState<TipoNotificacion | "todos">("todos");
  const [filtroPeriodo, setFiltroPeriodo] = useState<FiltroPeriodo>("7");
  const [pagina, setPagina] = useState(1);

  // Cada cambio de filtro vuelve a la pagina 1 en el manejador (no en un useEffect)
  function cambiarLectura(valor: FiltroLectura) { setFiltroLectura(valor); setPagina(1); }
  function cambiarTipo(valor: TipoNotificacion | "todos") { setFiltroTipo(valor); setPagina(1); }
  function cambiarPeriodo(valor: FiltroPeriodo) { setFiltroPeriodo(valor); setPagina(1); }

  const filtradas = todas.filter((n) => {
    const coincideLectura =
      filtroLectura === "todas" || (filtroLectura === "sin_leer" ? !n.leida : n.leida);
    const coincideTipo = filtroTipo === "todos" || n.tipo === filtroTipo;
    const coincidePeriodo = filtroPeriodo === "todo" || fueHaceMenosDe(n.fecha, Number(filtroPeriodo));
    return coincideLectura && coincideTipo && coincidePeriodo;
  });

  // --- Paginacion ---
  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / TAMANO_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const inicio = (paginaActual - 1) * TAMANO_PAGINA;
  const visibles = filtradas.slice(inicio, inicio + TAMANO_PAGINA);

  // --- Metricas (sobre TODAS las notificaciones del usuario) ---
  const total = todas.length;
  const sinLeer = todas.filter((n) => !n.leida).length;
  const alertas = todas.filter((n) => n.tipo === "alerta").length;
  const informativas = todas.filter((n) => n.tipo !== "alerta").length; // info + exito

  // --- Acciones ---
  function handleMarcarLeida(id: string) {
    marcarComoLeida(id, correo);
  }

  function handleMarcarTodas() {
    marcarTodasComoLeidas(correo);
  }

  function handleEliminar(id: string) {
    eliminarNotificacion(id, correo);
  }

  function handleLimpiarTodo() {
    const confirmado = window.confirm("¿Eliminar todas tus notificaciones? Esta acción no se puede deshacer.");
    if (!confirmado) return;
    eliminarTodas(correo);
  }

  return {
    visibles,
    totalFiltradas: filtradas.length,
    paginaActual,
    totalPaginas,
    setPagina,
    filtroLectura, cambiarLectura,
    filtroTipo, cambiarTipo,
    filtroPeriodo, cambiarPeriodo,
    total, sinLeer, alertas, informativas,
    handleMarcarLeida,
    handleMarcarTodas,
    handleEliminar,
    handleLimpiarTodo,
  };
}