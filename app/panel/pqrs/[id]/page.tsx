"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useDetallePQRS } from "./useDetallePQRS";

function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DetallePQRSPage() {
  const params = useParams<{ id: string }>();
  const { pqrs, tieneAcceso, esAdministrador, respuesta, setRespuesta, enviando, handleResponder } =
    useDetallePQRS(params.id);

  if (!pqrs) {
    return (
      <div>
        <p className="text-ink/60">Solicitud no encontrada.</p>
        <Link href="/panel/pqrs" className="mt-4 inline-block text-brand hover:text-brand-dark">
          ← Volver al listado
        </Link>
      </div>
    );
  }

  // Un residente intentando ver la PQRS de otra persona, escribiendo
  // la URL a mano - lo bloqueamos aqui, aunque igual insistimos: esto
  // es solo cosmetico, la validacion real debe vivir en el backend.
  if (!tieneAcceso) {
    return (
      <div>
        <p className="text-ink/60">No tienes permiso para ver esta solicitud.</p>
        <Link href="/panel/pqrs" className="mt-4 inline-block text-brand hover:text-brand-dark">
          ← Volver al listado
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/panel/pqrs" className="text-sm text-ink/60 hover:text-brand">
        ← Volver al listado
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold text-ink">
          {pqrs.asunto}
        </h1>
        <span
          className={
            pqrs.estado === "respondido"
              ? "shrink-0 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700"
              : "shrink-0 rounded-full bg-gold/20 px-2.5 py-0.5 text-xs font-medium text-gold"
          }
        >
          {pqrs.estado === "respondido" ? "Respondido" : "Pendiente"}
        </span>
      </div>
      <p className="mt-1 text-sm text-ink/40">
        Enviado el {formatearFecha(pqrs.fechaCreacion)}
      </p>

      <div className="mt-6 max-w-lg rounded-xl border border-line bg-white p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-ink/40">
          Descripción
        </p>
        <p className="mt-2 text-sm text-ink">{pqrs.descripcion}</p>
      </div>

      {/* Caso 1: ya tiene respuesta - la mostramos, sin importar el rol */}
      {pqrs.estado === "respondido" && (
        <div className="mt-4 max-w-lg rounded-xl border border-line bg-brand/5 p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-brand">
            Respuesta de administración
          </p>
          <p className="mt-2 text-sm text-ink">{pqrs.respuesta}</p>
          {pqrs.fechaRespuesta && (
            <p className="mt-2 text-xs text-ink/40">
              Respondido el {formatearFecha(pqrs.fechaRespuesta)}
            </p>
          )}
        </div>
      )}

      {/* Caso 2: sigue pendiente Y quien mira es administrador ->
          mostramos el formulario para responder (HU-25) */}
      {pqrs.estado === "pendiente" && esAdministrador && (
        <form onSubmit={handleResponder} className="mt-4 max-w-lg">
          <label htmlFor="respuesta" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
            Escribir respuesta
          </label>
          <textarea
            id="respuesta"
            rows={4}
            value={respuesta}
            onChange={(evento) => setRespuesta(evento.target.value)}
            placeholder="Escribe la respuesta para el residente..."
            className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink placeholder:text-ink/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
          <button
            type="submit"
            disabled={enviando || respuesta.trim() === ""}
            className="mt-3 rounded-lg bg-brand px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
          >
            {enviando ? "Enviando..." : "Enviar respuesta"}
          </button>
        </form>
      )}

      {/* Caso 3: pendiente Y quien mira es residente -> solo un
          mensaje de espera, sin formulario */}
      {pqrs.estado === "pendiente" && !esAdministrador && (
        <p className="mt-4 text-sm text-ink/40">
          Tu solicitud está pendiente de respuesta por parte de administración.
        </p>
      )}
    </div>
  );
}