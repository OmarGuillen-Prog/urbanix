"use client";

import Link from "next/link";
import { usePanelAdministrador } from "./usePanelAdministrador";
import { TarjetaPanel } from "./TarjetaPanel";
import { ResumenTarjetas } from "@/components/ResumenTarjetas";
import { GraficoLineasMultiples, GraficoTorta, PALETA } from "@/components/Graficos";
import { ETIQUETAS_ESTADO, ESTILOS_ESTADO, ETIQUETAS_PRIORIDAD, ESTILOS_PRIORIDAD } from "../pqrs/etiquetas";

export function PanelAdministrador() {
  const { tarjetas, actividad, variacion, parqueadero, pqrs, reservaciones } = usePanelAdministrador();

  const porcionesParqueadero = [
    { nombre: "Ocupados", valor: parqueadero.ocupados, color: PALETA[0] },
    { nombre: "Disponibles", valor: parqueadero.disponibles, color: "#d1d5db" },
    { nombre: "Reservados", valor: parqueadero.reservados, color: PALETA[1] },
  ].filter((porcion) => porcion.valor > 0);

  return (
    <>
      <ResumenTarjetas items={tarjetas} />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TarjetaPanel
            titulo="Actividad mensual"
            derecha={
              variacion !== null && (
                <span
                  className={`text-sm font-medium ${variacion >= 0 ? "text-emerald-600" : "text-error"}`}
                  title="Cambio de la actividad total entre los dos últimos meses completos"
                >
                  {variacion >= 0 ? "▲" : "▼"} {variacion >= 0 ? "+" : ""}
                  {variacion.toFixed(1)}%
                </span>
              )
            }
          >
            <GraficoLineasMultiples
              datos={actividad}
              claveX="etiqueta"
              series={[
                { clave: "reservaciones", nombre: "Reservaciones", color: PALETA[0] },
                { clave: "visitas", nombre: "Visitas", color: PALETA[1] },
              ]}
            />
            <p className="mt-2 text-xs text-ink/40">
              El último punto es el mes en curso (aún no termina). Los meses anteriores son cifras de ejemplo.
            </p>
          </TarjetaPanel>
        </div>

        <TarjetaPanel titulo="Distribución parqueadero">
          <GraficoTorta datos={porcionesParqueadero} formatoTooltip={(valor) => `${valor} espacios`} />
          <dl className="mt-2 flex flex-col gap-1.5 border-t border-line pt-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink/60">Ocupados</dt>
              <dd className="font-medium text-ink">{parqueadero.ocupados} espacios</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/60">Disponibles</dt>
              <dd className="font-medium text-ink">{parqueadero.disponibles} espacios</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/60">Reservados</dt>
              <dd className="font-medium text-ink">{parqueadero.reservados} espacios</dd>
            </div>
          </dl>
        </TarjetaPanel>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TarjetaPanel titulo="PQRS recientes" enlace={{ href: "/panel/pqrs", texto: "Ver todo" }}>
          {pqrs.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink/40">Aún no hay solicitudes.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs text-ink/50">
                    <th className="pb-2 font-medium">ID</th>
                    <th className="pb-2 font-medium">Asunto</th>
                    <th className="pb-2 font-medium">Estado</th>
                    <th className="pb-2 font-medium">Prioridad</th>
                  </tr>
                </thead>
                <tbody>
                  {pqrs.map((fila) => (
                    <tr key={fila.id} className="border-t border-line">
                      <td className="whitespace-nowrap py-2.5 pr-3 font-medium text-ink">
                        <Link href={`/panel/pqrs/${fila.id}`} className="hover:text-brand">
                          {fila.codigo}
                        </Link>
                      </td>
                      <td className="max-w-48 truncate py-2.5 pr-3 text-ink/70">{fila.asunto}</td>
                      <td className="py-2.5 pr-3">
                        <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${ESTILOS_ESTADO[fila.estado]}`}>
                          {ETIQUETAS_ESTADO[fila.estado]}
                        </span>
                      </td>
                      <td className="py-2.5">
                        <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${ESTILOS_PRIORIDAD[fila.prioridad]}`}>
                          {ETIQUETAS_PRIORIDAD[fila.prioridad]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TarjetaPanel>

        <TarjetaPanel titulo="Próximas reservaciones" enlace={{ href: "/panel/reservas", texto: "Ver todo" }}>
          {reservaciones.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink/40">No hay reservaciones próximas.</p>
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
                      <p className="text-xs text-ink/50">
                        Unidad {reserva.unidad} · {reserva.cuando}
                      </p>
                    </div>
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