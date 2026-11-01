import type { EstadoVisualCuota } from "@/lib/cuotasStore";

// "pagada" se muestra como "Al día" (asi aparece en tu referencia)
export const ETIQUETAS_ESTADO: Record<EstadoVisualCuota, string> = {
  pagada: "Al día",
  pendiente: "Pendiente",
  vencida: "Vencido",
};

export const ESTILOS_ESTADO: Record<EstadoVisualCuota, string> = {
  pagada: "bg-emerald-100 text-emerald-700",
  pendiente: "bg-gold/20 text-gold",
  vencida: "bg-error/10 text-error",
};