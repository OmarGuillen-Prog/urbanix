"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  LineChart,
  Line,
} from "recharts";
import type { ReactNode } from "react";

// Colores de marca para los graficos
export const PALETA = ["#1f6f5c", "#c99a3c", "#b3261e", "#6fb3a0", "#14493d", "#8b6f2e"];

const COLOR_EJES = "#6b7280";
const COLOR_REJILLA = "#e5e7eb";

export function TarjetaGrafico({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-line bg-white p-5">
      <h2 className="font-display text-lg font-semibold text-ink">{titulo}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function SinDatos() {
  return <p className="py-16 text-center text-sm text-ink/40">Aún no hay datos para mostrar.</p>;
}

export interface SerieGrafico {
  clave: string;
  nombre: string;
  color: string;
}

interface GraficoBarrasProps {
  datos: object[];
  claveX: string;
  series: SerieGrafico[];
  formatoEje?: (valor: number) => string;
  formatoTooltip?: (valor: number) => string;
  enteros?: boolean; // true = el eje Y solo muestra numeros enteros (conteos)
}

export function GraficoBarras({ datos, claveX, series, formatoEje, formatoTooltip, enteros }: GraficoBarrasProps) {
  if (datos.length === 0) return <SinDatos />;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={datos} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={COLOR_REJILLA} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey={claveX} stroke={COLOR_EJES} fontSize={12} tickLine={false} />
        <YAxis
          allowDecimals={!enteros}
          stroke={COLOR_EJES}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(valor) => (formatoEje ? formatoEje(Number(valor)) : String(valor))}
        />
        <Tooltip formatter={(valor) => (formatoTooltip ? formatoTooltip(Number(valor)) : String(valor))} />
        {series.length > 1 && <Legend />}
        {series.map((serie) => (
          <Bar key={serie.clave} dataKey={serie.clave} name={serie.nombre} fill={serie.color} radius={[4, 4, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export interface PorcionTorta {
  nombre: string;
  valor: number;
}

export function GraficoTorta({ datos, formatoTooltip }: { datos: PorcionTorta[]; formatoTooltip?: (valor: number) => string }) {
  if (datos.length === 0) return <SinDatos />;

  // Cada porcion lleva su color en el campo "fill" del propio dato
  // (el componente <Cell> esta obsoleto en las versiones nuevas de Recharts).
  const datosConColor = datos.map((porcion, indice) => ({ ...porcion, fill: PALETA[indice % PALETA.length] }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={datosConColor} dataKey="valor" nameKey="nombre" innerRadius={50} outerRadius={90} paddingAngle={2} />
        <Tooltip formatter={(valor) => (formatoTooltip ? formatoTooltip(Number(valor)) : String(valor))} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

interface GraficoLineaProps {
  datos: object[];
  claveX: string;
  claveY: string;
  nombre: string;
  color?: string;
  formatoEje?: (valor: number) => string;
  formatoTooltip?: (valor: number) => string;
}

export function GraficoLinea({ datos, claveX, claveY, nombre, color = PALETA[0], formatoEje, formatoTooltip }: GraficoLineaProps) {
  if (datos.length === 0) return <SinDatos />;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={datos} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={COLOR_REJILLA} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey={claveX} stroke={COLOR_EJES} fontSize={12} tickLine={false} />
        <YAxis
          stroke={COLOR_EJES}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(valor) => (formatoEje ? formatoEje(Number(valor)) : String(valor))}
        />
        <Tooltip formatter={(valor) => (formatoTooltip ? formatoTooltip(Number(valor)) : String(valor))} />
        <Line type="monotone" dataKey={claveY} name={nombre} stroke={color} strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}