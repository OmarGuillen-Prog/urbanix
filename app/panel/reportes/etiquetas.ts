import type { EstadoReporte, PrioridadReporte } from "@/lib/reportesStore";

// El valor interno "en_proceso" se muestra como "En reparación"
export const ETIQUETAS_ESTADO: Record<EstadoReporte, string> = {
  pendiente: "Pendiente",
  en_evaluacion: "En evaluación",
  en_proceso: "En reparación",
  resuelto: "Resuelto",
};

export const ESTILOS_ESTADO: Record<EstadoReporte, string> = {
  pendiente: "bg-gold/20 text-gold",
  en_evaluacion: "bg-sky-100 text-sky-700",
  en_proceso: "bg-brand/10 text-brand",
  resuelto: "bg-emerald-100 text-emerald-700",
};

export const ETIQUETAS_PRIORIDAD: Record<PrioridadReporte, string> = {
  alta: "Alta",
  media: "Media",
  baja: "Baja",
};

export const ESTILOS_PRIORIDAD: Record<PrioridadReporte, string> = {
  alta: "bg-error/10 text-error",
  media: "bg-amber-100 text-amber-700",
  baja: "bg-zinc-100 text-zinc-500",
};