"use client";

import Link from "next/link";
import { useReportarDano } from "./useReportarDano";
import { FormInput } from "@/components/FormInput";
import { MAX_EVIDENCIAS, MAX_MB_POR_EVIDENCIA } from "@/lib/reportesStore";

export default function NuevoReportePage() {
  const {
    titulo, setTitulo,
    ubicacion, setUbicacion,
    descripcion, setDescripcion,
    evidencias,
    handleArchivosChange,
    quitarEvidencia,
    errores, guardando, handleSubmit,
  } = useReportarDano();

  return (
    <div>
      <Link href="/panel/reportes" className="text-sm text-ink/60 hover:text-brand">
        ← Volver al listado
      </Link>

      <h1 className="mt-4 font-display text-3xl font-semibold text-ink">Nuevo reporte de daño</h1>
      <p className="mt-1 text-ink/60">
        Cuéntanos qué pasó y dónde. La administración definirá la prioridad y te mantendrá al tanto de la reparación.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex max-w-lg flex-col gap-5">
        <FormInput
          id="titulo"
          label="Título"
          placeholder="Ej: Filtración de agua en el techo"
          value={titulo}
          onChange={setTitulo}
          error={errores.titulo}
        />

        <FormInput
          id="ubicacion"
          label="Ubicación"
          placeholder="Ej: Parqueadero Nivel 1, zona sur"
          value={ubicacion}
          onChange={setUbicacion}
          error={errores.ubicacion}
        />

        <div>
          <label htmlFor="descripcion" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
            Descripción
          </label>
          <textarea
            id="descripcion"
            rows={4}
            placeholder="Describe el daño con detalle..."
            value={descripcion}
            onChange={(evento) => setDescripcion(evento.target.value)}
            className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink placeholder:text-ink/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
          {errores.descripcion && <p className="mt-1.5 text-sm text-error">{errores.descripcion}</p>}
        </div>

        {/* HU-50: evidencias (opcionales, varias) */}
        <div>
          <label htmlFor="evidencias" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
            Evidencias (opcional)
          </label>
          <input
            id="evidencias"
            type="file"
            accept="image/*"
            multiple
            onChange={handleArchivosChange}
            className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink file:mr-3 file:rounded-md file:border-0 file:bg-brand/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand"
          />
          <p className="mt-1.5 text-xs text-ink/50">
            Hasta {MAX_EVIDENCIAS} imágenes de máximo {MAX_MB_POR_EVIDENCIA} MB cada una ({evidencias.length}/{MAX_EVIDENCIAS}).
          </p>
          {errores.evidencias && <p className="mt-1.5 text-sm text-error">{errores.evidencias}</p>}

          {evidencias.length > 0 && (
            <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {evidencias.map((imagen, indice) => (
                <li key={indice} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagen}
                    alt={`Evidencia ${indice + 1}`}
                    className="h-24 w-full rounded-lg border border-line object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => quitarEvidencia(indice)}
                    aria-label={`Quitar evidencia ${indice + 1}`}
                    className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-xs text-error shadow transition-colors hover:bg-white"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          disabled={guardando}
          className="mt-2 rounded-lg bg-brand px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
        >
          {guardando ? "Enviando..." : "Enviar reporte"}
        </button>
      </form>
    </div>
  );
}