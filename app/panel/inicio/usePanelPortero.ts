"use client";

import { useAuth } from "@/context/AuthContext";
import type { ItemResumen } from "@/components/ResumenTarjetas";
import { unidadDeUsuario } from "@/lib/personasHelpers";
import { obtenerComunicadosParaUsuario } from "@/lib/comunicadosStore";
import { resumenPortero } from "@/lib/panelStore";

// "2026-11-02T15:50:00.000Z" -> "10:50 a. m." (hora local)
function horaLocal(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
}

export function usePanelPortero() {
  const { usuario } = useAuth();
  const resumen = resumenPortero();

  const tarjetas: ItemResumen[] = [
    { etiqueta: "Visitas de hoy", valor: resumen.total, icono: "🚪", tono: "brand" },
    { etiqueta: "Esperadas", valor: resumen.esperadas, icono: "⏳", tono: "dorado" },
    { etiqueta: "En el conjunto", valor: resumen.enConjunto, icono: "✅", tono: "verde" },
    { etiqueta: "Completadas", valor: resumen.completadas, icono: "📋", tono: "gris" },
  ];

  return {
    tarjetas,
    porAtender: resumen.porAtender.map((v) => ({
      id: v.id,
      nombre: v.nombreVisitante,
      unidad: unidadDeUsuario(v.correoResidente),
      detalle: `Llega a las ${v.horaEstimada}`,
    })),
    dentro: resumen.dentro.map((v) => ({
      id: v.id,
      nombre: v.nombreVisitante,
      unidad: unidadDeUsuario(v.correoResidente),
      detalle: `Entró a las ${horaLocal(v.horaEntrada)}`,
    })),
    comunicados: usuario ? obtenerComunicadosParaUsuario(usuario.correo, usuario.rol).slice(0, 3) : [],
    correo: usuario?.correo ?? "",
  };
}