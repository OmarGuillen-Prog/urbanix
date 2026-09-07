"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { obtenerUsuarioPorCorreo } from "@/lib/usuariosStore";
import { obtenerPropiedades } from "@/lib/propiedadesStore";
import { obtenerCuotasPorPropiedad, marcarComoPagada, estadoVisual, type Cuota } from "@/lib/cuotasStore";

function calcularCuotasDelResidente(correo: string): Cuota[] {
  const usuario = obtenerUsuarioPorCorreo(correo);
  if (!usuario) return [];

  const misPropiedades = obtenerPropiedades().filter(
    (p) => p.idPropietario === usuario.id || p.idArrendatario === usuario.id
  );

  return misPropiedades.flatMap((p) => obtenerCuotasPorPropiedad(p.id));
}

export function useCuotasResidente() {
  const { usuario } = useAuth();
  const [cuotas, setCuotas] = useState<Cuota[]>(() => (usuario ? calcularCuotasDelResidente(usuario.correo) : []));

  const pendientes = cuotas.filter((c) => estadoVisual(c) !== "pagada");
  const sinDeudas = pendientes.length === 0;

  // Nuevo: mismo "JOIN manual" que ya usaste en Usuarios, Visitas y
  // en la vista de administrador de este mismo modulo - convierte un
  // id de propiedad en un texto legible como "Torre A - 101".
  function nombrePropiedad(idPropiedad: string): string {
    const propiedad = obtenerPropiedades().find((p) => p.id === idPropiedad);
    return propiedad ? `Torre ${propiedad.torre} - ${propiedad.numero}` : "Propiedad desconocida";
  }

  function handlePagar(id: string) {
    marcarComoPagada(id);
    if (usuario) setCuotas(calcularCuotasDelResidente(usuario.correo));
  }

  return { cuotas, sinDeudas, nombrePropiedad, handlePagar };
}