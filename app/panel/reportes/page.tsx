"use client";

import Link from "next/link";
import { useReportesLista } from "./useReportesLista";

const ETIQUETAS_ESTADO: Record<string, string> = {
  pendiente: "Pendiente",
  en_proceso: "En proceso",
  resuelto: "Resuelto",
};

const ESTILOS_ESTADO: Record<string, string> = {
  pendiente: "bg-gold/20 text-gold",
  en_proceso: "bg-brand/10 text-brand",
  resuelto: "bg-emerald-100 text-emerald-700",
};

function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
}

export default function ReportesPage() {
  const { reportes, esAdministrador } = useReportesLista();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Reportes de daños
          </h1>
          <p className="mt-1 text-ink/60">
            {esAdministrador ? "Todos los reportes del conjunto" : "Tus reportes registrados"}
          </p>
        </div>

        {!esAdministrador && (
          <Link
            href="/panel/reportes/nuevo"
            className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
          >
            + Reportar daño
          </Link>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {reportes.length === 0 ? (
          <p className="text-ink/40">No hay reportes registrados.</p>
        ) : (
          reportes.map((reporte) => (
            <Link
              key={reporte.id}
              href={`/panel/reportes/${reporte.id}`}
              className="flex items-center gap-4 rounded-xl border border-line bg-white p-4 transition-colors hover:border-brand"
            >
              {/* Miniatura si hay foto; si no, un cuadro vacio de reemplazo */}
              {reporte.evidenciaFoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={reporte.evidenciaFoto}
                  alt=""
                  className="h-14 w-14 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-canvas text-xs text-ink/30">
                  Sin foto
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">{reporte.titulo}</p>
                <p className="mt-1 text-xs text-ink/40">{formatearFecha(reporte.fechaReporte)}</p>
              </div>

              <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${ESTILOS_ESTADO[reporte.estado]}`}>
                {ETIQUETAS_ESTADO[reporte.estado]}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}