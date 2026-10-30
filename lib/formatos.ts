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