"use client";

import Link from "next/link";
import { useLoginForm } from "./useLoginForm";
import { AuthLayout } from "@/components/AuthLayout";
import { FormInput } from "@/components/FormInput";

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
  const { correo, setCorreo, contrasena, setContrasena, errores, enviando, handleSubmit } = useLoginForm();

  return (
    <AuthLayout
      titulo="Bienvenido de nuevo."
      subtitulo="Ingresa para revisar comunicados, reservar zonas comunes y gestionar tu propiedad."
      patronVentanas={PATRON_VENTANAS}
    >
      <h2 className="font-display text-3xl font-semibold text-ink">Iniciar sesión</h2>
      <p className="mt-2 text-sm text-ink/60">Ingresa tus credenciales para acceder a tu cuenta.</p>

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
        <FormInput
          id="contrasena"
          label="Contraseña"
          type="password"
          placeholder="Tu contraseña"
          value={contrasena}
          onChange={setContrasena}
          error={errores.contrasena}
        />

        <div className="-mt-2 text-right">
          <Link href="/recuperar" className="text-sm text-brand hover:text-brand-dark">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {errores.general && <p className="text-sm text-error">{errores.general}</p>}

        <button
          type="submit"
          disabled={enviando}
          className="mt-2 rounded-lg bg-brand px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
        >
          {enviando ? "Verificando..." : "Ingresar"}
        </button>
      </form>

      {/* Nuevo: enlace para quien aun no tiene cuenta */}
      <p className="mt-6 text-center text-sm text-ink/60">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="font-medium text-brand hover:text-brand-dark">
          Regístrate
        </Link>
      </p>
    </AuthLayout>
  );
}