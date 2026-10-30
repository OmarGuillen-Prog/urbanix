// app/panel/usuarios/useUsuariosLista.ts
"use client";

import { useState, useMemo } from "react";
import { obtenerUsuarios, eliminarUsuario, type Usuario } from "@/lib/usuariosStore";
import { obtenerPropiedades } from "@/lib/propiedadesStore";
import type { Rol } from "@/context/AuthContext";

export function useUsuariosLista() {
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState<Rol | "todos">("todos");
  const [filtroEstado, setFiltroEstado] = useState<Usuario["estado"] | "todos">("todos");
  const [usuarios, setUsuarios] = useState<Usuario[]>(() => obtenerUsuarios());

  const usuariosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return usuarios.filter((usuario) => {
      const nombreCompleto = `${usuario.nombres} ${usuario.apellidos}`.toLowerCase();
      const coincideTexto =
        termino === "" || nombreCompleto.includes(termino) || usuario.correo.toLowerCase().includes(termino);
      const coincideRol = filtroRol === "todos" || usuario.rol === filtroRol;
      const coincideEstado = filtroEstado === "todos" || usuario.estado === filtroEstado;
      return coincideTexto && coincideRol && coincideEstado;
    });
  }, [usuarios, busqueda, filtroRol, filtroEstado]);

  function handleEliminar(id: string, nombreCompleto: string) {
    const confirmado = window.confirm(
      `¿Seguro que quieres eliminar a ${nombreCompleto}? Esta acción no se puede deshacer.`
    );
    if (!confirmado) return;

    eliminarUsuario(id);
    setUsuarios(obtenerUsuarios());
  }

  // --- Metricas para las tarjetas de resumen ---
  // Salen del estado "usuarios" (no de una lectura nueva del store),
  // asi los numeros se actualizan al eliminar a alguien.
  const totalUsuarios = usuarios.length;
  const usuariosActivos = usuarios.filter((u) => u.estado === "activo").length;

  // Propietarios y arrendatarios son personas DISTINTAS (Set elimina
  // repetidos). Ademas ignoramos ids de usuarios que ya no existen,
  // por si alguien fue eliminado pero seguia asignado a una propiedad.
  const idsExistentes = new Set(usuarios.map((u) => u.id));
  const propiedades = obtenerPropiedades();

  const totalPropietarios = new Set(
    propiedades
      .map((p) => p.idPropietario)
      .filter((id): id is string => id !== null && idsExistentes.has(id))
  ).size;

  const totalArrendatarios = new Set(
    propiedades
      .map((p) => p.idArrendatario)
      .filter((id): id is string => id !== null && idsExistentes.has(id))
  ).size;

  return {
    busqueda, setBusqueda,
    filtroRol, setFiltroRol,
    filtroEstado, setFiltroEstado,
    usuariosFiltrados,
    handleEliminar,
    totalUsuarios,
    usuariosActivos,
    totalPropietarios,
    totalArrendatarios,
  };
}