// Icono de cada zona, por id. Una zona sin icono definido usa el pin de ubicacion.
const ICONOS_ZONA: Record<string, string> = {
  "1": "🎉", // Salon social
  "2": "🏊", // Piscina
  "3": "⚽", // Cancha multiple
  "4": "🔥", // Zona BBQ
};

export function iconoDeZona(idZona: string): string {
  return ICONOS_ZONA[idZona] ?? "📍";
}