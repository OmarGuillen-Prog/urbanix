"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  obtenerTodosLosComunicados,
  obtenerComunicadosParaUsuario,
  alternarFijado,
  eliminarComunicado,
  registrarVisualizacion,
  contarPublicadosEsteMes,
  type Comunicado,
  type CategoriaComunicado,
  type DestinoComunicado,
  type EstadoComunicado,
} from "@/lib/comunicadosStore";

export function useComunicadosLista() {
  const { usuario } = useAuth();
  const esAdministrador = usuario?.rol === "administrador";
  const correo = usuario?.correo ?? "";

  // El administrador ve todos; los demas, solo lo publicado que va dirigido a ellos
  function cargar(): Comunicado[] {
    if (!usuario) return [];
    return esAdministrador ? obtenerTodosLosComunicados() : obtenerComunicadosParaUsuario(usuario.correo, usuario.rol);
  }

  const [comunicados, setComunicados] = useState<Comunicado[]>(() => cargar());
  const [filtroCategoria, setFiltroCategoria] = useState<CategoriaComunicado | "todas">("todas");
  // "cualquiera" = sin filtrar; "todos" es un destino real ("Para todos")
  const [filtroDestino, setFiltroDestino] = useState<DestinoComunicado | "cualquiera">("cualquiera");
  const [filtroEstado, setFiltroEstado] = useState<EstadoComunicado | "todos">("todos");
  // ids de los comunicados con el texto completo desplegado ("Ver mas")
  const [expandidos, setExpandidos] = useState<string[]>([]);

  const filtrados = comunicados.filter(
    (c) =>
      (filtroCategoria === "todas" || c.categoria === filtroCategoria) &&
      (filtroDestino === "cualquiera" || c.destino === filtroDestino) &&
      (filtroEstado === "todos" || c.estado === filtroEstado)
  );

  // --- Metricas ---
  const total = comunicados.length;
  const fijados = comunicados.filter((c) => c.fijado).length;
  const publicadosEsteMes = contarPublicadosEsteMes(comunicados);
  const totalVisualizaciones = comunicados.reduce((suma, c) => suma + c.vistoPor.length, 0);
  // Para quien lee: los que todavia no ha abierto
  const sinLeer = comunicados.filter((c) => !c.vistoPor.includes(correo)).length;

  function esNuevo(comunicado: Comunicado): boolean {
    return !esAdministrador && !comunicado.vistoPor.includes(correo);
  }

  // Abrir "Ver mas" cuenta como una visualizacion (una sola vez por persona)
  function handleAlternarExpandido(id: string) {
    const abriendo = !expandidos.includes(id);
    setExpandidos(abriendo ? [...expandidos, id] : expandidos.filter((x) => x !== id));

    if (abriendo && usuario) {
      registrarVisualizacion(id, usuario.correo, usuario.rol);
      setComunicados(cargar());
    }
  }

  function handleAlternarFijado(id: string) {
    alternarFijado(id);
    setComunicados(cargar());
  }

  function handleEliminar(id: string, titulo: string) {
    const confirmado = window.confirm(`¿Eliminar el comunicado "${titulo}"? Esta acción no se puede deshacer.`);
    if (!confirmado) return;

    eliminarComunicado(id);
    setComunicados(cargar());
  }

  return {
    esAdministrador,
    filtrados,
    expandidos,
    filtroCategoria, setFiltroCategoria,
    filtroDestino, setFiltroDestino,
    filtroEstado, setFiltroEstado,
    total, fijados, publicadosEsteMes, totalVisualizaciones, sinLeer,
    esNuevo,
    handleAlternarExpandido,
    handleAlternarFijado,
    handleEliminar,
  };
}