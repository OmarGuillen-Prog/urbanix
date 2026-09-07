"use client";

import Link from "next/link";
import { useComunicadosLista } from "./useComunicadosLista";

function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ComunicadosPage() {
  const { comunicados, esAdministrador, handleEliminar } = useComunicadosLista();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Comunicados
          </h1>
          <p className="mt-1 text-ink/60">Anuncios oficiales del conjunto.</p>
        </div>

        {/* RF-34: solo el administrador publica comunicados */}
        {esAdministrador && (
          <Link
            href="/panel/comunicados/nuevo"
            className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
          >
            + Nuevo comunicado
          </Link>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {comunicados.length === 0 ? (
          <p className="text-ink/40">Aún no hay comunicados publicados.</p>
        ) : (
          comunicados.map((comunicado) => (
            <div key={comunicado.id} className="rounded-xl border border-line bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-display text-lg font-semibold text-ink">
                    {comunicado.titulo}
                  </p>
                  <p className="mt-1 text-xs text-ink/40">
                    {formatearFecha(comunicado.fechaPublicacion)}
                  </p>
                </div>

                {/* RF-38/39: editar y eliminar, solo administrador */}
                {esAdministrador && (
                  <div className="flex shrink-0 items-center gap-3">
                    <Link
                      href={`/panel/comunicados/${comunicado.id}`}
                      className="text-sm font-medium text-brand hover:text-brand-dark"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleEliminar(comunicado.id, comunicado.titulo)}
                      className="text-sm font-medium text-error hover:text-error/70"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>

              <p className="mt-3 text-sm text-ink/70">{comunicado.contenido}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}