import type { EstadoReserva } from "@/lib/reservasStore";

export const ETIQUETAS_ESTADO: Record<EstadoReserva, string> = {
  confirmada: "Confirmada",
  pendiente: "Pendiente",
  cancelada: "Cancelada",
};

export const ESTILOS_ESTADO: Record<EstadoReserva, string> = {
  confirmada: "bg-emerald-100 text-emerald-700",
  pendiente: "bg-gold/20 text-gold",
  cancelada: "bg-error/10 text-error",
};