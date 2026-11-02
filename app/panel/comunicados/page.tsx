"use client";

import Link from "next/link";
import { useComunicadosLista } from "./useComunicadosLista";
import { ResumenTarjetas } from "@/components/ResumenTarjetas";
import { TarjetaComunicado } from "./TarjetaComunicado";
import type { CategoriaComunicado, DestinoComunicado, EstadoComunicado } from "@/lib/comunicadosStore";

const CLASE_SELECT =
  "rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

export default function ComunicadosPage() {
  const {
    esAdministrador,
    filtrados,
    expandidos,
    filtroCategoria, setFiltroCategoria,
    filtroDestino, setFiltroDestino,
    filtroEstado, setFiltroEstado,
    total, fijados, publicadosEsteMes, totalVisualizaciones, sinLeer,
    esNuevo,
    handleAlternarExpandido,
    handleAlternarFijado,
    handleEliminar,
  } = useComunicadosLista();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Comunicados</h1>
          <p className="mt-1 text-ink/60">
            {esAdministrador ? "Publica y gestiona anuncios para los residentes" : "Anuncios oficiales del conjunto"}
          </p>
        </div>

        {/* RF-34: solo el administrador publica comunicados */}
        {esAdministrador && (
          <Link
            href="/panel/comunicados/nuevo"
            className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
          >
            + Nuevo comunicado
          </Link>
        )}
      </div>

      <ResumenTarjetas
        items={
          esAdministrador
            ? [
                { etiqueta: "Total comunicados", valor: total, icono: "📢", tono: "brand" },
                { etiqueta: "Total visualizaciones", valor: totalVisualizaciones, icono: "👁", tono: "verde" },
                { etiqueta: "Fijados", valor: fijados, icono: "📌", tono: "dorado" },
                { etiqueta: "Publicados este mes", valor: publicadosEsteMes, icono: "📅", tono: "gris" },
              ]
            : [
                { etiqueta: "Comunicados", valor: total, icono: "📢", tono: "brand" },
                { etiqueta: "Sin leer", valor: sinLeer, icono: "📬", tono: "rojo" },
                { etiqueta: "Fijados", valor: fijados, icono: "📌", tono: "dorado" },
                { etiqueta: "Publicados este mes", valor: publicadosEsteMes, icono: "📅", tono: "gris" },
              ]
        }
      />

      <div className="mt-6 flex flex-wrap gap-3">
        <select
          value={filtroCategoria}
          onChange={(evento) => setFiltroCategoria(evento.target.value as CategoriaComunicado | "todas")}
          aria-label="Filtrar por categoría"
          className={CLASE_SELECT}
        >
          <option value="todas">Todas las categorías</option>
          <option value="mantenimiento">Mantenimiento</option>
          <option value="administrativo">Administrativo</option>
          <option value="normativo">Normativo</option>
          <option value="comunidad">Comunidad</option>
        </select>

        {/* Destinatarios y estado solo tienen sentido para quien administra */}
        {esAdministrador && (
          <>
            <select
              value={filtroDestino}
              onChange={(evento) => setFiltroDestino(evento.target.value as DestinoComunicado | "cualquiera")}
              aria-label="Filtrar por destinatarios"
              className={CLASE_SELECT}
            >
              <option value="cualquiera">Todos los destinatarios</option>
              <option value="todos">Para todos</option>
              <option value="propietarios">Para propietarios</option>
              <option value="arrendatarios">Para arrendatarios</option>
            </select>
            <select
              value={filtroEstado}
              onChange={(evento) => setFiltroEstado(evento.target.value as EstadoComunicado | "todos")}
              aria-label="Filtrar por estado"
              className={CLASE_SELECT}
            >
              <option value="todos">Todos los estados</option>
              <option value="publicado">Publicado</option>
              <option value="borrador">Borrador</option>
              <option value="archivado">Archivado</option>
            </select>
          </>
        )}
      </div>

      {filtrados.length === 0 ? (
        <p className="mt-8 text-ink/40">No hay comunicados para mostrar.</p>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {filtrados.map((comunicado) => (
            <TarjetaComunicado
              key={comunicado.id}
              comunicado={comunicado}
              expandido={expandidos.includes(comunicado.id)}
              esAdministrador={esAdministrador}
              esNuevo={esNuevo(comunicado)}
              onAlternarExpandido={() => handleAlternarExpandido(comunicado.id)}
              onAlternarFijado={() => handleAlternarFijado(comunicado.id)}
              onEliminar={() => handleEliminar(comunicado.id, comunicado.titulo)}
            />
          ))}
        </div>
      )}
    </div>
  );
}