"use client";

import { useRegistroForm } from "./useRegistroForm";

// Patron fijo (no aleatorio) de "ventanas iluminadas" para la ilustracion
// del panel lateral. Usamos un patron fijo, no Math.random(), porque un
// valor aleatorio generaria un HTML distinto en el servidor vs. el
// navegador, y React marcaria eso como un error de "hydration".
const PATRON_VENTANAS = [
  1, 0, 0, 1, 0, 0,
  0, 0, 1, 0, 0, 1,
  0, 1, 0, 0, 1, 0,
  1, 0, 0, 1, 0, 0,
  0, 0, 1, 0, 0, 0,
  0, 1, 0, 0, 1, 1,
  1, 0, 0, 0, 0, 0,
  0, 0, 1, 1, 0, 1,
];

export default function RegistroPage() {
  const {
    nombres,
    setNombres,
    apellidos,
    setApellidos,
    correo,
    setCorreo,
    contrasena,
    setContrasena,
    errores,
    enviando,
    handleSubmit,
  } = useRegistroForm();

  return (
    <div className="flex min-h-screen bg-canvas font-sans text-ink">
      {/* PANEL IZQUIERDO: identidad de marca. Oculto en pantallas
          pequenas (md:flex) para no robarle espacio al formulario
          en celular, donde lo prioritario es completar el registro. */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-brand-dark p-12 md:flex">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/70">
            URBANIX
          </p>
          <h1 className="mt-6 max-w-sm font-display text-4xl font-semibold leading-tight text-white">
            Tu conjunto residencial, organizado.
          </h1>
          <p className="mt-4 max-w-sm text-white/70">
            Comunicación, visitas, reservas y administración en un solo
            lugar, para residentes, administradores y portería.
          </p>
        </div>

        {/* Elemento distintivo: fachada abstracta de edificio hecha con
            una cuadricula de divs. Algunas "ventanas" quedan iluminadas
            en dorado, evocando un edificio al anochecer. */}
        <div className="grid grid-cols-6 gap-3">
          {PATRON_VENTANAS.map((iluminada, indice) => (
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

      {/* PANEL DERECHO: el formulario en si */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-16 md:w-1/2">
        <div className="w-full max-w-sm">
          <h2 className="font-display text-3xl font-semibold text-ink">
            Crear cuenta
          </h2>
          <p className="mt-2 text-sm text-ink/60">
            Regístrate para acceder a los servicios de tu conjunto.
          </p>

          <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="nombres"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60"
              >
                Nombres
              </label>
              <input
                id="nombres"
                type="text"
                placeholder="Ej: Omar Daniel"
                value={nombres}
                onChange={(evento) => setNombres(evento.target.value)}
                className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink placeholder:text-ink/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
              {errores.nombres && (
                <p className="mt-1.5 text-sm text-error">{errores.nombres}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="apellidos"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60"
              >
                Apellidos
              </label>
              <input
                id="apellidos"
                type="text"
                placeholder="Ej: Guillen Roche"
                value={apellidos}
                onChange={(evento) => setApellidos(evento.target.value)}
                className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink placeholder:text-ink/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
              {errores.apellidos && (
                <p className="mt-1.5 text-sm text-error">{errores.apellidos}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="correo"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60"
              >
                Correo electrónico
              </label>
              <input
                id="correo"
                type="email"
                placeholder="tucorreo@ejemplo.com"
                value={correo}
                onChange={(evento) => setCorreo(evento.target.value)}
                className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink placeholder:text-ink/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
              {errores.correo && (
                <p className="mt-1.5 text-sm text-error">{errores.correo}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="contrasena"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60"
              >
                Contraseña
              </label>
              <input
                id="contrasena"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={contrasena}
                onChange={(evento) => setContrasena(evento.target.value)}
                className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink placeholder:text-ink/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
              {errores.contrasena && (
                <p className="mt-1.5 text-sm text-error">{errores.contrasena}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={enviando}
              className="mt-2 rounded-lg bg-brand px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
            >
              {enviando ? "Verificando..." : "Registrarme"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}