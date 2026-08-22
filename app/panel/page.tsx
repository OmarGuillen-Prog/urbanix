// Pantalla temporal - la construiremos de verdad cuando lleguemos
// a las historias de usuario del dashboard. Por ahora, solo confirma
// que el login redirige correctamente (criterio de aceptacion #3 de HU-02).

export default function PanelPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas font-sans text-ink">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand">
        URBANIX
      </p>
      <h1 className="mt-4 font-display text-3xl font-semibold">
        Panel principal
      </h1>
      <p className="mt-2 text-ink/60">
        Próximamente: aquí tendremos el dashboard real.
      </p>
    </div>
  );
}