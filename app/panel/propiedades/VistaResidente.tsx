"use client";

import Link from "next/link";
import { usePropiedadesResidente } from "./usePropiedadesResidente";
import { FichaPropiedadCard } from "./FichaPropiedadCard";

// Atajos a lo que mas hace un residente (cada uno lleva a una pantalla que ya existe)
const ACCESOS_RAPIDOS = [
  { href: "/panel/reservas/nueva", icono: "📅", titulo: "Reservar una zona", detalle: "Zonas comunes del conjunto" },
  { href: "/panel/visitas/nueva", icono: "🚪", titulo: "Registrar una visita", detalle: "Avisa a la portería" },
  { href: "/panel/reportes/nuevo", icono: "🛠️", titulo: "Reportar un daño", detalle: "Con fotos de evidencia" },
  { href: "/panel/pqrs/nueva", icono: "💬", titulo: "Enviar una PQRS", detalle: "Peticiones, quejas y sugerencias" },
];

export function VistaResidente() {
  const { fichas, unidadSolicitada } = usePropiedadesResidente();

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">{fichas.length > 1 ? "Mis propiedades" : "Mi propiedad"}</h1>
      <p className="mt-1 text-ink/60">Todo lo de tu unidad en un solo lugar.</p>

      {fichas.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-line bg-white p-8 text-center">
          <p className="text-4xl" aria-hidden="true">
            🏠
          </p>
          <p className="mt-3 font-medium text-ink">Aún no tienes una propiedad asociada</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-ink/60">
            {unidadSolicitada
              ? `Al registrarte indicaste la unidad ${unidadSolicitada}. La administración debe asignártela; cuando lo haga, aparecerá aquí.`
              : "Cuando la administración te asigne una unidad, aparecerá aquí."}
          </p>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-6">
          {fichas.map((ficha) => (
            <FichaPropiedadCard key={ficha.propiedad.id} ficha={ficha} />
          ))}
        </div>
      )}

      <h2 className="mt-10 font-display text-lg font-semibold text-ink">Accesos rápidos</h2>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ACCESOS_RAPIDOS.map((acceso) => (
          <Link
            key={acceso.href}
            href={acceso.href}
            className="flex items-center gap-3 rounded-xl border border-line bg-white p-4 transition-colors hover:border-brand hover:bg-brand/5"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-xl" aria-hidden="true">
              {acceso.icono}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink">{acceso.titulo}</p>
              <p className="truncate text-xs text-ink/50">{acceso.detalle}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}