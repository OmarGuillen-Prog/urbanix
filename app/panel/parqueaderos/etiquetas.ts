import type { EstadoParqueadero, TipoParqueadero } from "@/lib/parqueaderosStore";

export const ETIQUETAS_ESTADO: Record<EstadoParqueadero, string> = {
  disponible: "Disponible",
  ocupado: "Ocupado",
  reservado: "Reservado",
};

export const ESTILOS_ESTADO: Record<EstadoParqueadero, string> = {
  disponible: "bg-emerald-100 text-emerald-700",
  ocupado: "bg-error/10 text-error",
  reservado: "bg-gold/20 text-gold",
};

export const ETIQUETAS_TIPO: Record<TipoParqueadero, string> = {
  carro: "Carro",
  moto: "Moto",
};