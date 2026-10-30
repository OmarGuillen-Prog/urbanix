export interface ResumenNivel {
  nivel: number;
  total: number;
  ocupados: number;
  disponibles: number;
  reservados: number;
  porcentaje: number; // % de ocupacion, de 0 a 100
}

export function ResumenNiveles({ niveles }: { niveles: ResumenNivel[] }) {
  return (
    <section className="mt-6 rounded-xl border border-line bg-white p-5">
      <h2 className="font-display text-lg font-semibold text-ink">Resumen por nivel</h2>

      <div className="mt-4 flex flex-col gap-3">
        {niveles.map((n) => (
          <div key={n.nivel} className="rounded-lg border border-line p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-ink">Nivel {n.nivel}</p>
              <p className="text-xs text-ink/50">{n.total} espacios totales</p>
            </div>

            <div className="mt-3 grid grid-cols-3 text-center">
              <div>
                <p className="font-display text-xl font-semibold text-error">{n.ocupados}</p>
                <p className="text-xs text-ink/50">Ocupados</p>
              </div>
              <div>
                <p className="font-display text-xl font-semibold text-emerald-600">{n.disponibles}</p>
                <p className="text-xs text-ink/50">Disponibles</p>
              </div>
              <div>
                <p className="font-display text-xl font-semibold text-gold">{n.reservados}</p>
                <p className="text-xs text-ink/50">Reservados</p>
              </div>
            </div>

            {/* El ancho es un valor DINAMICO, por eso va en style y no en una clase de Tailwind */}
            <div
              role="progressbar"
              aria-valuenow={n.porcentaje}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Ocupación del nivel ${n.nivel}`}
              className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-100"
            >
              <div className="h-full rounded-full bg-brand" style={{ width: `${n.porcentaje}%` }} />
            </div>
            <p className="mt-1 text-xs text-ink/50">{n.porcentaje}% de ocupación</p>
          </div>
        ))}
      </div>
    </section>
  );
}