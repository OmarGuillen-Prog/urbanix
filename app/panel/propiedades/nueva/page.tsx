"use client";

import Link from "next/link";
import { useRegistrarPropiedad } from "./useRegistrarPropiedad";
import { FormInput } from "@/components/FormInput";

export default function NuevaPropiedadPage() {
  const { numero, setNumero, torre, setTorre, tipo, setTipo, area, setArea, errores, guardando, handleSubmit } =
    useRegistrarPropiedad();

  return (
    <div>
      <Link href="/panel/propiedades" className="text-sm text-ink/60 hover:text-brand">
        ← Volver al listado
      </Link>

      <h1 className="mt-4 font-display text-3xl font-semibold text-ink">
        Registrar propiedad
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 flex max-w-lg flex-col gap-5">
        <FormInput
          id="numero"
          label="Número de propiedad"
          placeholder="Ej: 101"
          value={numero}
          onChange={setNumero}
          error={errores.numero}
        />
        <FormInput
          id="torre"
          label="Torre / Bloque"
          placeholder="Ej: A"
          value={torre}
          onChange={setTorre}
          error={errores.torre}
        />

        <div>
          <label htmlFor="tipo" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
            Tipo
          </label>
          <select
            id="tipo"
            value={tipo}
            onChange={(evento) => setTipo(evento.target.value as "apartamento" | "casa" | "local")}
            className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          >
            <option value="apartamento">Apartamento</option>
            <option value="casa">Casa</option>
            <option value="local">Local comercial</option>
          </select>
        </div>

        <FormInput
          id="area"
          label="Área (m²)"
          type="number"
          placeholder="Ej: 68"
          value={area}
          onChange={setArea}
          error={errores.area}
        />

        <button
          type="submit"
          disabled={guardando}
          className="mt-2 rounded-lg bg-brand px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
        >
          {guardando ? "Guardando..." : "Registrar propiedad"}
        </button>
      </form>
    </div>
  );
}