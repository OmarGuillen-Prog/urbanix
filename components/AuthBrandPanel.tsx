// Panel de marca para pantallas de autenticacion (login, registro,
// recuperar contraseña...). No genera datos propios - solo presenta
// lo que le llega por props. Esto se llama "componente de presentacion".

interface AuthBrandPanelProps {
  titulo: string;
  subtitulo: string;
  patronVentanas: number[];
}

export function AuthBrandPanel({
  titulo,
  subtitulo,
  patronVentanas,
}: AuthBrandPanelProps) {
  return (
    <div className="relative hidden h-full w-1/3 flex-col overflow-hidden bg-brand-dark p-8 md:flex">
      <div className="shrink-0">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/70">
          URBANIX
        </p>
        <h1 className="mt-4 max-w-sm font-display text-3xl font-semibold leading-tight text-white">
          {titulo}
        </h1>
        <p className="mt-3 max-w-sm text-sm text-white/70">{subtitulo}</p>
      </div>

      <div className="mt-6 grid min-h-0 flex-1 grid-cols-6 grid-rows-[repeat(8,1fr)] gap-1.5">
        {patronVentanas.map((iluminada, indice) => (
          <div
            key={indice}
            className={
              iluminada === 1
                ? "rounded-sm bg-gold shadow-[0_0_12px_rgba(201,154,60,0.5)]"
                : "rounded-sm bg-white/10"
            }
          />
        ))}
      </div>
    </div>
  );
}