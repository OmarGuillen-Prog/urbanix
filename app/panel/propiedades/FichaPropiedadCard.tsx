import Link from "next/link";
import type { FichaPropiedad } from "@/lib/fichaPropiedad";
import { formatearMoneda } from "@/lib/formatos";
import { ETIQUETAS_ESTADO as ETIQUETAS_CUOTA, ESTILOS_ESTADO as ESTILOS_CUOTA } from "../cuotas/etiquetas";
import {
  ETIQUETAS_TIPO_PROPIEDAD,
  ETIQUETAS_OCUPACION,
  ESTILOS_OCUPACION,
  ETIQUETAS_TIPO_PARQUEADERO,
} from "./etiquetas";

function formatearFecha(fecha: string): string {
  return new Date(`${fecha}T00:00:00`).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
}

export function FichaPropiedadCard({ ficha }: { ficha: FichaPropiedad }) {
  const { propiedad, miRelacion, otraParte, cuotas, parqueaderos, cupoParqueaderos } = ficha;

  return (
    <article className="overflow-hidden rounded-xl border border-line bg-white">
      {/* Encabezado: la unidad, mi relacion con ella y su estado */}
      <div className="flex items-start justify-between gap-4 bg-linear-to-br from-brand to-brand-dark px-6 py-5 text-white">
        <div>
          <h2 className="font-display text-2xl font-semibold">
            Torre {propiedad.torre} · {propiedad.numero}
          </h2>
          <p className="mt-0.5 text-sm text-white/70">{ETIQUETAS_TIPO_PROPIEDAD[propiedad.tipo]}</p>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-medium">{miRelacion}</span>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ESTILOS_OCUPACION[propiedad.estadoOcupacion]}`}>
            {ETIQUETAS_OCUPACION[propiedad.estadoOcupacion]}
          </span>
        </div>
      </div>

      {/* Datos fisicos */}
      <dl className="grid grid-cols-3 divide-x divide-line border-b border-line text-center">
        <div className="px-2 py-4">
          <dd className="font-display text-xl font-semibold text-ink">{propiedad.area} m²</dd>
          <dt className="text-xs text-ink/50">Área</dt>
        </div>
        <div className="px-2 py-4">
          <dd className="font-display text-xl font-semibold text-ink">{propiedad.habitaciones}</dd>
          <dt className="text-xs text-ink/50">Habitaciones</dt>
        </div>
        <div className="px-2 py-4">
          <dd className="font-display text-xl font-semibold text-ink">{propiedad.banos}</dd>
          <dt className="text-xs text-ink/50">Baños</dt>
        </div>
      </dl>

      {/* Tres bloques separados por una linea fina (gap-px sobre fondo de linea) */}
      <div className="grid grid-cols-1 gap-px bg-line lg:grid-cols-3">
        {/* ---------- Cuotas ---------- */}
        <section className="bg-white p-5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-medium text-ink">Cuotas</h3>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ESTILOS_CUOTA[cuotas.estado]}`}>
              {ETIQUETAS_CUOTA[cuotas.estado]}
            </span>
          </div>

          <dl className="mt-3 flex flex-col gap-1.5 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-ink/60">Por pagar</dt>
              <dd className={`font-medium ${cuotas.estado === "vencida" ? "text-error" : "text-ink"}`}>
                {formatearMoneda(cuotas.porPagar)}
              </dd>
            </div>
            {cuotas.cuotasVencidas > 0 && (
              <div className="flex justify-between gap-3">
                <dt className="text-ink/60">Vencidas</dt>
                <dd className="font-medium text-error">{cuotas.cuotasVencidas}</dd>
              </div>
            )}
            {cuotas.proximoVencimiento && (
              <div className="flex justify-between gap-3">
                <dt className="text-ink/60">Próximo vencimiento</dt>
                <dd className="text-ink">{formatearFecha(cuotas.proximoVencimiento)}</dd>
              </div>
            )}
            <div className="flex justify-between gap-3">
              <dt className="text-ink/60">Último pago</dt>
              <dd className="text-ink">{cuotas.ultimoPago ? formatearFecha(cuotas.ultimoPago) : "—"}</dd>
            </div>
          </dl>

          <Link href="/panel/cuotas" className="mt-4 inline-block text-sm font-medium text-brand hover:text-brand-dark">
            Ver mis cuotas →
          </Link>
        </section>

        {/* ---------- Parqueaderos ---------- */}
        <section className="bg-white p-5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-medium text-ink">Parqueaderos</h3>
            <span className="text-xs text-ink/50">
              {parqueaderos.length} de {cupoParqueaderos}
            </span>
          </div>

          {parqueaderos.length === 0 ? (
            <p className="mt-3 text-sm text-ink/50">Esta unidad no tiene espacios asignados. Pídelos a la administración.</p>
          ) : (
            <ul className="mt-3 flex flex-col gap-2">
              {parqueaderos.map((espacio) => (
                <li key={espacio.id} className="flex items-center justify-between gap-3 rounded-lg bg-canvas px-3 py-2 text-sm">
                  <div>
                    <p className="font-medium text-ink">{espacio.numero}</p>
                    <p className="text-xs text-ink/50">
                      Nivel {espacio.nivel} · {ETIQUETAS_TIPO_PARQUEADERO[espacio.tipo]}
                    </p>
                  </div>
                  {espacio.placa ? (
                    <span className="rounded-md bg-white px-2 py-0.5 text-xs font-semibold tracking-wide text-ink ring-1 ring-line">
                      {espacio.placa}
                    </span>
                  ) : (
                    <span className="text-xs text-ink/40">Sin vehículo</span>
                  )}
                </li>
              ))}
            </ul>
          )}

                    {/* Los espacios y los vehiculos los gestiona la administracion (HU-37 y HU-38): el residente solo los consulta */}
          <p className="mt-4 text-xs text-ink/40">Los espacios y los vehículos los registra la administración.</p>
        </section>

        {/* ---------- Personas de la unidad ---------- */}
        <section className="bg-white p-5">
          <h3 className="font-medium text-ink">Personas de la unidad</h3>

          <dl className="mt-3 flex flex-col gap-3 text-sm">
            <div>
              <dt className="text-xs text-ink/50">Tú</dt>
              <dd className="font-medium text-ink">{miRelacion}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink/50">{otraParte.etiqueta}</dt>
              <dd className="font-medium text-ink">
                {otraParte.nombre ?? <span className="font-normal text-ink/40">Sin {otraParte.etiqueta.toLowerCase()} registrado</span>}
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </article>
  );
}