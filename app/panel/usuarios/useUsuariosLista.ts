"use client";

import { useState, useMemo } from "react";
import { obtenerUsuarios, eliminarUsuario, type Usuario } from "@/lib/usuariosStore";

export function useUsuariosLista() {
  const [busqueda, setBusqueda] = useState("");
  // Copiamos los datos del store a estado local con useState, para
  // que React "sepa" que debe re-dibujar la tabla cuando cambien.
  const [usuarios, setUsuarios] = useState<Usuario[]>(() => obtenerUsuarios());

  const usuariosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (termino === "") return usuarios;
    return usuarios.filter((usuario) => {
      const nombreCompleto = `${usuario.nombres} ${usuario.apellidos}`.toLowerCase();
      return (
        nombreCompleto.includes(termino) ||
        usuario.correo.toLowerCase().includes(termino)
      );
    });
  }, [usuarios, busqueda]);

  function handleEliminar(id: string, nombreCompleto: string) {
    // HU-06, criterio: "Dado que el administrador confirma eliminacion"
    // window.confirm() es el dialogo nativo mas simple del navegador
    // para pedir una confirmacion - suficiente para esta simulacion.
    const confirmado = window.confirm(
      `¿Seguro que quieres eliminar a ${nombreCompleto}? Esta acción no se puede deshacer.`
    );

    if (!confirmado) return;

    eliminarUsuario(id);
    // Volvemos a leer del store y actualizamos el estado local, para
    // que la tabla se re-dibuje sin ese usuario.
    setUsuarios(obtenerUsuarios());
  }

  return { busqueda, setBusqueda, usuariosFiltrados, handleEliminar };
}