"use client";

import { useRegistroForm } from "./useRegistroForm";
import { AuthBrandPanel } from "@/components/AuthBrandPanel";
import { FormInput } from "@/components/FormInput";

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
      <AuthBrandPanel
        titulo="Tu conjunto residencial, organizado."
        subtitulo="Comunicación, visitas, reservas y administración en un solo lugar, para residentes, administradores y portería."
        patronVentanas={PATRON_VENTANAS}
      />

      <div className="flex w-full flex-col items-center justify-center px-6 py-16 md:w-1/2">
        <div className="w-full max-w-sm">
          <h2 className="font-display text-3xl font-semibold text-ink">
            Crear cuenta
          </h2>
          <p className="mt-2 text-sm text-ink/60">
            Regístrate para acceder a los servicios de tu conjunto.
          </p>

          <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
            <FormInput
              id="nombres"
              label="Nombres"
              placeholder="Ej: Juan Manuel"
              value={nombres}
              onChange={setNombres}
              error={errores.nombres}
            />
            <FormInput
              id="apellidos"
              label="Apellidos"
              placeholder="Ej: Ciro Rivera"
              value={apellidos}
              onChange={setApellidos}
              error={errores.apellidos}
            />
            <FormInput
              id="correo"
              label="Correo electrónico"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              value={correo}
              onChange={setCorreo}
              error={errores.correo}
            />
            <FormInput
              id="contrasena"
              label="Contraseña"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={contrasena}
              onChange={setContrasena}
              error={errores.contrasena}
            />

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