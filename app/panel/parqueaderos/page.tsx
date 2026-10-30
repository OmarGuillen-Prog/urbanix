"use client";

import Link from "next/link";
import { useParqueaderosLista } from "./useParqueaderosLista";
import { ResumenTarjetas } from "@/components/ResumenTarjetas";
import { Paginacion } from "@/components/Paginacion";
import { ResumenNiveles } from "./ResumenNiveles";
import { estadoDeParqueadero, detalleDeParqueadero, type TipoParqueadero, type EstadoParqueadero } from "@/lib/parqueaderosStore";
import { ETIQUETAS_ESTADO, ESTILOS_ESTADO, ETIQUETAS_TIPO } from "./etiquetas";

const CLASE_SELECT =
  "rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

export default function ParqueaderosPage() {
  const {
    esAdministrador,
    niveles,
    visibles, totalFiltrados, paginaActual, totalPaginas, setPagina,
    busqueda, cambiarBusqueda,
    filtroNivel, cambiarNivel,
    filtroTipo, cambiarTipo,
    filtroEstado, cambiarEstado,
    totalEspacios, ocupados, disponibles, reservados,
    resumenNiveles,
    handleLiberar, handleReservar, handleQuitarReserva,
  } = useParqueaderosLista();

  // Guardia de ruta: modulo exclusivo del administrador (la seguridad real vive en el backend)
  if (!esAdministrador) {
    return (
      <div>
        <p className="text-ink/60">No tienes permiso para acceder a esta sección.</p>
        <Link href="/panel" className="mt-4 inline-block text-brand hover:text-brand-dark">
          ← Volver al panel
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Gestión de parqueadero</h1>
          <p className="mt-1 text-ink/60">Administra espacios y asignaciones de parqueadero</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/panel/parqueaderos/vehiculos"
            className="rounded-lg border border-line px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-brand hover:text-brand"
          >
            Ver vehículos
          </Link>
          <Link
            href="/panel/parqueaderos/asignar"
            className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
          >
            + Asignar espacio
          </Link>
        </div>
      </div>

      <ResumenTarjetas
        items={[
          { etiqueta: "Total espacios", valor: totalEspacios, icono: "🅿️", tono: "brand" },
          { etiqueta: "Ocupados", valor: ocupados, icono: "🚗", tono: "rojo" },
          { etiqueta: "Disponibles", valor: disponibles, icono: "✅", tono: "verde" },
          { etiqueta: "Reservados", valor: reservados, icono: "🔒", tono: "dorado" },
        ]}
      />

      <ResumenNiveles niveles={resumenNiveles} />

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Buscar por número de espacio, unidad, propietario o placa..."
          value={busqueda}
          onChange={(evento) => cambiarBusqueda(evento.target.value)}
          className="w-full max-w-md rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink placeholder:text-ink/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
        <select value={filtroNivel} onChange={(evento) => cambiarNivel(evento.target.value)} className={CLASE_SELECT}>
          <option value="todos">Todos los niveles</option>
          {niveles.map((nivel) => (
            <option key={nivel} value={String(nivel)}>
              Nivel {nivel}
            </option>
          ))}
        </select>
        <select value={filtroTipo} onChange={(evento) => cambiarTipo(evento.target.value as TipoParqueadero | "todos")} className={CLASE_SELECT}>
          <option value="todos">Todos los tipos</option>
          <option value="carro">Carro</option>
          <option value="moto">Moto</option>
        </select>
        <select value={filtroEstado} onChange={(evento) => cambiarEstado(evento.target.value as EstadoParqueadero | "todos")} className={CLASE_SELECT}>
          <option value="todos">Todos los estados</option>
          <option value="disponible">Disponible</option>
          <option value="ocupado">Ocupado</option>
          <option value="reservado">Reservado</option>
        </select>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-line bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-canvas">
              <tr className="text-xs uppercase tracking-wide text-ink/50">
                <th className="px-4 py-3 font-medium">Espacio</th>
                <th className="px-4 py-3 font-medium">Nivel</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Unidad</th>
                <th className="px-4 py-3 font-medium">Propietario</th>
                <th className="px-4 py-3 font-medium">Vehículo</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibles.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-ink/40">
                    No se encontraron espacios con esos criterios.
                  </td>
                </tr>
              ) : (
                visibles.map((parqueadero) => {
                  const estado = estadoDeParqueadero(parqueadero);
                  const detalle = detalleDeParqueadero(parqueadero);

                  return (
                    <tr key={parqueadero.id} className="border-b border-line last:border-0 hover:bg-canvas/60">
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-ink">{parqueadero.numero}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-ink/70">Nivel {parqueadero.nivel}</td>
                      <td className="px-4 py-3 text-ink/70">{ETIQUETAS_TIPO[parqueadero.tipo]}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ESTILOS_ESTADO[estado]}`}>
                          {ETIQUETAS_ESTADO[estado]}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-ink">{detalle.unidad}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-ink/70">{detalle.propietario}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-ink/70">{detalle.placa}</td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {estado === "ocupado" && (
                          <button
                            onClick={() => handleLiberar(parqueadero)}
                            className="text-sm font-medium text-error hover:text-error/70"
                          >
                            Liberar
                          </button>
                        )}
                        {estado === "disponible" && (
                          <button
                            onClick={() => handleReservar(parqueadero.id)}
                            className="text-sm font-medium text-brand hover:text-brand-dark"
                          >
                            Reservar
                          </button>
                        )}
                        {estado === "reservado" && (
                          <button
                            onClick={() => handleQuitarReserva(parqueadero.id)}
                            className="text-sm font-medium text-ink/60 hover:text-ink"
                          >
                            Quitar reserva
                          </button>
                        )}
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
          resumen={`Mostrando ${visibles.length} de ${totalFiltrados} espacios`}
          onCambiar={setPagina}
        />
      </div>
    </div>
  );
}