"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEditarUsuario } from "./useEditarUsuario";
import { FormInput } from "@/components/FormInput";
import type { Rol } from "@/context/AuthContext";

export default function EditarUsuarioPage() {
  // useParams lee los segmentos dinamicos de la URL actual.
  // Como la carpeta se llama "[id]", aqui aparece como params.id.
  const params = useParams<{ id: string }>();

  const {
    usuarioExiste,
    nombres,
    setNombres,
    apellidos,
    setApellidos,
    correo,
    setCorreo,
    telefono,
    setTelefono,
    rol,
    setRol,
    estado,
    setEstado,
    errores,
    guardando,
    handleSubmit,
  } = useEditarUsuario(params.id);

  // Caso borde: alguien escribe una URL con un id que no existe
  // (ej: /panel/usuarios/999)
  if (!usuarioExiste) {
    return (
      <div>
        <p className="text-ink/60">Usuario no encontrado.</p>
        <Link href="/panel/usuarios" className="mt-4 inline-block text-brand hover:text-brand-dark">
          ← Volver al listado
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/panel/usuarios" className="text-sm text-ink/60 hover:text-brand">
        ← Volver al listado
      </Link>

      <h1 className="mt-4 font-display text-3xl font-semibold text-ink">
        Editar usuario
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 flex max-w-lg flex-col gap-5">
        <FormInput id="nombres" label="Nombres" value={nombres} onChange={setNombres} error={errores.nombres} />
        <FormInput id="apellidos" label="Apellidos" value={apellidos} onChange={setApellidos} error={errores.apellidos} />
        <FormInput id="correo" label="Correo electrónico" type="email" value={correo} onChange={setCorreo} error={errores.correo} />
        <FormInput id="telefono" label="Teléfono" value={telefono} onChange={setTelefono} />

        {/* Un <select> no tiene un equivalente directo en FormInput
            (que fue diseñado para <input>), asi que aqui lo armamos
            a mano, reutilizando el mismo estilo visual */}
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

        <div>
          <label htmlFor="estado" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
            Estado
          </label>
          <select
            id="estado"
            value={estado}
            onChange={(evento) => setEstado(evento.target.value as "activo" | "inactivo")}
            className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={guardando}
          className="mt-2 rounded-lg bg-brand px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
        >
          {guardando ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}