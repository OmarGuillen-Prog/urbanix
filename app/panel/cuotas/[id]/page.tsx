"use client";

import Link from "next/link";
import { useDetalleCuota } from "./useDetalleCuota";
import { FormInput } from "@/components/FormInput";
import { formatearMoneda } from "@/lib/formatos";
import { codigoCuota } from "@/lib/cuotasStore";
import { nombrePorCorreo } from "@/lib/personasHelpers";
import { ETIQUETAS_ESTADO, ESTILOS_ESTADO, ETIQUETAS_COMPROBANTE, ESTILOS_COMPROBANTE } from "../etiquetas";

function formatearFecha(fecha: string): string {
  return new Date(`${fecha}T00:00:00`).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
}

function formatearFechaIso(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
}

function Fila({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="flex items-center justify-between border-b border-line py-3 last:border-0">
      <span className="text-sm text-ink/60">{etiqueta}</span>
      <span className="text-sm font-medium text-ink">{valor}</span>
    </div>
  );
}

export default function DetalleCuotaPage() {
  const {
    esAdministrador, cuota, estado, detalle,
    fechaPago, setFechaPago,
    notaPago, setNotaPago,
    error, registrado, guardando, handleRegistrarPago,
    ampliada, setAmpliada,
    rechazando, setRechazando,
    motivoRechazo, setMotivoRechazo,
    errorRechazo, rechazado, handleRechazarComprobante,
  } = useDetalleCuota();

  const enlaceVolver = (
    <Link href="/panel/cuotas" className="text-sm text-ink/60 hover:text-brand">
      ← Volver a cuotas
    </Link>
  );

  // Registrar pagos y revisar comprobantes es tarea del administrador (la seguridad real vive en el backend)
  if (!esAdministrador) {
    return (
      <div>
        {enlaceVolver}
        <p className="mt-4 text-ink/60">No tienes permiso para acceder a esta sección.</p>
      </div>
    );
  }

  if (!cuota || !estado || !detalle) {
    return (
      <div>
        {enlaceVolver}
        <p className="mt-4 text-ink/60">Cuota no encontrada.</p>
      </div>
    );
  }

  const comprobante = cuota.comprobante;

  return (
    <div>
      {enlaceVolver}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">{codigoCuota(cuota.id)}</h1>
          <p className="mt-1 text-ink/60">
            {cuota.descripcion} · Unidad {detalle.unidad}
          </p>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ESTILOS_ESTADO[estado]}`}>
          {ETIQUETAS_ESTADO[estado]}
        </span>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-line bg-white p-5">
          <h2 className="font-display text-lg font-semibold text-ink">Datos de la cuota</h2>
          <div className="mt-2">
            <Fila etiqueta="Unidad" valor={detalle.unidad} />
            <Fila etiqueta="Residente (propietario)" valor={detalle.residente} />
            <Fila etiqueta="Concepto" valor={cuota.descripcion} />
            <Fila etiqueta="Valor" valor={formatearMoneda(cuota.valor)} />
            <Fila etiqueta="Vencimiento" valor={formatearFecha(cuota.fechaLimite)} />
            <Fila etiqueta="Fecha de pago" valor={cuota.fechaPago ? formatearFecha(cuota.fechaPago) : "—"} />
            <Fila etiqueta="Nota del pago" valor={cuota.notaPago ?? "—"} />
          </div>
        </section>

        <div className="flex flex-col gap-6">
          {/* ---------- Comprobante que subio el residente ---------- */}
          {comprobante && (
            <section className="rounded-xl border border-line bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-lg font-semibold text-ink">Comprobante de pago</h2>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ESTILOS_COMPROBANTE[comprobante.estado]}`}>
                  {ETIQUETAS_COMPROBANTE[comprobante.estado]}
                </span>
              </div>

              {rechazado && (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  ✓ Comprobante rechazado. El residente recibió una notificación con el motivo.
                </div>
              )}

              <button
                onClick={() => setAmpliada(true)}
                aria-label="Ver el comprobante en grande"
                className="mt-4 block overflow-hidden rounded-lg border border-line"
              >
                {/* Es una imagen en memoria (data URL): next/image no aplica, por eso <img> */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={comprobante.imagen} alt="Comprobante de pago" className="max-h-56 w-auto object-contain" />
              </button>
              <p className="mt-2 text-xs text-ink/50">
                Enviado por {nombrePorCorreo(comprobante.subidoPor)} el {formatearFechaIso(comprobante.fechaSubida)}. Pulsa la
                imagen para verla en grande.
              </p>

              {comprobante.estado === "rechazado" && (
                <p className="mt-3 text-sm text-error">Motivo del rechazo: {comprobante.motivoRechazo}</p>
              )}

              {comprobante.estado === "en_revision" && (
                <div className="mt-4">
                  <p className="text-sm text-ink/60">
                    Si el comprobante es correcto, registra el pago en el formulario de abajo y quedará aprobado.
                  </p>

                  {!rechazando ? (
                    <button
                      onClick={() => setRechazando(true)}
                      className="mt-3 rounded-lg border border-error/30 px-3.5 py-2 text-sm font-medium text-error transition-colors hover:border-error"
                    >
                      Rechazar comprobante
                    </button>
                  ) : (
                    <form onSubmit={handleRechazarComprobante} className="mt-3 flex flex-col gap-3">
                      <label
                        htmlFor="motivoRechazo"
                        className="block text-xs font-medium uppercase tracking-wide text-ink/60"
                      >
                        Motivo del rechazo
                      </label>
                      <textarea
                        id="motivoRechazo"
                        rows={2}
                        placeholder="Ej: La imagen está borrosa o el valor no coincide"
                        value={motivoRechazo}
                        onChange={(evento) => setMotivoRechazo(evento.target.value)}
                        className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink placeholder:text-ink/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                      />
                      {errorRechazo && <p className="text-sm text-error">{errorRechazo}</p>}
                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          className="rounded-lg bg-error px-3.5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                        >
                          Confirmar rechazo
                        </button>
                        <button
                          type="button"
                          onClick={() => setRechazando(false)}
                          className="rounded-lg border border-line px-3.5 py-2 text-sm text-ink/70 hover:border-brand hover:text-brand"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </section>
          )}

          {/* ---------- Registrar el pago ---------- */}
          <section className="rounded-xl border border-line bg-white p-5">
            <h2 className="font-display text-lg font-semibold text-ink">Registrar pago</h2>

            {registrado && (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                ✓ Pago registrado. Los residentes de la propiedad recibieron una notificación.
              </div>
            )}

            {cuota.estadoPago === "pagada" ? (
              <p className="mt-3 text-sm text-ink/60">Esta cuota ya tiene su pago registrado.</p>
            ) : (
              <form onSubmit={handleRegistrarPago} className="mt-3 flex flex-col gap-4">
                <p className="text-sm text-ink/60">
                  La plataforma no procesa pagos. Registra aquí el pago que el residente hizo por fuera (consignación,
                  transferencia o efectivo).
                </p>

                <FormInput
                  id="fechaPago"
                  label="Fecha en que se pagó"
                  type="date"
                  value={fechaPago}
                  onChange={setFechaPago}
                  error={error ?? undefined}
                />

                <div>
                  <label
                    htmlFor="notaPago"
                    className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60"
                  >
                    Nota o referencia (opcional)
                  </label>
                  <textarea
                    id="notaPago"
                    rows={2}
                    placeholder="Ej: Consignación Bancolombia, ref. 4521"
                    value={notaPago}
                    onChange={(evento) => setNotaPago(evento.target.value)}
                    className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink placeholder:text-ink/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={guardando}
                  className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
                >
                  {guardando ? "Guardando..." : "Registrar pago"}
                </button>
              </form>
            )}
          </section>
        </div>
      </div>

      {/* Imagen en grande: un clic en cualquier parte la cierra */}
      {ampliada && comprobante && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Comprobante ampliado"
          onClick={() => setAmpliada(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={comprobante.imagen} alt="Comprobante de pago ampliado" className="max-h-full max-w-full rounded-lg bg-white" />
          <button
            onClick={() => setAmpliada(false)}
            className="absolute right-4 top-4 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-ink"
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
}