"use client";

import Link from "next/link";
import { useUsuariosLista } from "./useUsuariosLista";

const ETIQUETAS_ROL: Record<string, string> = {
  administrador: "Administrador",
  residente: "Residente",
  portero: "Portero",
};

export default function UsuariosPage() {
  const { busqueda, setBusqueda, usuariosFiltrados, handleEliminar } = useUsuariosLista();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Usuarios
          </h1>
          <p className="mt-1 text-ink/60">
            {usuariosFiltrados.length} usuario(s) encontrado(s)
          </p>
        </div>
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre o correo..."
        value={busqueda}
        onChange={(evento) => setBusqueda(evento.target.value)}
        className="mt-6 w-full max-w-sm rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink placeholder:text-ink/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
      />

      <div className="mt-6 overflow-hidden rounded-xl border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-canvas">
            <tr>
              <th className="px-4 py-3 font-medium text-ink/60">Nombre</th>
              <th className="px-4 py-3 font-medium text-ink/60">Correo</th>
              <th className="px-4 py-3 font-medium text-ink/60">Rol</th>
              <th className="px-4 py-3 font-medium text-ink/60">Estado</th>
              <th className="px-4 py-3 font-medium text-ink/60">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink/40">
                  No se encontraron usuarios con ese criterio de búsqueda.
                </td>
              </tr>
            ) : (
              usuariosFiltrados.map((usuario) => (
                <tr key={usuario.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink">
                    {usuario.nombres} {usuario.apellidos}
                  </td>
                  <td className="px-4 py-3 text-ink/70">{usuario.correo}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand">
                      {ETIQUETAS_ROL[usuario.rol]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        usuario.estado === "activo"
                          ? "rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700"
                          : "rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-500"
                      }
                    >
                      {usuario.estado === "activo" ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/panel/usuarios/${usuario.id}`}
                        className="text-sm font-medium text-brand hover:text-brand-dark"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() =>
                          handleEliminar(usuario.id, `${usuario.nombres} ${usuario.apellidos}`)
                        }
                        className="text-sm font-medium text-error hover:text-error/70"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}