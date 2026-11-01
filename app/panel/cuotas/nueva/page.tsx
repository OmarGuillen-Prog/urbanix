"use client";

import Link from "next/link";
import { useRegistrarCuota } from "./useRegistrarCuota";
import { FormInput } from "@/components/FormInput";

export default function NuevaCuotaPage() {
  const {
    esAdministrador,
    propiedades,
    idPropiedad, setIdPropiedad,
    valor, setValor,
    descripcion, setDescripcion,
    fechaLimite, setFechaLimite,
    errores, guardando, handleSubmit,
  } = useRegistrarCuota();

  const enlaceVolver = (
    <Link href="/panel/cuotas" className="text-sm text-ink/60 hover:text-brand">
      ← Volver a cuotas
    </Link>
  );

  // HU-18: solo el administrador registra cuotas (la seguridad real vive en el backend)
  if (!esAdministrador) {
    return (
      <div>
        {enlaceVolver}
        <p className="mt-4 text-ink/60">No tienes permiso para acceder a esta sección.</p>
      </div>
    );
  }

  return (
    <div>
      {enlaceVolver}

      <h1 className="mt-4 font-display text-3xl font-semibold text-ink">Registrar cuota</h1>
      <p className="mt-1 text-ink/60">
        Los residentes de la propiedad recibirán una notificación con el valor y la fecha límite.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex max-w-lg flex-col gap-5">
        <div>
          <label htmlFor="propiedad" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
            Propiedad
          </label>
          <select
            id="propiedad"
            value={idPropiedad}
            onChange={(evento) => setIdPropiedad(evento.target.value)}
            className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          >
            {propiedades.map((propiedad) => (
              <option key={propiedad.id} value={propiedad.id}>
                Torre {propiedad.torre} - {propiedad.numero}
              </option>
            ))}
          </select>
        </div>

        <FormInput
          id="descripcion"
          label="Concepto"
          placeholder="Ej: Administración - Diciembre"
          value={descripcion}
          onChange={setDescripcion}
          error={errores.descripcion}
        />
        <FormInput
          id="valor"
          label="Valor (COP)"
          type="number"
          placeholder="Ej: 850000"
          value={valor}
          onChange={setValor}
          error={errores.valor}
        />
        <FormInput
          id="fechaLimite"
          label="Fecha límite de pago"
          type="date"
          value={fechaLimite}
          onChange={setFechaLimite}
          error={errores.fechaLimite}
        />

        <button
          type="submit"
          disabled={guardando}
          className="mt-2 rounded-lg bg-brand px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
        >
          {guardando ? "Guardando..." : "Registrar cuota"}
        </button>
      </form>
    </div>
  );
}