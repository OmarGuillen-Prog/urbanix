"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { obtenerUsuarioPorCorreo } from "@/lib/usuariosStore";
import { obtenerPropiedades } from "@/lib/propiedadesStore";
import {
  obtenerCuotasPorPropiedad,
  marcarComoPagada,
  estadoVisual,
  resumenDeCuotas,
  type Cuota,
} from "@/lib/cuotasStore";

function calcularCuotasDelResidente(correo: string): Cuota[] {
  const usuario = obtenerUsuarioPorCorreo(correo);
  if (!usuario) return [];

  // Las propiedades donde es propietario O arrendatario
  const misPropiedades = obtenerPropiedades().filter(
    (p) => p.idPropietario === usuario.id || p.idArrendatario === usuario.id
  );

  // flatMap: cada propiedad tiene VARIAS cuotas; aplana el resultado en una sola lista.
  // Orden: la de vencimiento mas lejano primero.
  return misPropiedades
    .flatMap((p) => obtenerCuotasPorPropiedad(p.id))
    .sort((a, b) => b.fechaLimite.localeCompare(a.fechaLimite));
}

export function useCuotasResidente() {
  const { usuario } = useAuth();
  const [cuotas, setCuotas] = useState<Cuota[]>(() => (usuario ? calcularCuotasDelResidente(usuario.correo) : []));

  const resumen = resumenDeCuotas(cuotas);
  // RF-31: informar cuando no tenga deudas pendientes
  const sinDeudas = cuotas.every((c) => estadoVisual(c) === "pagada");

  // Convierte un id de propiedad en un texto legible como "Torre A - 101"
  function nombrePropiedad(idPropiedad: string): string {
    const propiedad = obtenerPropiedades().find((p) => p.id === idPropiedad);
    return propiedad ? `Torre ${propiedad.torre} - ${propiedad.numero}` : "Propiedad desconocida";
  }

  function handlePagar(id: string) {
    // Simulacion: no hay pasarela de pagos real (el documento lo aclara como limitacion)
    marcarComoPagada(id);
    if (usuario) setCuotas(calcularCuotasDelResidente(usuario.correo));
  }

  return { cuotas, resumen, sinDeudas, nombrePropiedad, handlePagar };
}