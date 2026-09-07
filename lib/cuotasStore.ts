// lib/cuotasStore.ts

// Refleja "Cuota" del MER: valor, fecha_generacion, fecha_limite,
// estado_pago, descripcion, id_propiedad (FK). Solo guardamos
// "pendiente" o "pagada" - "vencida" se CALCULA, no se guarda (ver
// estadoVisual mas abajo).
export interface Cuota {
  id: string;
  idPropiedad: string;
  valor: number;
  descripcion: string;
  fechaGeneracion: string; // ISO
  fechaLimite: string; // "YYYY-MM-DD"
  estadoPago: "pendiente" | "pagada";
}

let cuotas: Cuota[] = [
  { id: "1", idPropiedad: "1", valor: 250000, descripcion: "Administración - Septiembre", fechaGeneracion: "2026-09-01T08:00:00.000Z", fechaLimite: "2026-09-10", estadoPago: "pendiente" },
  { id: "2", idPropiedad: "1", valor: 250000, descripcion: "Administración - Agosto", fechaGeneracion: "2026-08-01T08:00:00.000Z", fechaLimite: "2026-08-10", estadoPago: "pagada" },
  { id: "3", idPropiedad: "3", valor: 280000, descripcion: "Administración - Septiembre", fechaGeneracion: "2026-09-01T08:00:00.000Z", fechaLimite: "2026-09-10", estadoPago: "pendiente" },
  { id: "4", idPropiedad: "3", valor: 280000, descripcion: "Administración - Agosto", fechaGeneracion: "2026-08-01T08:00:00.000Z", fechaLimite: "2026-08-10", estadoPago: "pendiente" },
];

export function obtenerTodasLasCuotas(): Cuota[] {
  return cuotas;
}

export function obtenerCuotasPorPropiedad(idPropiedad: string): Cuota[] {
  return cuotas.filter((c) => c.idPropiedad === idPropiedad);
}

// RF-27, RF-28, RF-29: registrar cuota, asociada a una propiedad, con
// fecha limite.
export function crearCuota(datos: {
  idPropiedad: string;
  valor: number;
  descripcion: string;
  fechaLimite: string;
}): void {
  const nuevoId = (Math.max(0, ...cuotas.map((c) => Number(c.id))) + 1).toString();
  cuotas = [
    ...cuotas,
    { id: nuevoId, ...datos, fechaGeneracion: new Date().toISOString(), estadoPago: "pendiente" },
  ];
}

export function marcarComoPagada(id: string): void {
  cuotas = cuotas.map((c) => (c.id === id ? { ...c, estadoPago: "pagada" } : c));
}

// El "estado calculado" del que hablamos: si ya esta pagada, listo.
// Si no, comparamos la fecha limite contra HOY para decidir si es
// "pendiente" (aun a tiempo) o "vencida" (RF-33) - un simple
// comparador de strings funciona porque "YYYY-MM-DD" ordena
export function estadoVisual(cuota: Cuota): "pendiente" | "vencida" | "pagada" {
  if (cuota.estadoPago === "pagada") return "pagada";
  const hoy = new Date().toISOString().slice(0, 10);
  return cuota.fechaLimite < hoy ? "vencida" : "pendiente";
}

// RF-32: recordatorio automatico antes del vencimiento. Simulamos
// esto como un calculo de "cuantos dias faltan", que la UI usa para
// decidir si mostrar un aviso o no - en vez de un correo real
// enviado por un job en el backend.
export function diasParaVencer(fechaLimite: string): number {
  const hoy = new Date();
  const limite = new Date(`${fechaLimite}T00:00:00`);
  const diferenciaMs = limite.getTime() - hoy.getTime();
  return Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
}