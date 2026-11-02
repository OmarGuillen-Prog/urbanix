// Calculos del Panel Principal. NO guarda nada: lee los demas stores y resume (igual que estadisticasStore).
import { obtenerUsuarios } from "./usuariosStore";
import { obtenerPropiedades } from "./propiedadesStore";
import { obtenerParqueaderos, estadoDeParqueadero } from "./parqueaderosStore";
import { obtenerTodasLasPQRS, obtenerPQRSPorUsuario, type PQRS } from "./pqrsStore";
import { obtenerTodasLasReservas, type Reserva } from "./reservasStore";
import { obtenerTodasLasVisitas, obtenerVisitasPorResidente } from "./visitasStore";
import { obtenerCuotasPorPropiedad, estadoVisual, resumenDeCuotas } from "./cuotasStore";
import { variacionPorcentual } from "./estadisticasStore";
import { mesEnMeses, etiquetaMes, hoyLocal } from "./fechas";

// ---------- Utilidades ----------
// "2026-11-25" -> "25 de nov"
export function etiquetaFecha(fecha: string): string {
  return new Date(`${fecha}T00:00:00`).toLocaleDateString("es-CO", { day: "numeric", month: "short" });
}

// "2026-11-25" + "14:00" -> "25 de nov · 14:00"
export function etiquetaFechaHora(fecha: string, hora: string): string {
  return `${etiquetaFecha(fecha)} · ${hora}`;
}

// Las reservas que todavia no han empezado (sin las canceladas), la mas cercana primero
export function proximasReservaciones(reservas: Reserva[], limite: number): Reserva[] {
  const ahora = Date.now();

  return reservas
    .filter((r) => r.estado !== "cancelada" && new Date(`${r.fecha}T${r.horaInicio}:00`).getTime() >= ahora)
    .sort((a, b) => `${a.fecha} ${a.horaInicio}`.localeCompare(`${b.fecha} ${b.horaInicio}`))
    .slice(0, limite);
}

// Las ultimas solicitudes creadas, la mas reciente primero
export function pqrsRecientes(lista: PQRS[], limite: number): PQRS[] {
  return [...lista].sort((a, b) => b.fechaCreacion.localeCompare(a.fechaCreacion)).slice(0, limite);
}

// ---------- Administrador ----------
export interface ResumenAdministrador {
  residentesActivos: number;
  residentesInactivos: number;
  propiedades: number;
  propiedadesOcupadas: number;
  pqrsAbiertas: number;
  pqrsAltaPrioridad: number;
}

export function resumenAdministrador(): ResumenAdministrador {
  const residentes = obtenerUsuarios().filter((u) => u.rol === "residente");
  const propiedades = obtenerPropiedades();
  const pqrsAbiertas = obtenerTodasLasPQRS().filter((p) => p.estado !== "resuelto");

  return {
    residentesActivos: residentes.filter((u) => u.estado === "activo").length,
    residentesInactivos: residentes.filter((u) => u.estado === "inactivo").length,
    propiedades: propiedades.length,
    propiedadesOcupadas: propiedades.filter((p) => p.estadoOcupacion === "ocupado").length,
    pqrsAbiertas: pqrsAbiertas.length,
    pqrsAltaPrioridad: pqrsAbiertas.filter((p) => p.prioridad === "alta").length,
  };
}

export interface ResumenParqueadero {
  total: number;
  ocupados: number;
  disponibles: number;
  reservados: number;
  porcentajeOcupacion: number; // 0 a 100
}

export function resumenParqueadero(): ResumenParqueadero {
  const estados = obtenerParqueaderos().map(estadoDeParqueadero);
  const total = estados.length;
  const ocupados = estados.filter((e) => e === "ocupado").length;

  return {
    total,
    ocupados,
    disponibles: estados.filter((e) => e === "disponible").length,
    reservados: estados.filter((e) => e === "reservado").length,
    porcentajeOcupacion: total === 0 ? 0 : Math.round((ocupados / total) * 100),
  };
}

export interface PuntoActividad {
  mes: string; // "2026-11"
  etiqueta: string; // "nov"
  reservaciones: number;
  visitas: number;
}

// Cifras de EJEMPLO de los 5 meses anteriores (del mas antiguo al mas reciente). Este sistema de prueba no guarda cada
// visita y reserva de esos meses, asi que las representamos asi. Con backend, esto saldria de la base de datos.
const HISTORIAL_ACTIVIDAD = [
  { reservaciones: 7, visitas: 16 },
  { reservaciones: 8, visitas: 19 },
  { reservaciones: 9, visitas: 21 },
  { reservaciones: 9, visitas: 20 },
  { reservaciones: 10, visitas: 23 },
];

// Los ultimos 6 meses. El mes en curso se cuenta con los registros REALES (y aun no ha terminado).
export function serieActividad(): PuntoActividad[] {
  const visitas = obtenerTodasLasVisitas();
  const reservas = obtenerTodasLasReservas().filter((r) => r.estado !== "cancelada");
  const puntos: PuntoActividad[] = [];

  for (let atras = HISTORIAL_ACTIVIDAD.length; atras >= 0; atras--) {
    const mes = mesEnMeses(atras);

    if (atras > 0) {
      puntos.push({ mes, etiqueta: etiquetaMes(mes), ...HISTORIAL_ACTIVIDAD[HISTORIAL_ACTIVIDAD.length - atras] });
    } else {
      puntos.push({
        mes,
        etiqueta: etiquetaMes(mes),
        reservaciones: reservas.filter((r) => r.fecha.startsWith(mes)).length,
        visitas: visitas.filter((v) => v.fechaVisita.startsWith(mes)).length,
      });
    }
  }
  return puntos;
}

// Cambio de la actividad total entre los dos ultimos meses COMPLETOS (el mes en curso no se compara: aun no termina)
export function variacionActividad(serie: PuntoActividad[]): number | null {
  if (serie.length < 3) return null;
  const total = (p: PuntoActividad) => p.reservaciones + p.visitas;

  const ultimoCompleto = serie[serie.length - 2];
  const anterior = serie[serie.length - 3];
  return variacionPorcentual(total(ultimoCompleto), total(anterior));
}

// ---------- Residente ----------
export interface ResumenResidente {
  porPagar: number; // pesos: cuotas pendientes + vencidas de sus propiedades
  cuotasVencidas: number;
  pqrsAbiertas: number;
  pqrsResueltas: number;
  visitasEsperadasHoy: number;
  visitasEnConjunto: number;
}

export function resumenResidente(correo: string): ResumenResidente {
  const usuario = obtenerUsuarios().find((u) => u.correo === correo);

  // Cuotas de las propiedades donde es propietario O arrendatario
  const propiedades = usuario
    ? obtenerPropiedades().filter((p) => p.idPropietario === usuario.id || p.idArrendatario === usuario.id)
    : [];
  const cuotas = propiedades.flatMap((p) => obtenerCuotasPorPropiedad(p.id));
  const dinero = resumenDeCuotas(cuotas);

  const pqrs = obtenerPQRSPorUsuario(correo);
  const visitas = obtenerVisitasPorResidente(correo);
  const hoy = hoyLocal();

  return {
    porPagar: dinero.pendiente + dinero.vencido,
    cuotasVencidas: cuotas.filter((c) => estadoVisual(c) === "vencida").length,
    pqrsAbiertas: pqrs.filter((p) => p.estado !== "resuelto").length,
    pqrsResueltas: pqrs.filter((p) => p.estado === "resuelto").length,
    visitasEsperadasHoy: visitas.filter((v) => v.fechaVisita === hoy && v.estado === "pendiente").length,
    visitasEnConjunto: visitas.filter((v) => v.estado === "en_conjunto").length,
  };
}

// ---------- Portero ----------
export function resumenPortero() {
  const hoy = hoyLocal();
  const deHoy = obtenerTodasLasVisitas().filter((v) => v.fechaVisita === hoy);

  return {
    total: deHoy.length,
    esperadas: deHoy.filter((v) => v.estado === "pendiente").length,
    enConjunto: deHoy.filter((v) => v.estado === "en_conjunto").length,
    completadas: deHoy.filter((v) => v.estado === "finalizada").length,
    // Lo que hay que atender, en el orden en que llegan
    porAtender: deHoy
      .filter((v) => v.estado === "pendiente")
      .sort((a, b) => a.horaEstimada.localeCompare(b.horaEstimada)),
    // Quienes estan adentro ahora mismo (de cualquier dia: alguien podria seguir dentro)
    dentro: obtenerTodasLasVisitas().filter((v) => v.estado === "en_conjunto"),
  };
}