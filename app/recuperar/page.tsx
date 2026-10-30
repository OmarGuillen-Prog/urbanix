"use client";

import Link from "next/link";
import { useRecuperarForm } from "./useRecuperarForm";
import { AuthLayout } from "@/components/AuthLayout";
import { FormInput } from "@/components/FormInput";

const PATRON_VENTANAS = [
  1, 0, 0, 0, 1, 0,
  0, 1, 0, 0, 0, 1,
  0, 0, 1, 1, 0, 0,
  1, 0, 0, 0, 1, 0,
  0, 0, 1, 0, 0, 1,
  0, 1, 0, 0, 1, 0,
  1, 0, 0, 1, 0, 0,
  0, 0, 0, 1, 0, 1,
];

export default function RecuperarPage() {
  const { correo, setCorreo, errores, enviando, enviado, enlaceSimulado, handleSubmit } = useRecuperarForm();

  return (
    <AuthLayout
      titulo="¿Olvidaste tu contraseña?"
      subtitulo="Tranquilo, te ayudamos a recuperar el acceso a tu cuenta en un par de pasos."
      patronVentanas={PATRON_VENTANAS}
    >
      {!enviado ? (
        <>
          <h2 className="font-display text-3xl font-semibold text-ink">Recuperar contraseña</h2>
          <p className="mt-2 text-sm text-ink/60">Ingresa tu correo y te enviaremos un enlace para restablecerla.</p>

          <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
            <FormInput
              id="correo"
              label="Correo electrónico"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              value={correo}
              onChange={setCorreo}
              error={errores.correo}
            />

            <button
              type="submit"
              disabled={enviando}
              className="mt-2 rounded-lg bg-brand px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
            >
              {enviando ? "Enviando..." : "Enviar enlace"}
            </button>
          </form>

          <Link href="/login" className="mt-6 inline-block text-sm text-ink/60 hover:text-brand">
            ← Volver a iniciar sesión
          </Link>
        </>
      ) : (
        <>
          <h2 className="font-display text-3xl font-semibold text-ink">Revisa tu correo</h2>
          <p className="mt-2 text-sm text-ink/60">
            Si <strong>{correo}</strong> está registrado, te enviamos un enlace para restablecer tu contraseña.
          </p>

          <div className="mt-6 rounded-lg border border-dashed border-line bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-ink/40">
              Modo desarrollo — simulación de correo
            </p>
            <Link href={enlaceSimulado} className="mt-2 block break-all text-sm text-brand underline">
              {enlaceSimulado}
            </Link>
          </div>
        </>
      )}
    </AuthLayout>
  );
}