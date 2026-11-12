import type { Propiedad } from "@/lib/propiedadesStore";
import type { TipoParqueadero } from "@/lib/parqueaderosStore";

export const ETIQUETAS_TIPO_PROPIEDAD: Record<Propiedad["tipo"], string> = {
  apartamento: "Apartamento",
  casa: "Casa",
  local: "Local comercial",
};

export const ETIQUETAS_OCUPACION: Record<Propiedad["estadoOcupacion"], string> = {
  ocupado: "Ocupado",
  vacio: "Disponible",
  mantenimiento: "En mantenimiento",
};

// Estilos del badge que va sobre el encabezado verde de la tarjeta
export const ESTILOS_OCUPACION: Record<Propiedad["estadoOcupacion"], string> = {
  ocupado: "bg-emerald-100 text-emerald-700",
  vacio: "bg-white/90 text-ink/60",
  mantenimiento: "bg-amber-100 text-amber-700",
};

export const ETIQUETAS_TIPO_PARQUEADERO: Record<TipoParqueadero, string> = {
  carro: "Carro",
  moto: "Moto",
};