"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useListaPropiedades } from "./useListaPropiedades";
import { usePropiedadesResidente } from "./usePropiedadesResidente";
import { ResumenTarjetas } from "@/components/ResumenTarjetas";
import type { Propiedad } from "@/lib/propiedadesStore";

const ETIQUETAS_TIPO: Record<string, string> = {
  apartamento: "Apartamento",
  casa: "Casa",
  local: "Local comercial",
};

const ETIQUETAS_ESTADO: Record<Propiedad["estadoOcupacion"], string> = {
  ocupado: "Ocupado",
  vacio: "Disponible",
  mantenimiento: "En mantenimiento",
};

// Estilos del badge que va sobre el encabezado verde de cada tarjeta
const ESTILOS_BADGE: Record<Propiedad["estadoOcupacion"], string> = {
  ocupado: "bg-emerald-100 text-emerald-700",
  vacio: "bg-white/90 text-ink/60",
  mantenimiento: "bg-amber-100 text-amber-700",
};

function formatearMoneda(valor: number): string {
  return valor.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
}

export default function PropiedadesPage() {
  const { usuario } = useAuth();

  if (usuario?.rol === "residente") {
    return <VistaResidente />;
  }
  return <VistaAdministrador />;
}

function VistaResidente() {
  const { misPropiedades } = usePropiedadesResidente();

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Mi propiedad</h1>
      <p className="mt-1 text-ink/60">Información de las propiedades asociadas a tu cuenta.</p>

      {misPropiedades.length === 0 ? (
        <p className="mt-6 text-ink/40">No tienes propiedades asociadas todavía.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {misPropiedades.map((propiedad) => (
            <div key={propiedad.id} className="rounded-xl border border-line bg-white p-6">
              <div className="flex items-center justify-between">
                <p className="font-display text-lg font-semibold text-ink">
                  Torre {propiedad.torre} - {propiedad.numero}
                </p>
                <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand">
                  {propiedad.miRelacion}
                </span>
              </div>

              <dl className="mt-4 flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink/60">Tipo</dt>
                  <dd className="text-ink">{ETIQUETAS_TIPO[propiedad.tipo]}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink/60">Área</dt>
                  <dd className="text-ink">{propiedad.area} m²</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink/60">Estado</dt>
                  <dd className="text-ink">{ETIQUETAS_ESTADO[propiedad.estadoOcupacion]}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function VistaAdministrador() {
  const {
    propiedadesFiltradas,
    busqueda, setBusqueda,
    filtroTipo, setFiltroTipo,
    filtroEstado, setFiltroEstado,
    nombrePorId,
    cuotaMensual,
    handleEliminar,
    totalUnidades,
    ocupadas,
    disponibles,
    enMantenimiento,
  } = useListaPropiedades();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Propiedades</h1>
          <p className="mt-1 text-ink/60">Gestiona unidades residenciales y propiedades.</p>
        </div>

        <Link
          href="/panel/propiedades/nueva"
          className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          + Registrar propiedad
        </Link>
      </div>

      <ResumenTarjetas
        items={[
          { etiqueta: "Total unidades", valor: totalUnidades, icono: "🏢", tono: "brand" },
          { etiqueta: "Ocupadas", valor: ocupadas, icono: "🏠", tono: "verde" },
          { etiqueta: "Disponibles", valor: disponibles, icono: "🔑", tono: "dorado" },
          { etiqueta: "En mantenimiento", valor: enMantenimiento, icono: "🛠️", tono: "gris" },
        ]}
      />

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Buscar por número de unidad o propietario..."
          value={busqueda}
          onChange={(evento) => setBusqueda(evento.target.value)}
          className="w-full max-w-md rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink placeholder:text-ink/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
        <select
          value={filtroTipo}
          onChange={(evento) => setFiltroTipo(evento.target.value as typeof filtroTipo)}
          className="rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        >
          <option value="todos">Todos los tipos</option>
          <option value="apartamento">Apartamento</option>
          <option value="casa">Casa</option>
          <option value="local">Local comercial</option>
        </select>
        <select
          value={filtroEstado}
          onChange={(evento) => setFiltroEstado(evento.target.value as typeof filtroEstado)}
          className="rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        >
          <option value="todos">Todos los estados</option>
          <option value="ocupado">Ocupado</option>
          <option value="vacio">Disponible</option>
          <option value="mantenimiento">En mantenimiento</option>
        </select>
      </div>

      {propiedadesFiltradas.length === 0 ? (
        <p className="mt-8 text-ink/40">No se encontraron propiedades con esos criterios.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {propiedadesFiltradas.map((propiedad) => {
            const cuota = cuotaMensual(propiedad.id);
            return (
              <div
                key={propiedad.id}
                className="overflow-hidden rounded-xl border border-line bg-white transition-shadow hover:shadow-md"
              >
                <div className="relative flex h-28 items-center justify-center bg-gradient-to-br from-brand to-brand-dark">
                  <span className="text-4xl opacity-40">🏢</span>
                  <span
                    className={`absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-medium ${ESTILOS_BADGE[propiedad.estadoOcupacion]}`}
                  >
                    {ETIQUETAS_ESTADO[propiedad.estadoOcupacion]}
                  </span>
                </div>

                <div className="p-4">
                  <p className="font-display text-lg font-semibold text-ink">
                    {propiedad.torre}-{propiedad.numero}
                  </p>
                  <p className="text-sm text-ink/60">{ETIQUETAS_TIPO[propiedad.tipo]}</p>

                  <div className="mt-3 flex items-center gap-4 text-sm text-ink/60">
                    <span>{propiedad.habitaciones} Hab</span>
                    <span>{propiedad.banos} Baños</span>
                    <span>{propiedad.area} m²</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-sm">
                    <span className="text-ink/60">Propietario:</span>
                    <span className="font-medium text-ink">{nombrePorId(propiedad.idPropietario)}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-sm">
                    <span className="text-ink/60">Cuota:</span>
                    <span className="font-medium text-brand">
                      {cuota !== null ? `${formatearMoneda(cuota)}/mes` : "Sin registrar"}
                    </span>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/panel/propiedades/${propiedad.id}`}
                      className="flex-1 rounded-lg border border-brand px-3 py-2 text-center text-sm font-medium text-brand transition-colors hover:bg-brand hover:text-white"
                    >
                      Ver Detalles
                    </Link>
                    <button
                      onClick={() => handleEliminar(propiedad.id, `${propiedad.torre}-${propiedad.numero}`)}
                      className="rounded-lg border border-line px-3 py-2 text-sm text-error transition-colors hover:border-error"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}