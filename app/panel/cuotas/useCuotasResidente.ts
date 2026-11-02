"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { obtenerUsuarioPorCorreo } from "@/lib/usuariosStore";
import { obtenerPropiedades } from "@/lib/propiedadesStore";
import { validarImagen, leerComoDataUrl } from "@/lib/imagenes";
import {
  obtenerCuotasPorPropiedad,
  subirComprobante,
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

// El residente CONSULTA (HU-19) y, si pago por fuera, sube la imagen de su comprobante.
// Quien registra el pago es el administrador.
export function useCuotasResidente() {
  const { usuario } = useAuth();
  const [cuotas, setCuotas] = useState<Cuota[]>(() => (usuario ? calcularCuotasDelResidente(usuario.correo) : []));

  // Id de la cuota que se esta enviando, y el error de esa cuota (cada tarjeta muestra el suyo)
  const [subiendoId, setSubiendoId] = useState<string | null>(null);
  const [errorSubida, setErrorSubida] = useState<{ id: string; mensaje: string } | null>(null);

  const resumen = resumenDeCuotas(cuotas);
  // RF-31: informar cuando no tenga deudas pendientes
  const sinDeudas = cuotas.every((c) => estadoVisual(c) === "pagada");

  // Convierte un id de propiedad en un texto legible como "Torre A - 101"
  function nombrePropiedad(idPropiedad: string): string {
    const propiedad = obtenerPropiedades().find((p) => p.id === idPropiedad);
    return propiedad ? `Torre ${propiedad.torre} - ${propiedad.numero}` : "Propiedad desconocida";
  }

  async function handleSubirComprobante(idCuota: string, archivo: File) {
    if (!usuario) return;

    const errorArchivo = validarImagen(archivo);
    if (errorArchivo) {
      setErrorSubida({ id: idCuota, mensaje: errorArchivo });
      return;
    }

    setSubiendoId(idCuota);
    try {
      const imagen = await leerComoDataUrl(archivo);
      const resultado = subirComprobante(idCuota, usuario.correo, imagen);

      if (!resultado.exito) {
        setErrorSubida({ id: idCuota, mensaje: resultado.mensaje ?? "No se pudo enviar el comprobante." });
        return;
      }

      setErrorSubida(null);
      setCuotas(calcularCuotasDelResidente(usuario.correo));
    } catch {
      setErrorSubida({ id: idCuota, mensaje: "No se pudo leer la imagen. Intenta con otra." });
    } finally {
      setSubiendoId(null);
    }
  }

  return { cuotas, resumen, sinDeudas, nombrePropiedad, subiendoId, errorSubida, handleSubirComprobante };
}