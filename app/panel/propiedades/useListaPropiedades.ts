"use client";

import { useState } from "react";
import { obtenerPropiedades, eliminarPropiedad, type Propiedad } from "@/lib/propiedadesStore";
import { obtenerUsuarios } from "@/lib/usuariosStore";

export function useListaPropiedades() {
  const [propiedades, setPropiedades] = useState<Propiedad[]>(() => obtenerPropiedades());

  // El "JOIN manual" del que hablamos: convertimos un id en un nombre
  // legible, buscando en la lista de usuarios. Si no encuentra a
  // nadie (o el campo es null), devolvemos un texto de reemplazo.
  function nombrePorId(id: string | null): string {
    if (!id) return "Sin asignar";
    const usuario = obtenerUsuarios().find((u) => u.id === id);
    return usuario ? `${usuario.nombres} ${usuario.apellidos}` : "Sin asignar";
  }

  function handleEliminar(id: string, etiqueta: string) {
    const confirmado = window.confirm(
      `¿Seguro que quieres eliminar la propiedad ${etiqueta}? Esta acción no se puede deshacer.`
    );
    if (!confirmado) return;

    eliminarPropiedad(id);
    setPropiedades(obtenerPropiedades());
  }

  return { propiedades, nombrePorId, handleEliminar };
}