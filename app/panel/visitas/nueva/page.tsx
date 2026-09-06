"use client";

import Link from "next/link";
import { useRegistrarVisita } from "./useRegistrarVisita";
import { FormInput } from "@/components/FormInput";

export default function NuevaVisitaPage() {
  const {
    nombreVisitante, setNombreVisitante,
    documentoVisitante, setDocumentoVisitante,
    fechaVisita, setFechaVisita,
    errores,
    guardando,
    handleSubmit,
  } = useRegistrarVisita();

  return (
    <div>
      <Link href="/panel/visitas" className="text-sm text-ink/60 hover:text-brand">
        ← Volver al listado
      </Link>

      <h1 className="mt-4 font-display text-3xl font-semibold text-ink">
        Registrar visita
      </h1>
      <p className="mt-1 text-ink/60">
        Anuncia a tu visitante para agilizar su ingreso en portería.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex max-w-lg flex-col gap-5">
        <FormInput
          id="nombreVisitante"
          label="Nombre del visitante"
          placeholder="Ej: Camila Torres"
          value={nombreVisitante}
          onChange={setNombreVisitante}
          error={errores.nombreVisitante}
        />
        <FormInput
          id="documentoVisitante"
          label="Documento de identidad"
          placeholder="Ej: 1122334455"
          value={documentoVisitante}
          onChange={setDocumentoVisitante}
          error={errores.documentoVisitante}
        />
        <FormInput
          id="fechaVisita"
          label="Fecha de la visita"
          type="date"
          value={fechaVisita}
          onChange={setFechaVisita}
          error={errores.fechaVisita}
        />

        <button
          type="submit"
          disabled={guardando}
          className="mt-2 rounded-lg bg-brand px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
        >
          {guardando ? "Guardando..." : "Registrar visita"}
        </button>
      </form>
    </div>
  );
}