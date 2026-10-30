"use client";

import { useAuth } from "@/context/AuthContext";
import { serieMensual, variacionPorcentual, desgloseNominaDelMes, estadisticasOperativas } from "@/lib/estadisticasStore";
import type { Tendencia } from "@/components/ResumenTarjetas";

const MESES_DE_HISTORIAL = 6;

// Cambio porcentual contra el mes anterior.
// "buenoSiSube": para los ingresos subir es bueno; para los gastos, no.
function crearTendencia(actual: number, anterior: number, buenoSiSube: boolean): Tendencia | undefined {
  const variacion = variacionPorcentual(actual, anterior);
  if (variacion === null) return undefined; // sin base de comparacion
  if (Math.abs(variacion) < 0.05) return { texto: "Sin cambios", direccion: "igual", bueno: true };

  const sube = variacion > 0;
  return {
    texto: `${sube ? "+" : ""}${variacion.toFixed(1)}%`,
    direccion: sube ? "sube" : "baja",
    bueno: sube === buenoSiSube,
  };
}

// La tasa de recaudo ya ES un porcentaje: se compara en PUNTOS, no en %
function tendenciaEnPuntos(actual: number, anterior: number): Tendencia {
  const diferencia = actual - anterior;
  if (Math.abs(diferencia) < 0.05) return { texto: "Sin cambios", direccion: "igual", bueno: true };

  const sube = diferencia > 0;
  return { texto: `${sube ? "+" : ""}${diferencia.toFixed(1)} pts`, direccion: sube ? "sube" : "baja", bueno: sube };
}

export function useReportes() {
  const { usuario } = useAuth();

  // Todo se CALCULA en el render, sin useState ni useEffect:
  // son datos derivados de los stores (la leccion de HU-03).
  const serie = serieMensual(MESES_DE_HISTORIAL);
  const actual = serie[serie.length - 1];
  const anterior = serie[serie.length - 2];

  // "Generar reporte": arma un CSV en el navegador y lo descarga (sin backend)
  function generarReporte() {
    const encabezado = ["Mes", "Facturado", "Ingresos (recaudado)", "Gastos (nomina)", "Neto", "Tasa de recaudo (%)"];
    const filas = serie.map((punto) => [
      punto.mes,
      punto.facturado,
      punto.ingresos,
      punto.gastos,
      punto.neto,
      punto.tasaRecaudo.toFixed(1).replace(".", ","), // coma decimal, como lo espera Excel en Colombia
    ]);

    // Separador ";" porque en Excel en espanol la coma es el separador decimal
    const contenido = [encabezado, ...filas].map((fila) => fila.join(";")).join("\r\n");

    // "\uFEFF" al inicio: le avisa a Excel que el archivo es UTF-8 (tildes y ñ se ven bien)
    const archivo = new Blob(["\uFEFF" + contenido], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(archivo);

    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = `reporte-urbanix-${actual.mes}.csv`;
    enlace.click();

    URL.revokeObjectURL(url);
  }

  return {
    esAdministrador: usuario?.rol === "administrador",
    serie,
    actual,
    tendencias: {
      ingresos: crearTendencia(actual.ingresos, anterior.ingresos, true),
      gastos: crearTendencia(actual.gastos, anterior.gastos, false),
      neto: crearTendencia(actual.neto, anterior.neto, true),
      tasaRecaudo: tendenciaEnPuntos(actual.tasaRecaudo, anterior.tasaRecaudo),
    },
    desgloseGastos: desgloseNominaDelMes(actual.mes),
    operativas: estadisticasOperativas(actual.mes),
    generarReporte,
  };
}