"use client";

import { useConjunto } from "./useConjunto";
import { FormInput } from "@/components/FormInput";
import { LIMITES_RECORDATORIO } from "@/lib/configuracionStore";

export function SeccionConjunto() {
  const {
    esAdministrador,
    nombre, setNombre,
    direccion, setDireccion,
    ciudad, setCiudad,
    telefonoPorteria, setTelefonoPorteria,
    correoContacto, setCorreoContacto,
    diasRecordatorio, setDiasRecordatorio,
    errores, guardando, guardado, handleSubmit,
  } = useConjunto();

  // Solo el administrador configura el conjunto (la seguridad real vive en el backend)
  if (!esAdministrador) {
    return (
      <section className="rounded-xl border border-line bg-white p-6">
        <p className="text-ink/60">No tienes permiso para acceder a esta sección.</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-line bg-white p-6">
      <h2 className="font-display text-lg font-semibold text-ink">Datos y parámetros del conjunto</h2>

      {guardado && (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          ✓ La configuración del conjunto se guardó correctamente.
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 flex max-w-xl flex-col gap-5">
        <FormInput id="nombreConjunto" label="Nombre del conjunto" value={nombre} onChange={setNombre} error={errores.nombre} />
        <FormInput id="direccion" label="Dirección" value={direccion} onChange={setDireccion} error={errores.direccion} />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormInput id="ciudad" label="Ciudad" value={ciudad} onChange={setCiudad} />
          <FormInput id="telefonoPorteria" label="Teléfono de portería" type="tel" value={telefonoPorteria} onChange={setTelefonoPorteria} />
        </div>

        <FormInput
          id="correoContacto"
          label="Correo de contacto"
          type="email"
          value={correoContacto}
          onChange={setCorreoContacto}
          error={errores.correoContacto}
        />

        <div className="border-t border-line pt-5">
          <p className="font-medium text-ink">Cobro de cuotas</p>
          <div className="mt-3">
            <FormInput
              id="diasRecordatorio"
              label="Días de anticipación para recordar un pago"
              type="number"
              placeholder={`Entre ${LIMITES_RECORDATORIO.minimo} y ${LIMITES_RECORDATORIO.maximo}`}
              value={diasRecordatorio}
              onChange={setDiasRecordatorio}
              error={errores.diasRecordatorio}
            />
            <p className="mt-1 text-xs text-ink/40">
              El botón &quot;Enviar recordatorios&quot; de Cuotas avisa de las cuotas vencidas y de las que vencen dentro de este
              número de días.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={guardando}
          className="self-start rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
        >
          {guardando ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </section>
  );
}