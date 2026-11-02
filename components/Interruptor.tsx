// Un "switch" de encendido/apagado (como los de la referencia de Configuracion)

interface InterruptorProps {
  activo: boolean;
  onCambiar: (nuevoValor: boolean) => void;
  etiqueta: string; // lo lee un lector de pantalla: "Comunicados"
  deshabilitado?: boolean;
}

export function Interruptor({ activo, onCambiar, etiqueta, deshabilitado = false }: InterruptorProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={activo}
      aria-label={etiqueta}
      disabled={deshabilitado}
      onClick={() => onCambiar(!activo)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:cursor-not-allowed disabled:opacity-60 ${
        activo ? "bg-brand" : "bg-zinc-300"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
          activo ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}