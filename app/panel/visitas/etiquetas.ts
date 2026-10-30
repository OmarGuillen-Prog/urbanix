import type { TipoVisita, EstadoVisita } from "@/lib/visitasStore";

export const ETIQUETAS_TIPO: Record<TipoVisita, string> = {
  visitante: "Visitante",
  domicilio: "Domicilio",
  servicio: "Servicio",
};

export const ESTILOS_TIPO: Record<TipoVisita, string> = {
  visitante: "bg-brand/10 text-brand",
  domicilio: "bg-amber-100 text-amber-700",
  servicio: "bg-violet-100 text-violet-700",
};

// Los valores internos no cambian; solo lo que se muestra
export const ETIQUETAS_ESTADO: Record<EstadoVisita, string> = {
  pendiente: "Esperado",
  en_conjunto: "Ingresó",
  finalizada: "Completado",
};

export const ESTILOS_ESTADO: Record<EstadoVisita, string> = {
  pendiente: "bg-gold/20 text-gold",
  en_conjunto: "bg-emerald-100 text-emerald-700",
  finalizada: "bg-zinc-100 text-zinc-500",
};