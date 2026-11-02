import type { Departamento, TipoContrato } from "@/lib/nominaStore";

export const ETIQUETAS_DEPARTAMENTO: Record<Departamento, string> = {
  seguridad: "Seguridad",
  administracion: "Administración",
  aseo: "Aseo",
  mantenimiento: "Mantenimiento",
};

export const ETIQUETAS_CONTRATO: Record<TipoContrato, string> = {
  tiempo_completo: "Tiempo completo",
  medio_tiempo: "Medio tiempo",
  por_horas: "Por horas",
};

export const ESTILOS_CONTRATO: Record<TipoContrato, string> = {
  tiempo_completo: "bg-sky-100 text-sky-700",
  medio_tiempo: "bg-violet-100 text-violet-700",
  por_horas: "bg-amber-100 text-amber-700",
};

export const ETIQUETAS_ESTADO_PAGO = { pagado: "Al día", pendiente: "Pendiente" } as const;

export const ESTILOS_ESTADO_PAGO = {
  pagado: "bg-emerald-100 text-emerald-700",
  pendiente: "bg-gold/20 text-gold",
} as const;

// "Andrés Vélez" -> "AV"
export function iniciales(nombre: string): string {
  return nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((palabra) => palabra.charAt(0).toUpperCase())
    .join("");
}