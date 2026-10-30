interface PaginacionProps {
  paginaActual: number;
  totalPaginas: number;
  resumen: string; // ej: "Mostrando 6 de 38 tickets"
  onCambiar: (pagina: number) => void;
}

export function Paginacion({ paginaActual, totalPaginas, resumen, onCambiar }: PaginacionProps) {
  const numeros = Array.from({ length: totalPaginas }, (_, i) => i + 1);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 text-sm">
      <p className="text-ink/60">{resumen}</p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onCambiar(paginaActual - 1)}
          disabled={paginaActual <= 1}
          className="rounded-lg border border-line px-3 py-1.5 text-ink/70 transition-colors hover:border-brand disabled:cursor-not-allowed disabled:opacity-40"
        >
          Anterior
        </button>

        {numeros.map((numero) => (
          <button
            key={numero}
            onClick={() => onCambiar(numero)}
            className={
              numero === paginaActual
                ? "rounded-lg bg-brand px-3 py-1.5 font-medium text-white"
                : "rounded-lg border border-line px-3 py-1.5 text-ink/70 transition-colors hover:border-brand"
            }
          >
            {numero}
          </button>
        ))}

        <button
          onClick={() => onCambiar(paginaActual + 1)}
          disabled={paginaActual >= totalPaginas}
          className="rounded-lg border border-line px-3 py-1.5 text-ink/70 transition-colors hover:border-brand disabled:cursor-not-allowed disabled:opacity-40"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}