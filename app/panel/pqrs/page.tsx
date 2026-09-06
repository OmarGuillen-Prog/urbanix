"use client";

import Link from "next/link";
import { usePQRSLista } from "./usePQRSLista";

function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function PQRSPage() {
  const { pqrsLista, esAdministrador } = usePQRSLista();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">
            PQRS
          </h1>
          <p className="mt-1 text-ink/60">
            {esAdministrador
              ? `${pqrsLista.length} solicitud(es) en total`
              : `${pqrsLista.length} solicitud(es) tuya(s)`}
          </p>
        </div>

        {/* Solo el residente crea PQRS - el administrador esta aqui
            para RESPONDER, no para generar solicitudes el mismo. */}
        {!esAdministrador && (
          <Link
            href="/panel/pqrs/nueva"
            className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
          >
            + Nueva PQRS
          </Link>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {pqrsLista.length === 0 ? (
          <p className="text-ink/40">Aún no hay solicitudes registradas.</p>
        ) : (
          pqrsLista.map((pqrs) => (
            <Link
              key={pqrs.id}
              href={`/panel/pqrs/${pqrs.id}`}
              className="block rounded-xl border border-line bg-white p-5 transition-colors hover:border-brand"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-ink">{pqrs.asunto}</p>
                  <p className="mt-1 line-clamp-1 text-sm text-ink/60">
                    {pqrs.descripcion}
                  </p>
                  <p className="mt-2 text-xs text-ink/40">
                    {formatearFecha(pqrs.fechaCreacion)}
                  </p>
                </div>
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
            </Link>
          ))
        )}
      </div>
    </div>
  );
}