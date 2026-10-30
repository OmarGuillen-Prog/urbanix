// lib/reportesStore.ts
// Calculos de las estadisticas. NO guarda nada: lee los demas stores y resume.
import { obtenerTodasLasCuotas } from "./cuotasStore";
import { obtenerNomina } from "./nominaStore";
import { obtenerUsuarios } from "./usuariosStore";
import { obtenerTodasLasVisitas, type TipoVisita } from "./visitasStore";
import { obtenerTodasLasReservas, obtenerZonas } from "./reservasStore";
import { obtenerTodasLasPQRS } from "./pqrsStore";
import { mesEnMeses, etiquetaMes } from "./fechas";

function suma(valores: number[]): number {
  return valores.reduce((acumulado, valor) => acumulado + valor, 0);
}

export interface PuntoMensual {
  mes: string; // "2026-10"
  etiqueta: string; // "oct"
  facturado: number; // lo que se cobro en cuotas ese mes
  ingresos: number; // lo que SI se recaudo (cuotas pagadas)
  gastos: number; // nomina registrada ese mes
  neto: number; // ingresos - gastos
  tasaRecaudo: number; // % recaudado sobre lo facturado
}

// Serie de los ultimos N meses, del mas antiguo al mas reciente
export function serieMensual(meses = 6): PuntoMensual[] {
  const cuotas = obtenerTodasLasCuotas();
  const nomina = obtenerNomina();
  const puntos: PuntoMensual[] = [];

  for (let atras = meses - 1; atras >= 0; atras--) {
    const mes = mesEnMeses(atras);

    // Una cuota "pertenece" al mes de su fecha limite (el periodo que cobra)
    const cuotasDelMes = cuotas.filter((c) => c.fechaLimite.startsWith(mes));
    const facturado = suma(cuotasDelMes.map((c) => c.valor));
    const ingresos = suma(cuotasDelMes.filter((c) => c.estadoPago === "pagada").map((c) => c.valor));
    const gastos = suma(nomina.filter((r) => r.fechaPago.startsWith(mes)).map((r) => r.salario));

    puntos.push({
      mes,
      etiqueta: etiquetaMes(mes),
      facturado,
      ingresos,
      gastos,
      neto: ingresos - gastos,
      tasaRecaudo: facturado === 0 ? 0 : (ingresos / facturado) * 100,
    });
  }
  return puntos;
}

// Cambio porcentual entre dos periodos. null si no hay base para comparar.
export function variacionPorcentual(actual: number, anterior: number): number | null {
  if (anterior === 0) return null;
  return ((actual - anterior) / Math.abs(anterior)) * 100;
}

// "Desglose de gastos": la nomina de un mes, agrupada por cargo
export function desgloseNominaDelMes(mes: string): { nombre: string; valor: number }[] {
  const porCargo = new Map<string, number>();

  for (const registro of obtenerNomina().filter((r) => r.fechaPago.startsWith(mes))) {
    porCargo.set(registro.cargo, (porCargo.get(registro.cargo) ?? 0) + registro.salario);
  }
  return [...porCargo.entries()].map(([nombre, valor]) => ({ nombre, valor }));
}

const ETIQUETAS_TIPO_VISITA: Record<TipoVisita, string> = {
  visitante: "Visitante",
  domicilio: "Domicilio",
  servicio: "Servicio",
};

// RF-69: estadisticas de usuarios, visitas y reservas
export function estadisticasOperativas(mes: string) {
  const visitas = obtenerTodasLasVisitas();
  const reservasVigentes = obtenerTodasLasReservas().filter((r) => r.estado !== "cancelada");

  return {
    usuariosActivos: obtenerUsuarios().filter((u) => u.estado === "activo").length,
    visitasDelMes: visitas.filter((v) => v.fechaVisita.startsWith(mes)).length,
    reservasDelMes: reservasVigentes.filter((r) => r.fecha.startsWith(mes)).length,
    pqrsAbiertas: obtenerTodasLasPQRS().filter((p) => p.estado !== "resuelto").length,
    reservasPorZona: obtenerZonas().map((zona) => ({
      nombre: zona.nombre,
      reservas: reservasVigentes.filter((r) => r.idZona === zona.id).length,
    })),
    visitasPorTipo: (Object.keys(ETIQUETAS_TIPO_VISITA) as TipoVisita[])
      .map((tipo) => ({ nombre: ETIQUETAS_TIPO_VISITA[tipo], valor: visitas.filter((v) => v.tipo === tipo).length }))
      .filter((p) => p.valor > 0),
  };
}