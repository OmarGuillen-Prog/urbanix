"use client";

import Link from "next/link";
import { useReportarDano } from "./useReportarDano";
import { FormInput } from "@/components/FormInput";

export default function NuevoReportePage() {
  const { titulo, setTitulo, descripcion, setDescripcion, preview, handleArchivoChange, errores, guardando, handleSubmit } =
    useReportarDano();

  return (
    <div>
      <Link href="/panel/reportes" className="text-sm text-ink/60 hover:text-brand">
        ← Volver al listado
      </Link>

      <h1 className="mt-4 font-display text-3xl font-semibold text-ink">
        Reportar daño
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 flex max-w-lg flex-col gap-5">
        <FormInput
          id="titulo"
          label="Título"
          placeholder="Ej: Grieta en el muro del parqueadero"
          value={titulo}
          onChange={setTitulo}
          error={errores.titulo}
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

        {/* HU-50: subir foto como evidencia (opcional) */}
        <div>
          <label htmlFor="evidenciaFoto" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
            Foto de evidencia (opcional)
          </label>
          <input
            id="evidenciaFoto"
            type="file"
            // "accept" filtra que tipos de archivo el navegador ofrece
            // en el selector - no es una validacion de seguridad real,
            // solo una ayuda de UX, algo bueno saber a futuro.
            accept="image/*"
            onChange={handleArchivoChange}
            className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink file:mr-3 file:rounded-md file:border-0 file:bg-brand/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand"
          />
          {errores.evidenciaFoto && <p className="mt-1.5 text-sm text-error">{errores.evidenciaFoto}</p>}

          {/* Vista previa: solo se muestra si ya se cargo una imagen */}
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Vista previa de la evidencia"
              className="mt-3 max-h-48 rounded-lg border border-line object-cover"
            />
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