import type { TipoPQRS, PrioridadPQRS, EstadoPQRS } from "@/lib/pqrsStore";

export const ETIQUETAS_TIPO: Record<TipoPQRS, string> = {
  peticion: "Petición",
  queja: "Queja",
  reclamo: "Reclamo",
  sugerencia: "Sugerencia",
};

export const ETIQUETAS_PRIORIDAD: Record<PrioridadPQRS, string> = {
  alta: "Alta",
  media: "Media",
  baja: "Baja",
};

export const ETIQUETAS_ESTADO: Record<EstadoPQRS, string> = {
  pendiente: "Pendiente",
  en_proceso: "En proceso",
  resuelto: "Resuelto",
};

// Clases completas escritas a mano: Tailwind no detecta clases armadas con texto dinamico.
export const ESTILOS_TIPO: Record<TipoPQRS, string> = {
  peticion: "bg-brand/10 text-brand",
  queja: "bg-error/10 text-error",
  reclamo: "bg-amber-100 text-amber-700",
  sugerencia: "bg-emerald-100 text-emerald-700",
};

export const ESTILOS_PRIORIDAD: Record<PrioridadPQRS, string> = {
  alta: "bg-error/10 text-error",
  media: "bg-amber-100 text-amber-700",
  baja: "bg-zinc-100 text-zinc-500",
};

export const ESTILOS_ESTADO: Record<EstadoPQRS, string> = {
  pendiente: "bg-gold/20 text-gold",
  en_proceso: "bg-brand/10 text-brand",
  resuelto: "bg-emerald-100 text-emerald-700",
};