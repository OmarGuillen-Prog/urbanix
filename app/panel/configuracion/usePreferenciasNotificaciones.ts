"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { obtenerPreferencias, guardarPreferencias, type CategoriaNotificacion } from "@/lib/configuracionStore";
import { CATEGORIAS_POR_ROL } from "./etiquetas";

export function usePreferenciasNotificaciones() {
  const { usuario } = useAuth();
  const correo = usuario?.correo ?? "";

  const [preferencias, setPreferencias] = useState(() => obtenerPreferencias(correo));

  // Solo las categorias que le pueden llegar a su rol
  const categoriasVisibles: CategoriaNotificacion[] = usuario ? CATEGORIAS_POR_ROL[usuario.rol] : [];

  // Cada interruptor guarda al instante (no hay boton "Guardar")
  function handleCategoria(categoria: CategoriaNotificacion, activa: boolean) {
    guardarPreferencias(correo, { categorias: { [categoria]: activa } });
    setPreferencias(obtenerPreferencias(correo));
  }

  function handleCorreo(activo: boolean) {
    guardarPreferencias(correo, { porCorreo: activo });
    setPreferencias(obtenerPreferencias(correo));
  }

  return { preferencias, categoriasVisibles, handleCategoria, handleCorreo };
}