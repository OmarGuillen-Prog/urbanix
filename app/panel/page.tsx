// Datos de ejemplo (hardcodeados) - representan lo que en el futuro
// vendra del backend real via una llamada a la API. La estructura de
// esta pantalla no deberia cambiar mucho cuando eso pase, solo cambia
// de donde sale el numero.
const ESTADISTICAS = [
  { etiqueta: "Usuarios registrados", valor: 128 },
  { etiqueta: "Propiedades", valor: 64 },
  { etiqueta: "PQRS pendientes", valor: 7 },
  { etiqueta: "Reservas de hoy", valor: 12 },
];

export default function PanelPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">
        Bienvenido a URBANIX
      </h1>
      <p className="mt-1 text-ink/60">
        Resumen general de tu conjunto residencial.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ESTADISTICAS.map((item) => (
          <div
            key={item.etiqueta}
            className="rounded-xl border border-line bg-white p-6"
          >
            <p className="text-sm text-ink/60">{item.etiqueta}</p>
            <p className="mt-2 font-display text-3xl font-semibold text-brand">
              {item.valor}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-dashed border-line bg-white p-6">
        <p className="text-sm font-medium uppercase tracking-wide text-ink/40">
          Nota de desarrollo
        </p>
        <p className="mt-2 text-sm text-ink/60">
          Estas estadísticas son datos de ejemplo. Se conectarán al
          backend real más adelante, y este panel comenzará a mostrar
          contenido distinto según el rol del usuario (administrador,
          residente o portero) una vez implementemos el manejo de sesión.
        </p>
      </div>
    </div>
  );
}