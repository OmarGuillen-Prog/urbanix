"use client";

import Link from "next/link";
import { useRegistrarVisita } from "./useRegistrarVisita";
import { FormInput } from "@/components/FormInput";
import type { TipoVisita } from "@/lib/visitasStore";

const CLASE_SELECT =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";
const CLASE_ETIQUETA = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60";

export default function NuevaVisitaPage() {
  const {
    esResidente, residentes,
    tipo, setTipo,
    nombreVisitante, setNombreVisitante,
    documentoVisitante, setDocumentoVisitante,
    fechaVisita, setFechaVisita,
    horaEstimada, setHoraEstimada,
    correoAnfitrion, setCorreoAnfitrion,
    errores, guardando, handleSubmit,
  } = useRegistrarVisita();

  const esVisitante = tipo === "visitante";

  return (
    <div>
      <Link href="/panel/visitas" className="text-sm text-ink/60 hover:text-brand">
        ← Volver al listado
      </Link>

      <h1 className="mt-4 font-display text-3xl font-semibold text-ink">Registrar visita</h1>
      <p className="mt-1 text-ink/60">
        {esResidente
          ? "Anuncia a tu visitante para agilizar su ingreso en portería."
          : "Registra una visita, domicilio o servicio a nombre de un residente."}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex max-w-lg flex-col gap-5">
        <div>
          <label htmlFor="tipo" className={CLASE_ETIQUETA}>Tipo</label>
          <select id="tipo" value={tipo} onChange={(evento) => setTipo(evento.target.value as TipoVisita)} className={CLASE_SELECT}>
            <option value="visitante">Visitante</option>
            <option value="domicilio">Domicilio</option>
            <option value="servicio">Servicio</option>
          </select>
        </div>

        {/* Solo portero y administrador eligen al anfitrion */}
        {!esResidente && (
          <div>
            <label htmlFor="anfitrion" className={CLASE_ETIQUETA}>Residente anfitrión</label>
            <select
              id="anfitrion"
              value={correoAnfitrion}
              onChange={(evento) => setCorreoAnfitrion(evento.target.value)}
              className={CLASE_SELECT}
            >
              {residentes.map((residente) => (
                <option key={residente.id} value={residente.correo}>
                  {residente.nombres} {residente.apellidos}
                </option>
              ))}
            </select>
            {errores.correoAnfitrion && <p className="mt-1.5 text-sm text-error">{errores.correoAnfitrion}</p>}
          </div>
        )}

        <FormInput
          id="nombreVisitante"
          label={esVisitante ? "Nombre del visitante" : "Empresa o nombre"}
          placeholder={esVisitante ? "Ej: Camila Torres" : "Ej: Pizza Express"}
          value={nombreVisitante}
          onChange={setNombreVisitante}
          error={errores.nombreVisitante}
        />

        <FormInput
          id="documentoVisitante"
          label={esVisitante ? "Documento de identidad" : "Documento o NIT (opcional)"}
          placeholder="Ej: 1122334455"
          value={documentoVisitante}
          onChange={setDocumentoVisitante}
          error={errores.documentoVisitante}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormInput id="fechaVisita" label="Fecha" type="date" value={fechaVisita} onChange={setFechaVisita} error={errores.fechaVisita} />
          <FormInput id="horaEstimada" label="Hora estimada" type="time" value={horaEstimada} onChange={setHoraEstimada} error={errores.horaEstimada} />
        </div>

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