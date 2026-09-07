"use client";

import Link from "next/link";
import { useCrearComunicado } from "./useCrearComunicado";
import { FormInput } from "@/components/FormInput";

export default function NuevoComunicadoPage() {
  const { titulo, setTitulo, contenido, setContenido, errores, guardando, handleSubmit } = useCrearComunicado();

  return (
    <div>
      <Link href="/panel/comunicados" className="text-sm text-ink/60 hover:text-brand">
        ← Volver al listado
      </Link>

      <h1 className="mt-4 font-display text-3xl font-semibold text-ink">
        Nuevo comunicado
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 flex max-w-lg flex-col gap-5">
        <FormInput
          id="titulo"
          label="Título"
          placeholder="Ej: Mantenimiento de ascensores"
          value={titulo}
          onChange={setTitulo}
          error={errores.titulo}
        />

        <div>
          <label htmlFor="contenido" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
            Contenido
          </label>
          <textarea
            id="contenido"
            rows={6}
            placeholder="Escribe el comunicado..."
            value={contenido}
            onChange={(evento) => setContenido(evento.target.value)}
            className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink placeholder:text-ink/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
          {errores.contenido && <p className="mt-1.5 text-sm text-error">{errores.contenido}</p>}
        </div>

        <button
          type="submit"
          disabled={guardando}
          className="mt-2 rounded-lg bg-brand px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
        >
          {guardando ? "Publicando..." : "Publicar comunicado"}
        </button>
      </form>
    </div>
  );
}