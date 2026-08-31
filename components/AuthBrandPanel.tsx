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
    <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-brand-dark p-12 md:flex">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/70">
          URBANIX
        </p>
        <h1 className="mt-6 max-w-sm font-display text-4xl font-semibold leading-tight text-white">
          {titulo}
        </h1>
        <p className="mt-4 max-w-sm text-white/70">{subtitulo}</p>
      </div>

      <div className="grid grid-cols-6 gap-3">
        {patronVentanas.map((iluminada, indice) => (
          <div
            key={indice}
            className={
              iluminada === 1
                ? "aspect-square rounded-sm bg-gold shadow-[0_0_12px_rgba(201,154,60,0.5)]"
                : "aspect-square rounded-sm bg-white/10"
            }
          />
        ))}
      </div>
    </div>
  );
}