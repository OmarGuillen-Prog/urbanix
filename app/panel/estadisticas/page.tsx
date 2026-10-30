"use client";

import Link from "next/link";
import { useReportes } from "./useReportes";
import { ResumenTarjetas } from "@/components/ResumenTarjetas";
import { TarjetaGrafico, GraficoBarras, GraficoTorta, GraficoLinea, PALETA } from "@/components/Graficos";
import { formatearMoneda, formatearMonedaCorta } from "@/lib/formatos";

export default function ReportesPage() {
  const { esAdministrador, serie, actual, tendencias, desgloseGastos, operativas, generarReporte } = useReportes();

  // HU-40: modulo exclusivo del administrador (la seguridad real vive en el backend)
  if (!esAdministrador) {
    return (
      <div>
        <p className="text-ink/60">No tienes permiso para acceder a esta sección.</p>
        <Link href="/panel" className="mt-4 inline-block text-brand hover:text-brand-dark">
          ← Volver al panel
        </Link>
      </div>
    );
  }

  // Los graficos reciben listas simples de datos, ya listas para dibujar
  const datosMensuales = serie.map((punto) => ({
    mes: punto.etiqueta,
    ingresos: punto.ingresos,
    gastos: punto.gastos,
  }));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Reportes y estadísticas</h1>
          <p className="mt-1 text-ink/60">Consulta reportes financieros y operacionales</p>
        </div>

        <button
          onClick={generarReporte}
          className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          Generar reporte
        </button>
      </div>

      {/* ---------- Financiero ---------- */}
      <ResumenTarjetas
        items={[
          { etiqueta: "Ingresos del mes", valor: formatearMonedaCorta(actual.ingresos), icono: "💰", tono: "verde", tendencia: tendencias.ingresos },
          { etiqueta: "Gastos del mes", valor: formatearMonedaCorta(actual.gastos), icono: "🧾", tono: "rojo", tendencia: tendencias.gastos },
          { etiqueta: "Ingreso neto", valor: formatearMonedaCorta(actual.neto), icono: "📈", tono: "brand", tendencia: tendencias.neto },
          { etiqueta: "Tasa de recaudo", valor: `${actual.tasaRecaudo.toFixed(1)}%`, icono: "🎯", tono: "dorado", tendencia: tendencias.tasaRecaudo },
        ]}
      />

      {/* min-w-0: sin esto, un hijo de grid no se encoge por debajo del ancho de su contenido
          y el grafico se quedaria "atascado" al achicar la ventana. */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="min-w-0 lg:col-span-3">
          <TarjetaGrafico titulo="Ingresos vs gastos">
            <GraficoBarras
              datos={datosMensuales}
              claveX="mes"
              series={[
                { clave: "ingresos", nombre: "Ingresos (recaudo)", color: PALETA[0] },
                { clave: "gastos", nombre: "Gastos (nómina)", color: PALETA[2] },
              ]}
              formatoEje={formatearMonedaCorta}
              formatoTooltip={formatearMoneda}
            />
          </TarjetaGrafico>
        </div>

        <div className="min-w-0 lg:col-span-2">
          <TarjetaGrafico titulo="Desglose de gastos (nómina del mes)">
            <GraficoTorta datos={desgloseGastos} formatoTooltip={formatearMoneda} />
          </TarjetaGrafico>
        </div>
      </div>

      <div className="mt-6 min-w-0">
        <TarjetaGrafico titulo="Tendencia de ingresos (6 meses)">
          <GraficoLinea
            datos={datosMensuales}
            claveX="mes"
            claveY="ingresos"
            nombre="Ingresos"
            formatoEje={formatearMonedaCorta}
            formatoTooltip={formatearMoneda}
          />
        </TarjetaGrafico>
      </div>

      {/* ---------- Operativo (RF-69: usuarios, visitas y reservas) ---------- */}
      <h2 className="mt-10 font-display text-xl font-semibold text-ink">Actividad del conjunto</h2>

      <ResumenTarjetas
        items={[
          { etiqueta: "Usuarios activos", valor: operativas.usuariosActivos, icono: "👥", tono: "brand" },
          { etiqueta: "Visitas del mes", valor: operativas.visitasDelMes, icono: "🚪", tono: "verde" },
          { etiqueta: "Reservas del mes", valor: operativas.reservasDelMes, icono: "📅", tono: "dorado" },
          { etiqueta: "PQRS abiertas", valor: operativas.pqrsAbiertas, icono: "💬", tono: "gris" },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="min-w-0">
          <TarjetaGrafico titulo="Reservas por zona">
            <GraficoBarras
              datos={operativas.reservasPorZona}
              claveX="nombre"
              series={[{ clave: "reservas", nombre: "Reservas", color: PALETA[0] }]}
              enteros
            />
          </TarjetaGrafico>
        </div>

        <div className="min-w-0">
          <TarjetaGrafico titulo="Visitas por tipo">
            <GraficoTorta datos={operativas.visitasPorTipo} />
          </TarjetaGrafico>
        </div>
      </div>
    </div>
  );
}