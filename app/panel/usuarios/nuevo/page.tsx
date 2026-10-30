// app/panel/usuarios/nuevo/page.tsx
"use client";

import Link from "next/link";
import { useCrearUsuario } from "./useCrearUsuario";
import { FormInput } from "@/components/FormInput";
import type { Rol } from "@/context/AuthContext";

export default function NuevoUsuarioPage() {
  const {
    nombres, setNombres,
    apellidos, setApellidos,
    correo, setCorreo,
    telefono, setTelefono,
    documento, setDocumento,
    rol, setRol,
    errores,
    guardando,
    handleSubmit,
  } = useCrearUsuario();

  return (
    <div>
      <Link href="/panel/usuarios" className="text-sm text-ink/60 hover:text-brand">
        ← Volver al listado
      </Link>

      <h1 className="mt-4 font-display text-3xl font-semibold text-ink">
        Nuevo usuario
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 flex max-w-lg flex-col gap-5">
        <FormInput id="nombres" label="Nombres" value={nombres} onChange={setNombres} error={errores.nombres} />
        <FormInput id="apellidos" label="Apellidos" value={apellidos} onChange={setApellidos} error={errores.apellidos} />
        <FormInput id="correo" label="Correo electrónico" type="email" value={correo} onChange={setCorreo} error={errores.correo} />
        <FormInput id="telefono" label="Teléfono" type="tel" value={telefono} onChange={setTelefono} />
        <FormInput id="documento" label="Documento de identidad" value={documento} onChange={setDocumento} />

        <div>
          <label htmlFor="rol" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
            Rol
          </label>
          <select
            id="rol"
            value={rol}
            onChange={(evento) => setRol(evento.target.value as Rol)}
            className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          >
            <option value="administrador">Administrador</option>
            <option value="residente">Residente</option>
            <option value="portero">Portero</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={guardando}
          className="mt-2 rounded-lg bg-brand px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
        >
          {guardando ? "Guardando..." : "Crear usuario"}
        </button>
      </form>
    </div>
  );
}