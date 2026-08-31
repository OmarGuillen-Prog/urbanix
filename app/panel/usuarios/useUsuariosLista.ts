"use client";

import { useState, useMemo } from "react";
import { usuariosSimulados, type Usuario } from "@/lib/usuariosStore";

export function useUsuariosLista() {
  const [busqueda, setBusqueda] = useState("");

  // useMemo: le dice a React "solo vuelve a calcular esto si cambia
  // 'busqueda'". Sin esto, el filtrado se recalcularia en CADA
  // re-render del componente (por ejemplo, si algo mas en la pantalla
  // cambia), aunque el texto de busqueda siga igual - trabajo
  // desperdiciado. Con listas pequeñas como esta no se nota, pero es
  // el habito correcto para cuando el listado tenga cientos de filas.
  const usuariosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    // Si no hay busqueda, mostramos todos (RF-13: listar usuarios)
    if (termino === "") return usuariosSimulados;

    // Si hay busqueda, filtramos por nombre, apellido o correo
    // (RF-14: buscar mediante filtros o criterios de busqueda)
    return usuariosSimulados.filter((usuario: Usuario) => {
      const nombreCompleto = `${usuario.nombres} ${usuario.apellidos}`.toLowerCase();
      return (
        nombreCompleto.includes(termino) ||
        usuario.correo.toLowerCase().includes(termino)
      );
    });
  }, [busqueda]);

  return { busqueda, setBusqueda, usuariosFiltrados };
}