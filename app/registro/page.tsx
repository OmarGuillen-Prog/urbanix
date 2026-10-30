"use client";

import Link from "next/link";
import { useRegistroForm } from "./useRegistroForm";
import { AuthLayout } from "@/components/AuthLayout";
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
    nombres, setNombres,
    apellidos, setApellidos,
    correo, setCorreo,
    telefono, setTelefono,
    numeroUnidad, setNumeroUnidad,
    contrasena, setContrasena,
    confirmarContrasena, setConfirmarContrasena,
    errores,
    enviando,
    handleSubmit,
  } = useRegistroForm();

  return (
    <AuthLayout
      titulo="Tu conjunto residencial, organizado."
      subtitulo="Comunicación, visitas, reservas y administración en un solo lugar, para residentes, administradores y portería."
      patronVentanas={PATRON_VENTANAS}
    >
      <h2 className="font-display text-3xl font-semibold text-ink">Crear cuenta</h2>
      <p className="mt-2 text-sm text-ink/60">Regístrate para acceder a los servicios de tu conjunto.</p>

      <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
        <FormInput id="nombres" label="Nombres" placeholder="Ej: Juan Manuel" value={nombres} onChange={setNombres} error={errores.nombres} />
        <FormInput id="apellidos" label="Apellidos" placeholder="Ej: Ciro Rivera" value={apellidos} onChange={setApellidos} error={errores.apellidos} />
        <FormInput id="correo" label="Correo electrónico" type="email" placeholder="tucorreo@ejemplo.com" value={correo} onChange={setCorreo} error={errores.correo} />
        <FormInput id="telefono" label="Teléfono" type="tel" placeholder="Ej: 3001234567" value={telefono} onChange={setTelefono} error={errores.telefono} />
        <FormInput id="numeroUnidad" label="Número de unidad / apartamento" placeholder="Ej: Torre A - 101" value={numeroUnidad} onChange={setNumeroUnidad} error={errores.numeroUnidad} />
        <FormInput id="contrasena" label="Contraseña" type="password" placeholder="Mínimo 8 caracteres" value={contrasena} onChange={setContrasena} error={errores.contrasena} />
        <FormInput id="confirmarContrasena" label="Confirmar contraseña" type="password" placeholder="Repite la contraseña" value={confirmarContrasena} onChange={setConfirmarContrasena} error={errores.confirmarContrasena} />

        <button
          type="submit"
          disabled={enviando}
          className="mt-2 rounded-lg bg-brand px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
        >
          {enviando ? "Verificando..." : "Registrarme"}
        </button>
      </form>

      {/* Nuevo: enlace de vuelta al login, simetrico al que agregaste
          en /login apuntando hacia aca */}
      <p className="mt-6 text-center text-sm text-ink/60">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-medium text-brand hover:text-brand-dark">
          Inicia sesión
        </Link>
      </p>
    </AuthLayout>
  );
}