import type { CategoriaComunicado, DestinoComunicado, EstadoComunicado } from "@/lib/comunicadosStore";

export const ETIQUETAS_CATEGORIA: Record<CategoriaComunicado, string> = {
  mantenimiento: "Mantenimiento",
  administrativo: "Administrativo",
  normativo: "Normativo",
  comunidad: "Comunidad",
};

export const ESTILOS_CATEGORIA: Record<CategoriaComunicado, string> = {
  mantenimiento: "bg-amber-100 text-amber-700",
  administrativo: "bg-sky-100 text-sky-700",
  normativo: "bg-violet-100 text-violet-700",
  comunidad: "bg-emerald-100 text-emerald-700",
};

export const ETIQUETAS_DESTINO: Record<DestinoComunicado, string> = {
  todos: "Para todos",
  propietarios: "Para propietarios",
  arrendatarios: "Para arrendatarios",
};

export const ETIQUETAS_ESTADO: Record<EstadoComunicado, string> = {
  publicado: "Publicado",
  borrador: "Borrador",
  archivado: "Archivado",
};

export const ESTILOS_ESTADO: Record<EstadoComunicado, string> = {
  publicado: "bg-emerald-100 text-emerald-700",
  borrador: "bg-amber-100 text-amber-700",
  archivado: "bg-zinc-100 text-zinc-500",
};