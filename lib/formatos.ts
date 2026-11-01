// "$ 3.600.000"
export function formatearMoneda(valor: number): string {
  return valor.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
}

// "$3,6 M" o "$850 k": para tarjetas y ejes, donde no cabe el numero completo
export function formatearMonedaCorta(valor: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(valor);
}

// "Hace un momento", "Hace 5 min", "Hace 2 horas", "Hace 1 día", "Hace 3 días"
export function tiempoRelativo(iso: string): string {
  const segundos = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (segundos < 60) return "Hace un momento";

  const minutos = Math.floor(segundos / 60);
  if (minutos < 60) return `Hace ${minutos} min`;

  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `Hace ${horas} ${horas === 1 ? "hora" : "horas"}`;

  const dias = Math.floor(horas / 24);
  return `Hace ${dias} ${dias === 1 ? "día" : "días"}`;
}

// true si la fecha ISO es de los ultimos N dias
export function fueHaceMenosDe(iso: string, dias: number): boolean {
  return Date.now() - new Date(iso).getTime() <= dias * 24 * 60 * 60 * 1000;
}