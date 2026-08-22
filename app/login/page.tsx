"use client";

import { useLoginForm } from "./useLoginForm";

// Mismo patron fijo de "ventanas" que en Registro, para mantener
// consistencia visual entre ambas pantallas de autenticacion.
const PATRON_VENTANAS = [
  0, 1, 0, 0, 1, 0,
  1, 0, 0, 1, 0, 0,
  0, 0, 1, 0, 0, 1,
  0, 1, 0, 0, 1, 0,
  1, 0, 0, 0, 0, 1,
  0, 0, 1, 1, 0, 0,
  0, 1, 0, 0, 0, 1,
  1, 0, 0, 1, 1, 0,
];

export default function LoginPage() {
  const {
    correo,
    setCorreo,
    contrasena,
    setContrasena,
    errores,
    enviando,
    handleSubmit,
  } = useLoginForm();

  return (
    <div className="flex min-h-screen bg-canvas font-sans text-ink">
      {/* PANEL IZQUIERDO: identidad de marca (igual estructura que Registro,
          para que el usuario sienta continuidad visual entre pantallas) */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-brand-dark p-12 md:flex">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/70">
            URBANIX
          </p>
          <h1 className="mt-6 max-w-sm font-display text-4xl font-semibold leading-tight text-white">
            Bienvenido de nuevo.
          </h1>
          <p className="mt-4 max-w-sm text-white/70">
            Ingresa para revisar comunicados, reservar zonas comunes y
            gestionar tu propiedad.
          </p>
        </div>

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

      {/* PANEL DERECHO: formulario */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-16 md:w-1/2">
        <div className="w-full max-w-sm">
          <h2 className="font-display text-3xl font-semibold text-ink">
            Iniciar sesión
          </h2>
          <p className="mt-2 text-sm text-ink/60">
            Ingresa tus credenciales para acceder a tu cuenta.
          </p>

          <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
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
                placeholder="Tu contraseña"
                value={contrasena}
                onChange={(evento) => setContrasena(evento.target.value)}
                className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink placeholder:text-ink/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
              {errores.contrasena && (
                <p className="mt-1.5 text-sm text-error">{errores.contrasena}</p>
              )}
            </div>

            {/* Este error es "general", no pertenece a un campo especifico -
                por eso vive fuera de los divs de cada input. */}
            {errores.general && (
              <p className="text-sm text-error">{errores.general}</p>
            )}

            <button
              type="submit"
              disabled={enviando}
              className="mt-2 rounded-lg bg-brand px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
            >
              {enviando ? "Verificando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}