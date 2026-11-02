"use client";

import Link from "next/link";
import { usePanelResidente } from "./usePanelResidente";
import { TarjetaPanel } from "./TarjetaPanel";
import { ResumenTarjetas } from "@/components/ResumenTarjetas";
import { ETIQUETAS_ESTADO, ESTILOS_ESTADO } from "../pqrs/etiquetas";
import { ETIQUETAS_CATEGORIA, ESTILOS_CATEGORIA } from "../comunicados/etiquetas";

export function PanelResidente() {
  const { tarjetas, pqrs, reservaciones, comunicados, correo } = usePanelResidente();

  return (
    <>
      <ResumenTarjetas items={tarjetas} />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TarjetaPanel titulo="Mis PQRS recientes" enlace={{ href: "/panel/pqrs", texto: "Ver todo" }}>
          {pqrs.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink/40">Aún no has enviado solicitudes.</p>
          ) : (
            <ul className="flex flex-col">
              {pqrs.map((fila) => (
                <li key={fila.id} className="border-t border-line first:border-0">
                  <Link href={`/panel/pqrs/${fila.id}`} className="flex items-center justify-between gap-3 py-2.5 hover:text-brand">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{fila.asunto}</p>
                      <p className="text-xs text-ink/50">{fila.codigo}</p>
                    </div>
                    <span className={`shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${ESTILOS_ESTADO[fila.estado]}`}>
                      {ETIQUETAS_ESTADO[fila.estado]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </TarjetaPanel>

        <TarjetaPanel titulo="Mis próximas reservaciones" enlace={{ href: "/panel/reservas", texto: "Ver todo" }}>
          {reservaciones.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink/40">No tienes reservaciones próximas.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {reservaciones.map((reserva) => (
                <li key={reserva.id}>
                  <Link
                    href={`/panel/reservas/${reserva.id}`}
                    className="flex items-center gap-3 rounded-lg bg-canvas px-4 py-3 transition-colors hover:bg-brand/5"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10" aria-hidden="true">
                      📅
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink">{reserva.zona}</p>
                      <p className="text-xs text-ink/50">{reserva.cuando}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </TarjetaPanel>
      </div>

      <div className="mt-6">
        <TarjetaPanel titulo="Comunicados recientes" enlace={{ href: "/panel/comunicados", texto: "Ver todo" }}>
          {comunicados.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink/40">No hay comunicados para mostrar.</p>
          ) : (
            <ul className="flex flex-col">
              {comunicados.map((comunicado) => (
                <li key={comunicado.id} className="border-t border-line first:border-0">
                  <Link href="/panel/comunicados" className="flex items-center justify-between gap-3 py-2.5 hover:text-brand">
                    <div className="flex min-w-0 items-center gap-2">
                      {comunicado.fijado && <span aria-hidden="true">📌</span>}
                      <p className="truncate text-sm font-medium text-ink">{comunicado.titulo}</p>
                      {!comunicado.vistoPor.includes(correo) && (
                        <span className="shrink-0 rounded-full bg-error px-2 py-0.5 text-xs font-medium text-white">Nuevo</span>
                      )}
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${ESTILOS_CATEGORIA[comunicado.categoria]}`}>
                      {ETIQUETAS_CATEGORIA[comunicado.categoria]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </TarjetaPanel>
      </div>
    </>
  );
}