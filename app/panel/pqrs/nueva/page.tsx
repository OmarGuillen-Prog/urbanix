"use client";

import Link from "next/link";
import { usePQRSForm } from "./usePQRSForm";
import { FormInput } from "@/components/FormInput";

export default function NuevaPQRSPage() {
  const { asunto, setAsunto, descripcion, setDescripcion, errores, guardando, handleSubmit } = usePQRSForm();

  return (
    <div>
      <Link href="/panel/pqrs" className="text-sm text-ink/60 hover:text-brand">
        ← Volver al listado
      </Link>

      <h1 className="mt-4 font-display text-3xl font-semibold text-ink">
        Nueva PQRS
      </h1>
      <p className="mt-1 text-ink/60">
        Cuéntanos tu petición, queja, reclamo o sugerencia.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex max-w-lg flex-col gap-5">
        <FormInput
          id="asunto"
          label="Asunto"
          placeholder="Ej: Fuga de agua en el pasillo"
          value={asunto}
          onChange={setAsunto}
          error={errores.asunto}
        />

        {/* Un textarea no es un <input>, asi que no podemos usar
            FormInput aqui - lo armamos a mano con el mismo estilo. */}
        <div>
          <label htmlFor="descripcion" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
            Descripción
          </label>
          <textarea
            id="descripcion"
            rows={5}
            placeholder="Describe con detalle la situación..."
            value={descripcion}
            onChange={(evento) => setDescripcion(evento.target.value)}
            className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink placeholder:text-ink/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
          {errores.descripcion && (
            <p className="mt-1.5 text-sm text-error">{errores.descripcion}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={guardando}
          className="mt-2 rounded-lg bg-brand px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
        >
          {guardando ? "Enviando..." : "Enviar PQRS"}
        </button>
      </form>
    </div>
  );
}