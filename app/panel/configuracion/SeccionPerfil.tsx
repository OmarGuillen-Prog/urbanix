"use client";

import { usePerfil } from "./usePerfil";
import { FormInput } from "@/components/FormInput";
import { ETIQUETAS_ROL } from "./etiquetas";

export function SeccionPerfil() {
  const {
    usuario, correo,
    nombres, setNombres,
    apellidos, setApellidos,
    telefono, setTelefono,
    foto,
    errores, errorFoto, guardando, guardado,
    handleElegirFoto, handleQuitarFoto, handleCancelar, handleSubmit,
  } = usePerfil();

  if (!usuario) return null;

  return (
    <section className="rounded-xl border border-line bg-white p-6">
      <h2 className="font-display text-lg font-semibold text-ink">Perfil</h2>

      {guardado && (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          ✓ Tu perfil se actualizó correctamente.
        </div>
      )}

      <div className="mt-5 flex items-center gap-4 border-b border-line pb-6">
        {foto ? (
          // Es una imagen en memoria (data URL): next/image no aplica, por eso <img>
          // eslint-disable-next-line @next/next/no-img-element
          <img src={foto} alt="Tu foto de perfil" className="h-16 w-16 rounded-full border border-line object-cover" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-2xl font-medium text-white">
            {usuario.nombres.charAt(0).toUpperCase()}
          </div>
        )}

        <div>
          <p className="font-medium text-ink">
            {usuario.nombres} {usuario.apellidos}
          </p>
          <p className="text-sm text-ink/60">{correo}</p>

          <div className="mt-1.5 flex items-center gap-3 text-sm">
            <label className="cursor-pointer font-medium text-brand focus-within:underline hover:text-brand-dark">
              Cambiar foto
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(evento) => {
                  const archivo = evento.target.files?.[0];
                  if (archivo) handleElegirFoto(archivo);
                  evento.target.value = "";
                }}
              />
            </label>
            {foto && (
              <button type="button" onClick={handleQuitarFoto} className="text-ink/50 hover:text-error">
                Quitar
              </button>
            )}
          </div>
          {errorFoto && <p className="mt-1 text-sm text-error">{errorFoto}</p>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex max-w-xl flex-col gap-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormInput id="nombres" label="Nombres" value={nombres} onChange={setNombres} error={errores.nombres} />
          <FormInput id="apellidos" label="Apellidos" value={apellidos} onChange={setApellidos} error={errores.apellidos} />
        </div>

        {/* El correo es el usuario de acceso y el rol lo asigna el administrador: aqui solo se consultan */}
        <div>
          <label htmlFor="correo" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
            Correo electrónico
          </label>
          <input
            id="correo"
            type="email"
            value={correo}
            readOnly
            className="w-full cursor-not-allowed rounded-lg border border-line bg-canvas px-3.5 py-2.5 text-ink/60"
          />
          <p className="mt-1 text-xs text-ink/40">Es tu usuario de acceso. Para cambiarlo, habla con la administración.</p>
        </div>

        <FormInput
          id="telefono"
          label="Teléfono"
          type="tel"
          placeholder="Ej: 300 123 4567"
          value={telefono}
          onChange={setTelefono}
          error={errores.telefono}
        />

        <div>
          <label htmlFor="rol" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
            Rol
          </label>
          <input
            id="rol"
            type="text"
            value={ETIQUETAS_ROL[usuario.rol]}
            readOnly
            className="w-full cursor-not-allowed rounded-lg border border-line bg-canvas px-3.5 py-2.5 text-ink/60"
          />
        </div>

        <div className="flex items-center gap-3 border-t border-line pt-5">
          <button
            type="submit"
            disabled={guardando}
            className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
          >
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>
          <button
            type="button"
            onClick={handleCancelar}
            className="rounded-lg border border-line px-4 py-2.5 text-sm font-medium text-ink/70 transition-colors hover:border-brand hover:text-brand"
          >
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
}