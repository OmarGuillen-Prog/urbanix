"use client";

import { useAuth } from "@/context/AuthContext";
import { useCambiarContrasena } from "./useCambiarContrasena";
import { FormInput } from "@/components/FormInput";

// Traduce el valor interno del rol (usado en el codigo) a una
// etiqueta legible para el usuario final - separar el "valor tecnico"
// de su "texto de presentacion" es una buena costumbre.
const ETIQUETAS_ROL: Record<string, string> = {
  administrador: "Administrador",
  residente: "Residente",
  portero: "Portero",
};

export default function PerfilPage() {
  const { usuario } = useAuth();

  const { actual, setActual, nueva, setNueva, confirmar, setConfirmar, errores, guardando, exito, handleSubmit } =
  useCambiarContrasena();

  // Guardia defensiva: en la practica, el layout de /panel ya
  // garantiza que "usuario" existe aqui. Este chequeo extra es solo
  // para que TypeScript no se queje de que "usuario" podria ser null,
  // y para evitar una pantalla en blanco por una fraccion de segundo.
  if (!usuario) return null;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">
        Mi perfil
      </h1>
      <p className="mt-1 text-ink/60">
        Información asociada a tu cuenta en URBANIX.
      </p>

      <div className="mt-8 max-w-lg rounded-xl border border-line bg-white p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-2xl font-medium text-white">
            {usuario.nombres.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-ink">
              {usuario.nombres} {usuario.apellidos}
            </p>
            <span className="mt-1 inline-block rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium capitalize text-brand">
              {ETIQUETAS_ROL[usuario.rol]}
            </span>
          </div>
        </div>

        {/* dl/dt/dd: una lista de definiciones - la etiqueta HTML
            semanticamente correcta para pares "etiqueta: valor",
            como los datos de un perfil. */}
        <dl className="mt-8 flex flex-col gap-4 border-t border-line pt-6">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink/40">
              Nombres
            </dt>
            <dd className="mt-1 text-sm text-ink">{usuario.nombres}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink/40">
              Apellidos
            </dt>
            <dd className="mt-1 text-sm text-ink">{usuario.apellidos}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink/40">
              Correo electrónico
            </dt>
            <dd className="mt-1 text-sm text-ink">{usuario.correo}</dd>
          </div>
        </dl>
      </div>
      {/* HU-42: cambiar contraseña */}
      <div className="mt-6 max-w-lg rounded-xl border border-line bg-white p-8">
        <p className="font-display text-lg font-semibold text-ink">Cambiar contraseña</p>

        {exito && (
          <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            ✓ Tu contraseña se actualizó correctamente.
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <FormInput
            id="actual"
            label="Contraseña actual"
            type="password"
            value={actual}
            onChange={setActual}
            error={errores.actual}
          />
          <FormInput
            id="nueva"
            label="Nueva contraseña"
            type="password"
            placeholder="Mínimo 8 caracteres"
            value={nueva}
            onChange={setNueva}
            error={errores.nueva}
          />
          <FormInput
            id="confirmar"
            label="Confirmar nueva contraseña"
            type="password"
            value={confirmar}
            onChange={setConfirmar}
            error={errores.confirmar}
          />

          <button
            type="submit"
            disabled={guardando}
            className="mt-2 rounded-lg bg-brand px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
          >
            {guardando ? "Guardando..." : "Actualizar contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}