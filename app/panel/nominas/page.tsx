"use client";

import { useNominaForm } from "./useNominaForm";
import { FormInput } from "@/components/FormInput";

function formatearMoneda(valor: number): string {
  return valor.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
}

function formatearFecha(fecha: string): string {
  return new Date(`${fecha}T00:00:00`).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
}

export default function NominasPage() {
  const {
    registros,
    nombreEmpleado, setNombreEmpleado,
    cargo, setCargo,
    salario, setSalario,
    fechaPago, setFechaPago,
    observaciones, setObservaciones,
    errores,
    guardando,
    handleSubmit,
    handleMarcarPagado,
  } = useNominaForm();

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Nómina de empleados</h1>
      <p className="mt-1 text-ink/60">Gestiona los pagos al personal del conjunto residencial.</p>

      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl rounded-xl border border-line bg-white p-6">
        <p className="font-display text-lg font-semibold text-ink">Registrar pago</p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            id="nombreEmpleado"
            label="Nombre del empleado"
            placeholder="Ej: Andrés Vélez"
            value={nombreEmpleado}
            onChange={setNombreEmpleado}
            error={errores.nombreEmpleado}
          />
          <FormInput
            id="cargo"
            label="Cargo"
            placeholder="Ej: Portero"
            value={cargo}
            onChange={setCargo}
            error={errores.cargo}
          />
          <FormInput
            id="salario"
            label="Salario (COP)"
            type="number"
            placeholder="Ej: 1400000"
            value={salario}
            onChange={setSalario}
            error={errores.salario}
          />
          <FormInput
            id="fechaPago"
            label="Fecha de pago"
            type="date"
            value={fechaPago}
            onChange={setFechaPago}
            error={errores.fechaPago}
          />
        </div>

        <div className="mt-4">
          <label htmlFor="observaciones" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
            Observaciones (opcional)
          </label>
          <textarea
            id="observaciones"
            rows={2}
            value={observaciones}
            onChange={(evento) => setObservaciones(evento.target.value)}
            placeholder="Ej: Incluye recargo por horas extra"
            className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink placeholder:text-ink/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>

        <button
          type="submit"
          disabled={guardando}
          className="mt-4 rounded-lg bg-brand px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
        >
          {guardando ? "Guardando..." : "Registrar pago"}
        </button>
      </form>

      <p className="mt-10 font-display text-lg font-semibold text-ink">Historial de nómina</p>

      <div className="mt-4 overflow-hidden rounded-xl border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-canvas">
            <tr>
              <th className="px-4 py-3 font-medium text-ink/60">Empleado</th>
              <th className="px-4 py-3 font-medium text-ink/60">Cargo</th>
              <th className="px-4 py-3 font-medium text-ink/60">Salario</th>
              <th className="px-4 py-3 font-medium text-ink/60">Fecha de pago</th>
              <th className="px-4 py-3 font-medium text-ink/60">Estado</th>
              <th className="px-4 py-3 font-medium text-ink/60">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {registros.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink/40">
                  No hay registros de nómina.
                </td>
              </tr>
            ) : (
              registros.map((registro) => (
                <tr key={registro.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink">{registro.nombreEmpleado}</td>
                  <td className="px-4 py-3 text-ink/70">{registro.cargo}</td>
                  <td className="px-4 py-3 text-ink/70">{formatearMoneda(registro.salario)}</td>
                  <td className="px-4 py-3 text-ink/70">{formatearFecha(registro.fechaPago)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        registro.estadoPago === "pagado"
                          ? "rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700"
                          : "rounded-full bg-gold/20 px-2.5 py-0.5 text-xs font-medium text-gold"
                      }
                    >
                      {registro.estadoPago === "pagado" ? "Pagado" : "Pendiente"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {registro.estadoPago === "pendiente" && (
                      <button
                        onClick={() => handleMarcarPagado(registro.id)}
                        className="text-sm font-medium text-brand hover:text-brand-dark"
                      >
                        Marcar como pagado
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}