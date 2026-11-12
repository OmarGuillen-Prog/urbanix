"use client";

import { useAuth } from "@/context/AuthContext";
import { obtenerUsuarioPorCorreo } from "@/lib/usuariosStore";
import { fichasDelResidente } from "@/lib/fichaPropiedad";

// Son datos DERIVADOS de los stores: se calculan al dibujar la pantalla, sin useState
export function usePropiedadesResidente() {
  const { usuario } = useAuth();
  const correo = usuario?.correo ?? "";

  return {
    fichas: fichasDelResidente(correo),
    // La unidad que la persona escribio al registrarse (sirve de pista mientras la administracion no se la asigna)
    unidadSolicitada: usuario ? obtenerUsuarioPorCorreo(correo)?.unidadSolicitada : undefined,
  };
}