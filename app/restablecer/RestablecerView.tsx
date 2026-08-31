"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRestablecerForm } from "./useRestablecerForm";
import { AuthBrandPanel } from "@/components/AuthBrandPanel";
import { FormInput } from "@/components/FormInput";

const PATRON_VENTANAS = [
  0, 0, 1, 0, 1, 0,
  1, 0, 0, 1, 0, 0,
  0, 1, 0, 0, 0, 1,
  0, 0, 1, 0, 1, 0,
  1, 0, 0, 0, 0, 1,
  0, 1, 0, 1, 0, 0,
  0, 0, 0, 1, 0, 1,
  1, 0, 1, 0, 0, 0,
];

export function RestablecerView() {
  // useSearchParams lee los parametros de la URL actual.
  // .get("token") devuelve el valor de ?token=... o null si no existe.
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const {
    tokenValido,
    nuevaContrasena,
    setNuevaContrasena,
    confirmarContrasena,
    setConfirmarContrasena,
    errores,
    enviando,
    completado,
    handleSubmit,
  } = useRestablecerForm(token);

  // Caso 1: no hay token o ya expiro/no existe
  if (!tokenValido) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-6 text-center font-sans text-ink">
        <h2 className="font-display text-2xl font-semibold">
          Enlace inválido o expirado
        </h2>
        <p className="mt-2 max-w-sm text-ink/60">
          Este enlace de recuperación ya no es válido. Solicita uno nuevo.
        </p>
        <Link
          href="/recuperar"
          className="mt-6 rounded-lg bg-brand px-4 py-2.5 font-medium text-white hover:bg-brand-dark"
        >
          Solicitar nuevo enlace
        </Link>
      </div>
    );
  }

  // Caso 2: ya se cambio la contraseña con exito
  if (completado) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-6 text-center font-sans text-ink">
        <h2 className="font-display text-2xl font-semibold">
          Contraseña actualizada
        </h2>
        <p className="mt-2 max-w-sm text-ink/60">
          Ya puedes iniciar sesión con tu nueva contraseña.
        </p>
        <Link
          href="/login"
          className="mt-6 rounded-lg bg-brand px-4 py-2.5 font-medium text-white hover:bg-brand-dark"
        >
          Ir a iniciar sesión
        </Link>
      </div>
    );
  }

  // Caso 3: token valido, mostramos el formulario
  return (
    <div className="flex min-h-screen bg-canvas font-sans text-ink">
      <AuthBrandPanel
        titulo="Crea una nueva contraseña."
        subtitulo="Elige una contraseña segura que no hayas usado antes."
        patronVentanas={PATRON_VENTANAS}
      />

      <div className="flex w-full flex-col items-center justify-center px-6 py-16 md:w-1/2">
        <div className="w-full max-w-sm">
          <h2 className="font-display text-3xl font-semibold text-ink">
            Restablecer contraseña
          </h2>
          <p className="mt-2 text-sm text-ink/60">
            Ingresa tu nueva contraseña dos veces para confirmarla.
          </p>

          <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
            <FormInput
              id="nuevaContrasena"
              label="Nueva contraseña"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={nuevaContrasena}
              onChange={setNuevaContrasena}
              error={errores.nuevaContrasena}
            />
            <FormInput
              id="confirmarContrasena"
              label="Confirmar contraseña"
              type="password"
              placeholder="Repite la contraseña"
              value={confirmarContrasena}
              onChange={setConfirmarContrasena}
              error={errores.confirmarContrasena}
            />

            <button
              type="submit"
              disabled={enviando}
              className="mt-2 rounded-lg bg-brand px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
            >
              {enviando ? "Guardando..." : "Guardar nueva contraseña"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}