// Ayudantes de fechas en HORARIO LOCAL, compartidos por Reservas y Visitas.

// "YYYY-MM-DD" de hoy. El locale en-CA entrega justo ese formato.
// Evitamos toISOString() porque usa UTC y, pasadas las 7pm en Colombia,
// ya devolveria el dia siguiente.
export function hoyLocal(): string {
  return new Date().toLocaleDateString("en-CA");
}

// "YYYY-MM-DD" de hoy +/- N dias (para datos de ejemplo que nunca se "vencen")
export function fechaEnDias(dias: number): string {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + dias);
  return fecha.toLocaleDateString("en-CA");
}

// Fecha ISO completa de una hora local ("14:35") en un dia relativo a hoy
export function fechaHoraEnDias(dias: number, hora: string): string {
  return new Date(`${fechaEnDias(dias)}T${hora}:00`).toISOString();
}

// "YYYY-MM-DD" del dia "dia" del mes que esta "mesesAtras" meses antes del actual.
// Ponemos primero el dia 1 para evitar saltos raros (ej: 31 de marzo - 1 mes).
export function fechaEnMeses(mesesAtras: number, dia: number): string {
  const fecha = new Date();
  fecha.setDate(1);
  fecha.setMonth(fecha.getMonth() - mesesAtras);
  fecha.setDate(dia);
  return fecha.toLocaleDateString("en-CA");
}

// "YYYY-MM" del mes que esta "mesesAtras" meses antes del actual
export function mesEnMeses(mesesAtras: number): string {
  return fechaEnMeses(mesesAtras, 1).slice(0, 7);
}

// "2026-10" -> "oct"
export function etiquetaMes(mes: string): string {
  return new Date(`${mes}-01T00:00:00`).toLocaleDateString("es-CO", { month: "short" }).replace(".", "");
}