"use client";

import { useSeguridad } from "./useSeguridad";
import { useCambiarContrasena } from "../perfil/useCambiarContrasena";
import { FormInput } from "@/components/FormInput";
import { OPCIONES_INACTIVIDAD } from "@/lib/configuracionStore";

export function SeccionSeguridad() {
  const { minutosInactividad, handleCambiarMinutos } = useSeguridad();
  // Reutilizamos la logica de HU-42 que ya existe: no se escribe dos veces
  const { actual, setActual, nueva, setNueva, confirmar, setConfirmar, errores, guardando, exito, handleSubmit } =
    useCambiarContrasena();

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-xl border border-line bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-ink">Cambiar contraseña</h2>

        {exito && (
          <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            ✓ Tu contraseña se actualizó correctamente.
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 flex max-w-md flex-col gap-4">
          <FormInput id="actual" label="Contraseña actual" type="password" value={actual} onChange={setActual} error={errores.actual} />
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
            className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
          >
            {guardando ? "Guardando..." : "Actualizar contraseña"}
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-line bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-ink">Cierre de sesión automático</h2>
        <p className="mt-1 text-sm text-ink/60">
          Si pasas este tiempo sin usar la plataforma, tu sesión se cierra sola para proteger tu cuenta.
        </p>

        <label htmlFor="inactividad" className="mt-4 block text-xs font-medium uppercase tracking-wide text-ink/60">
          Tiempo de inactividad
        </label>
        <select
          id="inactividad"
          value={minutosInactividad}
          onChange={(evento) => handleCambiarMinutos(Number(evento.target.value))}
          className="mt-1.5 w-full max-w-xs rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        >
          {OPCIONES_INACTIVIDAD.map((minutos) => (
            <option key={minutos} value={minutos}>
              {minutos} minutos
            </option>
          ))}
        </select>
      </section>
    </div>
  );
}