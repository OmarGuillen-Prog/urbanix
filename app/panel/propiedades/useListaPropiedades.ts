"use client";

import { useState, useMemo } from "react";
import { obtenerPropiedades, eliminarPropiedad, type Propiedad } from "@/lib/propiedadesStore";
import { obtenerUsuarios } from "@/lib/usuariosStore";
import { obtenerUltimaCuotaDePropiedad } from "@/lib/cuotasStore";

export function useListaPropiedades() {
  const [propiedades, setPropiedades] = useState<Propiedad[]>(() => obtenerPropiedades());
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<Propiedad["tipo"] | "todos">("todos");
  const [filtroEstado, setFiltroEstado] = useState<Propiedad["estadoOcupacion"] | "todos">("todos");

  function nombrePorId(id: string | null): string {
    if (!id) return "Sin asignar";
    const usuario = obtenerUsuarios().find((u) => u.id === id);
    return usuario ? `${usuario.nombres} ${usuario.apellidos}` : "Sin asignar";
  }

  function cuotaMensual(idPropiedad: string): number | null {
    return obtenerUltimaCuotaDePropiedad(idPropiedad)?.valor ?? null;
  }

  const propiedadesFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return propiedades.filter((p) => {
      const etiqueta = `Torre ${p.torre} - ${p.numero}`.toLowerCase();
      const propietario = nombrePorId(p.idPropietario).toLowerCase();
      const coincideTexto = termino === "" || etiqueta.includes(termino) || propietario.includes(termino);
      const coincideTipo = filtroTipo === "todos" || p.tipo === filtroTipo;
      const coincideEstado = filtroEstado === "todos" || p.estadoOcupacion === filtroEstado;
      return coincideTexto && coincideTipo && coincideEstado;
    });
  }, [propiedades, busqueda, filtroTipo, filtroEstado]);

  function handleEliminar(id: string, etiqueta: string) {
    const confirmado = window.confirm(
      `¿Seguro que quieres eliminar la propiedad ${etiqueta}? Esta acción no se puede deshacer.`
    );
    if (!confirmado) return;
    eliminarPropiedad(id);
    setPropiedades(obtenerPropiedades());
  }

  // --- Metricas para las tarjetas de resumen ---
  const totalUnidades = propiedades.length;
  const ocupadas = propiedades.filter((p) => p.estadoOcupacion === "ocupado").length;
  const disponibles = propiedades.filter((p) => p.estadoOcupacion === "vacio").length;
  const enMantenimiento = propiedades.filter((p) => p.estadoOcupacion === "mantenimiento").length;

  return {
    propiedadesFiltradas,
    busqueda, setBusqueda,
    filtroTipo, setFiltroTipo,
    filtroEstado, setFiltroEstado,
    nombrePorId,
    cuotaMensual,
    handleEliminar,
    totalUnidades,
    ocupadas,
    disponibles,
    enMantenimiento,
  };
}