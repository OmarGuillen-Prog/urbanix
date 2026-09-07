"use client";

import { useAuth } from "@/context/AuthContext";
import { useCuotasResidente } from "./useCuotasResidente";
import { useCuotasAdmin } from "./useCuotasAdmin";
import { estadoVisual, diasParaVencer } from "@/lib/cuotasStore";

const ETIQUETAS_ESTADO: Record<string, string> = {
  pendiente: "Pendiente",
  vencida: "Vencida",
  pagada: "Pagada",
};

const ESTILOS_ESTADO: Record<string, string> = {
  pendiente: "bg-gold/20 text-gold",
  vencida: "bg-error/10 text-error",
  pagada: "bg-emerald-100 text-emerald-700",
};

function formatearMoneda(valor: number): string {
  return valor.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
}

function formatearFecha(fecha: string): string {
  return new Date(`${fecha}T00:00:00`).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
}

export default function CuotasPage() {
  const { usuario } = useAuth();
  const esAdministrador = usuario?.rol === "administrador";

  if (esAdministrador) {
    return <VistaAdministrador />;
  }
  return <VistaResidente />;
}

function VistaResidente() {
  const { cuotas, sinDeudas, nombrePropiedad, handlePagar } = useCuotasResidente();

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Mis cuotas</h1>
      <p className="mt-1 text-ink/60">Consulta y paga tus cuotas de administración.</p>

      {/* RF-31: mensaje informativo cuando no hay deudas */}
      {sinDeudas ? (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          ✓ Estás al día. No tienes cuotas pendientes.
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {cuotas.map((cuota) => {
        const estado = estadoVisual(cuota);
        const dias = diasParaVencer(cuota.fechaLimite);

        return (
            <div key={cuota.id} className="rounded-xl border border-line bg-white p-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                {/* Nuevo: badge con la propiedad a la que pertenece esta
                    cuota, para que un residente con varias propiedades
                    sepa cual es cual de un vistazo */}
                <span className="inline-block rounded-full bg-canvas px-2 py-0.5 text-xs font-medium text-ink/60">
                    {nombrePropiedad(cuota.idPropiedad)}
                </span>
                <p className="mt-1.5 font-medium text-ink">{cuota.descripcion}</p>
                <p className="mt-1 text-sm text-ink/60">
                    Vence el {formatearFecha(cuota.fechaLimite)}
                </p>
                {estado === "pendiente" && dias <= 3 && (
                    <p className="mt-1 text-xs text-gold">
                    ⏰ Vence en {dias} día(s)
                    </p>
                )}
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${ESTILOS_ESTADO[estado]}`}>
                {ETIQUETAS_ESTADO[estado]}
                </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
                <p className="font-display text-xl font-semibold text-ink">
                {formatearMoneda(cuota.valor)}
                </p>
                {estado !== "pagada" && (
                <button
                    onClick={() => handlePagar(cuota.id)}
                    className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
                >
                    Pagar
                </button>
                )}
            </div>
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
    propiedades, cuotas,
    idPropiedad, setIdPropiedad,
    valor, setValor,
    descripcion, setDescripcion,
    fechaLimite, setFechaLimite,
    errores, guardando, handleSubmit,
  } = useCuotasAdmin();

  function nombrePropiedad(idPropiedad: string): string {
    const propiedad = propiedades.find((p) => p.id === idPropiedad);
    return propiedad ? `Torre ${propiedad.torre} - ${propiedad.numero}` : "Propiedad desconocida";
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Cuotas de administración</h1>
      <p className="mt-1 text-ink/60">Registra y consulta las cuotas de todas las propiedades.</p>

      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl rounded-xl border border-line bg-white p-6">
        <p className="font-display text-lg font-semibold text-ink">Registrar cuota</p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="propiedad" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
              Propiedad
            </label>
            <select
              id="propiedad"
              value={idPropiedad}
              onChange={(evento) => setIdPropiedad(evento.target.value)}
              className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            >
              {propiedades.map((propiedad) => (
                <option key={propiedad.id} value={propiedad.id}>
                  Torre {propiedad.torre} - {propiedad.numero}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="valor" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
              Valor (COP)
            </label>
            <input
              id="valor"
              type="number"
              placeholder="Ej: 250000"
              value={valor}
              onChange={(evento) => setValor(evento.target.value)}
              className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink placeholder:text-ink/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
            {errores.valor && <p className="mt-1.5 text-sm text-error">{errores.valor}</p>}
          </div>

          <div>
            <label htmlFor="descripcion" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
              Descripción
            </label>
            <input
              id="descripcion"
              type="text"
              placeholder="Ej: Administración - Octubre"
              value={descripcion}
              onChange={(evento) => setDescripcion(evento.target.value)}
              className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink placeholder:text-ink/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
            {errores.descripcion && <p className="mt-1.5 text-sm text-error">{errores.descripcion}</p>}
          </div>

          <div>
            <label htmlFor="fechaLimite" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
              Fecha límite
            </label>
            <input
              id="fechaLimite"
              type="date"
              value={fechaLimite}
              onChange={(evento) => setFechaLimite(evento.target.value)}
              className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
            {errores.fechaLimite && <p className="mt-1.5 text-sm text-error">{errores.fechaLimite}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={guardando}
          className="mt-4 rounded-lg bg-brand px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
        >
          {guardando ? "Guardando..." : "Registrar cuota"}
        </button>
      </form>

      <p className="mt-10 font-display text-lg font-semibold text-ink">Todas las cuotas</p>

      <div className="mt-4 overflow-hidden rounded-xl border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-canvas">
            <tr>
              <th className="px-4 py-3 font-medium text-ink/60">Propiedad</th>
              <th className="px-4 py-3 font-medium text-ink/60">Descripción</th>
              <th className="px-4 py-3 font-medium text-ink/60">Valor</th>
              <th className="px-4 py-3 font-medium text-ink/60">Fecha límite</th>
              <th className="px-4 py-3 font-medium text-ink/60">Estado</th>
            </tr>
          </thead>
          <tbody>
            {cuotas.map((cuota) => {
              const estado = estadoVisual(cuota);
              return (
                <tr key={cuota.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink">{nombrePropiedad(cuota.idPropiedad)}</td>
                  <td className="px-4 py-3 text-ink/70">{cuota.descripcion}</td>
                  <td className="px-4 py-3 text-ink/70">{formatearMoneda(cuota.valor)}</td>
                  <td className="px-4 py-3 text-ink/70">{formatearFecha(cuota.fechaLimite)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ESTILOS_ESTADO[estado]}`}>
                      {ETIQUETAS_ESTADO[estado]}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}