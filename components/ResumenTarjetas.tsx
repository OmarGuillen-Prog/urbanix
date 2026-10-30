// Fila de tarjetas de resumen reutilizable para las pantallas principales del panel.

type Tono = "brand" | "verde" | "dorado" | "gris" | "rojo";

// Comparacion con el periodo anterior (ej: "▲ +9.1%")
export interface Tendencia {
  texto: string;
  direccion: "sube" | "baja" | "igual";
  bueno: boolean; // true = verde, false = rojo (que SUBA un gasto es "malo")
}

export interface ItemResumen {
  etiqueta: string;
  valor: number | string;
  icono: string;
  tono: Tono;
  tendencia?: Tendencia;
}

const ESTILOS_TONO: Record<Tono, { fondoIcono: string; textoValor: string }> = {
  brand: { fondoIcono: "bg-brand/10", textoValor: "text-brand" },
  verde: { fondoIcono: "bg-emerald-100", textoValor: "text-emerald-600" },
  dorado: { fondoIcono: "bg-gold/15", textoValor: "text-gold" },
  gris: { fondoIcono: "bg-zinc-100", textoValor: "text-ink" },
  rojo: { fondoIcono: "bg-error/10", textoValor: "text-error" },
};

const FLECHAS = { sube: "▲", baja: "▼", igual: "–" };

export function ResumenTarjetas({ items }: { items: ItemResumen[] }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.etiqueta} className="flex items-center gap-4 rounded-xl border border-line bg-white p-5">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xl ${ESTILOS_TONO[item.tono].fondoIcono}`}
          >
            {item.icono}
          </div>
          <div className="min-w-0">
            <p className="text-sm text-ink/60">{item.etiqueta}</p>
            <p className={`font-display text-2xl font-semibold ${ESTILOS_TONO[item.tono].textoValor}`}>{item.valor}</p>
            {item.tendencia && (
              <p
                className={`mt-0.5 text-xs font-medium ${
                  item.tendencia.direccion === "igual"
                    ? "text-ink/40"
                    : item.tendencia.bueno
                      ? "text-emerald-600"
                      : "text-error"
                }`}
              >
                {FLECHAS[item.tendencia.direccion]} {item.tendencia.texto}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}