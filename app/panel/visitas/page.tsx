"use client";

import Link from "next/link";
import { useVisitasLista } from "./useVisitasLista";

const ETIQUETAS_ESTADO: Record<string, string> = {
  pendiente: "Pendiente",
  en_conjunto: "En el conjunto",
  finalizada: "Finalizada",
};

const ESTILOS_ESTADO: Record<string, string> = {
  pendiente: "bg-gold/20 text-gold",
  en_conjunto: "bg-emerald-100 text-emerald-700",
  finalizada: "bg-zinc-100 text-zinc-500",
};

function formatearFecha(fecha: string): string {
  // fecha llega como "YYYY-MM-DD" (input type="date"); le agregamos
  // hora para que new Date() la interprete en horario local, no UTC.
  return new Date(`${fecha}T00:00:00`).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatearHora(iso: string): string {
  return new Date(iso).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
}

export default function VisitasPage() {
  const {
    visitas,
    esPortero,
    esAdministrador,
    esResidente,
    visitaRecienLlegada,
    handleRegistrarEntrada,
    handleRegistrarSalida,
  } = useVisitasLista();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Visitas
          </h1>
          <p className="mt-1 text-ink/60">
            {esAdministrador
              ? "Historial completo de visitas del conjunto"
              : esPortero
                ? "Visitas anunciadas por los residentes"
                : "Tus visitas registradas"}
          </p>
        </div>

        {esResidente && (
          <Link
            href="/panel/visitas/nueva"
            className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
          >
            + Registrar visita
          </Link>
        )}
      </div>

      {/* Simulacion de HU-31: aviso destacado si tu visita ya llego */}
      {visitaRecienLlegada && (
        <div className="mt-6 rounded-xl border border-brand/30 bg-brand/5 p-4">
          <p className="text-sm font-medium text-brand">
            🔔 {visitaRecienLlegada.nombreVisitante} llegó y está en portería.
          </p>
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-xl border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-canvas">
            <tr>
              <th className="px-4 py-3 font-medium text-ink/60">Visitante</th>
              <th className="px-4 py-3 font-medium text-ink/60">Documento</th>
              <th className="px-4 py-3 font-medium text-ink/60">Fecha</th>
              <th className="px-4 py-3 font-medium text-ink/60">Estado</th>
              {/* La columna de acciones solo existe si eres portero -
                  ni siquiera se dibuja el encabezado para los demas roles */}
              {esPortero && <th className="px-4 py-3 font-medium text-ink/60">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {visitas.length === 0 ? (
              <tr>
                <td colSpan={esPortero ? 5 : 4} className="px-4 py-8 text-center text-ink/40">
                  No hay visitas registradas.
                </td>
              </tr>
            ) : (
              visitas.map((visita) => (
                <tr key={visita.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink">{visita.nombreVisitante}</td>
                  <td className="px-4 py-3 text-ink/70">{visita.documentoVisitante}</td>
                  <td className="px-4 py-3 text-ink/70">{formatearFecha(visita.fechaVisita)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ESTILOS_ESTADO[visita.estado]}`}>
                      {ETIQUETAS_ESTADO[visita.estado]}
                    </span>
                    {visita.horaEntrada && (
                      <p className="mt-1 text-xs text-ink/40">
                        Entrada: {formatearHora(visita.horaEntrada)}
                        {visita.horaSalida && ` · Salida: ${formatearHora(visita.horaSalida)}`}
                      </p>
                    )}
                  </td>

                  {/* Botones de accion, EXCLUSIVOS del portero, y
                      distintos segun en que estado este la visita */}
                  {esPortero && (
                    <td className="px-4 py-3">
                      {visita.estado === "pendiente" && (
                        <button
                          onClick={() => handleRegistrarEntrada(visita.id)}
                          className="text-sm font-medium text-brand hover:text-brand-dark"
                        >
                          Registrar entrada
                        </button>
                      )}
                      {visita.estado === "en_conjunto" && (
                        <button
                          onClick={() => handleRegistrarSalida(visita.id)}
                          className="text-sm font-medium text-error hover:text-error/70"
                        >
                          Registrar salida
                        </button>
                      )}
                      {visita.estado === "finalizada" && (
                        <span className="text-sm text-ink/30">Completada</span>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}