"use client";

import Link from "next/link";
import { usePanelPortero } from "./usePanelPortero";
import { TarjetaPanel } from "./TarjetaPanel";
import { ResumenTarjetas } from "@/components/ResumenTarjetas";
import { ETIQUETAS_CATEGORIA, ESTILOS_CATEGORIA } from "../comunicados/etiquetas";

interface FilaVisita {
  id: string;
  nombre: string;
  unidad: string;
  detalle: string;
}

function ListaVisitas({ filas, vacio }: { filas: FilaVisita[]; vacio: string }) {
  if (filas.length === 0) return <p className="py-6 text-center text-sm text-ink/40">{vacio}</p>;

  return (
    <ul className="flex flex-col gap-3">
      {filas.map((fila) => (
        <li key={fila.id} className="flex items-center justify-between gap-3 rounded-lg bg-canvas px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">{fila.nombre}</p>
            <p className="text-xs text-ink/50">Unidad {fila.unidad}</p>
          </div>
          <span className="shrink-0 text-xs text-ink/60">{fila.detalle}</span>
        </li>
      ))}
    </ul>
  );
}

export function PanelPortero() {
  const { tarjetas, porAtender, dentro, comunicados, correo } = usePanelPortero();

  return (
    <>
      <ResumenTarjetas items={tarjetas} />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TarjetaPanel titulo="Visitas por atender" enlace={{ href: "/panel/visitas", texto: "Ir a visitas" }}>
          <ListaVisitas filas={porAtender} vacio="No hay visitas esperando." />
        </TarjetaPanel>

        <TarjetaPanel titulo="Dentro del conjunto" enlace={{ href: "/panel/visitas", texto: "Ir a visitas" }}>
          <ListaVisitas filas={dentro} vacio="No hay nadie dentro en este momento." />
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