"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCuotasAdmin } from "./useCuotasAdmin";
import { useCuotasResidente } from "./useCuotasResidente";
import { ResumenTarjetas } from "@/components/ResumenTarjetas";
import { Paginacion } from "@/components/Paginacion";
import {
  estadoVisual,
  diasParaVencer,
  detalleDeCuota,
  codigoCuota,
  contarComprobantesPorRevisar,
  type EstadoVisualCuota,
} from "@/lib/cuotasStore";
import { formatearMoneda } from "@/lib/formatos";
import { ETIQUETAS_ESTADO, ESTILOS_ESTADO } from "./etiquetas";

function formatearFecha(fecha: string): string {
  return new Date(`${fecha}T00:00:00`).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
}

// Igual, pero para fechas ISO con hora ("2026-11-02T13:00:00.000Z")
function formatearFechaIso(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
}

const CLASE_SELECT =
  "rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

export default function CuotasPage() {
  const { usuario } = useAuth();

  if (usuario?.rol === "administrador") {
    return <VistaAdministrador />;
  }
  return <VistaResidente />;
}

function VistaResidente() {
  const { cuotas, resumen, sinDeudas, nombrePropiedad, subiendoId, errorSubida, handleSubirComprobante } =
    useCuotasResidente();

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Mis cuotas</h1>
      <p className="mt-1 text-ink/60">Consulta el estado de tus cuotas de administración.</p>

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
        <span aria-hidden="true">ℹ️</span>
        <p>
          El pago se hace por fuera de la plataforma (consignación, transferencia o efectivo). Puedes subir la imagen de
          tu comprobante para que la administración lo revise y registre el pago: cuando lo haga, la cuota aparecerá
          como &quot;Al día&quot; y recibirás una notificación.
        </p>
      </div>

      <ResumenTarjetas
        items={[
          { etiqueta: "Total cuotas", valor: formatearMoneda(resumen.facturado), icono: "🧾", tono: "brand" },
          { etiqueta: "Pagado", valor: formatearMoneda(resumen.recaudado), icono: "✅", tono: "verde" },
          { etiqueta: "Por pagar", valor: formatearMoneda(resumen.pendiente), icono: "⏳", tono: "dorado" },
          { etiqueta: "Vencido", valor: formatearMoneda(resumen.vencido), icono: "⚠️", tono: "rojo" },
        ]}
      />

      {/* RF-31: mensaje informativo cuando no hay deudas */}
      {cuotas.length > 0 && sinDeudas && (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          ✓ Estás al día. No tienes cuotas pendientes.
        </div>
      )}

      {cuotas.length === 0 ? (
        <p className="mt-6 text-ink/40">Aún no tienes cuotas registradas.</p>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {cuotas.map((cuota) => {
            const estado = estadoVisual(cuota);
            const dias = diasParaVencer(cuota.fechaLimite);

            return (
              <div key={cuota.id} className="rounded-xl border border-line bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-block rounded-full bg-canvas px-2 py-0.5 text-xs font-medium text-ink/60">
                      {nombrePropiedad(cuota.idPropiedad)}
                    </span>
                    <p className="mt-1.5 font-medium text-ink">{cuota.descripcion}</p>
                    <p className="mt-1 text-sm text-ink/60">
                      {estado === "pagada" && cuota.fechaPago
                        ? `Pagada el ${formatearFecha(cuota.fechaPago)}`
                        : `Vence el ${formatearFecha(cuota.fechaLimite)}`}
                    </p>
                    {/* RF-32: recordatorio antes del vencimiento (3 dias o menos) */}
                    {estado === "pendiente" && dias <= 3 && (
                      <p className="mt-1 text-xs text-gold">⏰ Vence en {Math.max(dias, 0)} día(s)</p>
                    )}
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${ESTILOS_ESTADO[estado]}`}>
                    {ETIQUETAS_ESTADO[estado]}
                  </span>
                </div>

                <p className="mt-3 font-display text-xl font-semibold text-ink">{formatearMoneda(cuota.valor)}</p>

                {/* Comprobante de pago: solo para cuotas que aun no estan pagadas */}
                {estado !== "pagada" && (
                  <div className="mt-4 border-t border-line pt-4">
                    {cuota.comprobante?.estado === "en_revision" ? (
                      <div className="flex items-center gap-3">
                        {/* Es una imagen en memoria (data URL): next/image no aplica, por eso <img> */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={cuota.comprobante.imagen}
                          alt="Comprobante enviado"
                          className="h-14 w-14 rounded-lg border border-line object-cover"
                        />
                        <p className="text-sm text-gold">
                          🧾 Comprobante enviado el {formatearFechaIso(cuota.comprobante.fechaSubida)}. La administración
                          lo está revisando.
                        </p>
                      </div>
                    ) : (
                      <>
                        {cuota.comprobante?.estado === "rechazado" && (
                          <div className="mb-3 rounded-lg border border-error/30 bg-error/5 px-3 py-2 text-sm text-error">
                            Tu comprobante fue rechazado: {cuota.comprobante.motivoRechazo}. Sube uno nuevo.
                          </div>
                        )}

                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-line px-3.5 py-2 text-sm font-medium text-ink transition-colors focus-within:ring-2 focus-within:ring-brand/30 hover:border-brand hover:text-brand">
                          {subiendoId === cuota.id ? "Enviando..." : "📎 Subir comprobante de pago"}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="sr-only"
                            disabled={subiendoId === cuota.id}
                            onChange={(evento) => {
                              const archivo = evento.target.files?.[0];
                              if (archivo) handleSubirComprobante(cuota.id, archivo);
                              evento.target.value = ""; // permite elegir de nuevo el mismo archivo
                            }}
                          />
                        </label>
                        <p className="mt-1.5 text-xs text-ink/40">Imagen JPG, PNG o WEBP de hasta 2 MB.</p>

                        {errorSubida?.id === cuota.id && <p className="mt-1.5 text-sm text-error">{errorSubida.mensaje}</p>}
                      </>
                    )}
                  </div>
                )}

                {estado === "pagada" && cuota.comprobante?.estado === "aprobado" && (
                  <p className="mt-2 text-xs text-emerald-600">✓ Comprobante aprobado</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function VistaAdministrador() {
  const {
    visibles, totalFiltradas, paginaActual, totalPaginas, setPagina,
    busqueda, cambiarBusqueda,
    filtroEstado, cambiarEstado,
    filtroPeriodo, cambiarPeriodo,
    periodos,
    resumen,
    etiquetaPeriodo,
    mensajeRecordatorios,
    handleEnviarRecordatorios,
  } = useCuotasAdmin();

  const porcentaje = Math.round(resumen.porcentaje * 10) / 10; // un decimal: 55.9
  const comprobantesPorRevisar = contarComprobantesPorRevisar();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Cuotas de administración</h1>
          <p className="mt-1 text-ink/60">Consulta el estado de cuotas y recordatorios de pago</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/panel/cuotas/nueva"
            className="rounded-lg border border-line px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-brand hover:text-brand"
          >
            + Registrar cuota
          </Link>
          <button
            onClick={handleEnviarRecordatorios}
            className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
          >
            🔔 Enviar recordatorios
          </button>
        </div>
      </div>

      {mensajeRecordatorios && (
        <div className="mt-4 rounded-lg border border-brand/30 bg-brand/5 px-4 py-3 text-sm text-brand">
          {mensajeRecordatorios}
        </div>
      )}

      <ResumenTarjetas
        items={[
          { etiqueta: "Total facturado", valor: formatearMoneda(resumen.facturado), icono: "🧾", tono: "brand" },
          { etiqueta: "Recaudado", valor: formatearMoneda(resumen.recaudado), icono: "✅", tono: "verde" },
          { etiqueta: "Pendiente", valor: formatearMoneda(resumen.pendiente), icono: "⏳", tono: "dorado" },
          { etiqueta: "Vencido", valor: formatearMoneda(resumen.vencido), icono: "⚠️", tono: "rojo" },
        ]}
      />

      {/* Progreso de recaudo del periodo elegido */}
      <section className="mt-6 rounded-xl border border-line bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-semibold text-ink">Progreso de recaudo — {etiquetaPeriodo}</h2>
          <p className="text-sm font-medium text-brand">{porcentaje}% recaudado</p>
        </div>

        {/* El ancho es un valor DINAMICO, por eso va en style y no en una clase de Tailwind */}
        <div
          role="progressbar"
          aria-valuenow={Math.round(resumen.porcentaje)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progreso de recaudo"
          className="mt-4 h-3 overflow-hidden rounded-full bg-zinc-100"
        >
          <div className="h-full rounded-full bg-brand" style={{ width: `${resumen.porcentaje}%` }} />
        </div>

        <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-ink/50">
          <span>Recaudado: {formatearMoneda(resumen.recaudado)}</span>
          <span>Meta: {formatearMoneda(resumen.facturado)}</span>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Buscar por unidad, residente o concepto..."
          value={busqueda}
          onChange={(evento) => cambiarBusqueda(evento.target.value)}
          className="w-full max-w-md rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink placeholder:text-ink/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
        <select
          value={filtroEstado}
          onChange={(evento) => cambiarEstado(evento.target.value as EstadoVisualCuota | "todos")}
          aria-label="Filtrar por estado"
          className={CLASE_SELECT}
        >
          <option value="todos">Todos los estados</option>
          <option value="pagada">Al día</option>
          <option value="pendiente">Pendiente</option>
          <option value="vencida">Vencido</option>
        </select>
        <select
          value={filtroPeriodo}
          onChange={(evento) => cambiarPeriodo(evento.target.value)}
          aria-label="Filtrar por periodo"
          className={CLASE_SELECT}
        >
          <option value="todos">Todos los períodos</option>
          {periodos.map((periodo) => (
            <option key={periodo.valor} value={periodo.valor}>
              {periodo.etiqueta}
            </option>
          ))}
        </select>
      </div>

      {comprobantesPorRevisar > 0 && (
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          🧾 Hay {comprobantesPorRevisar} comprobante(s) de pago por revisar. Búscalos con la marca &quot;Comprobante&quot; en
          la columna Estado.
        </div>
      )}

      <p className="mt-4 text-sm text-ink/50">Pulsa el ID de una cuota para ver su detalle y registrar su pago.</p>

      <div className="mt-2 overflow-hidden rounded-xl border border-line bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-canvas">
              <tr className="text-xs uppercase tracking-wide text-ink/50">
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Unidad</th>
                <th className="px-4 py-3 font-medium">Residente</th>
                <th className="px-4 py-3 font-medium">Concepto</th>
                <th className="px-4 py-3 font-medium">Valor</th>
                <th className="px-4 py-3 font-medium">Vencimiento</th>
                <th className="px-4 py-3 font-medium">Fecha pago</th>
                <th className="px-4 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {visibles.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-ink/40">
                    No se encontraron cuotas con esos criterios.
                  </td>
                </tr>
              ) : (
                visibles.map((cuota) => {
                  const estado = estadoVisual(cuota);
                  const detalle = detalleDeCuota(cuota);

                  return (
                    <tr key={cuota.id} className="border-b border-line last:border-0 hover:bg-canvas/60">
                      <td className="whitespace-nowrap px-4 py-3">
                        <Link href={`/panel/cuotas/${cuota.id}`} className="font-medium text-brand hover:text-brand-dark hover:underline">
                          {codigoCuota(cuota.id)}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-ink">{detalle.unidad}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-ink/70">{detalle.residente}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-ink/70">{cuota.descripcion}</td>
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-ink">{formatearMoneda(cuota.valor)}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-ink/70">{formatearFecha(cuota.fechaLimite)}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-ink/70">
                        {cuota.fechaPago ? formatearFecha(cuota.fechaPago) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${ESTILOS_ESTADO[estado]}`}>
                            {ETIQUETAS_ESTADO[estado]}
                          </span>
                          {cuota.comprobante?.estado === "en_revision" && (
                            <span className="whitespace-nowrap rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                              🧾 Comprobante
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Paginacion
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          resumen={`Mostrando ${visibles.length} de ${totalFiltradas} cuotas`}
          onCambiar={setPagina}
        />
      </div>
    </div>
  );
}