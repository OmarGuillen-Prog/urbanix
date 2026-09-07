"use client";

import { useAuth } from "@/context/AuthContext";
import { obtenerUsuarioPorCorreo } from "@/lib/usuariosStore";
import { obtenerPropiedades } from "@/lib/propiedadesStore";

export function usePropiedadesResidente() {
  const { usuario } = useAuth();

  const misPropiedades = (() => {
    if (!usuario) return [];
    const usuarioCompleto = obtenerUsuarioPorCorreo(usuario.correo);
    if (!usuarioCompleto) return [];

    return obtenerPropiedades()
      .filter((p) => p.idPropietario === usuarioCompleto.id || p.idArrendatario === usuarioCompleto.id)
      .map((p) => ({
        ...p,
        // Le decimos al residente BAJO QUE CONDICION es suya - util
        // si es propietario de una y arrendatario de otra, como Juan
        // Manuel en tus datos de ejemplo.
        miRelacion: p.idPropietario === usuarioCompleto.id ? ("Propietario" as const) : ("Arrendatario" as const),
      }));
  })();

  return { misPropiedades };
}