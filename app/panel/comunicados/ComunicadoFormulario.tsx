"use client";

import Link from "next/link";
import { useComunicadoFormulario } from "./useComunicadoFormulario";
import { FormInput } from "@/components/FormInput";
import type { CategoriaComunicado, DestinoComunicado, EstadoComunicado } from "@/lib/comunicadosStore";

const CLASE_SELECT =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";
const CLASE_ETIQUETA = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60";

export function ComunicadoFormulario({ comunicadoId }: { comunicadoId?: string }) {
  const {
    esAdministrador, esEdicion, comunicadoExiste,
    titulo, setTitulo,
    contenido, setContenido,
    categoria, setCategoria,
    destino, setDestino,
    estado, setEstado,
    fijado, setFijado,
    errores, guardando, handleSubmit,
  } = useComunicadoFormulario(comunicadoId);

  const enlaceVolver = (
    <Link href="/panel/comunicados" className="text-sm text-ink/60 hover:text-brand">
      ← Volver a comunicados
    </Link>
  );

  // RF-34, RF-38: solo el administrador crea y edita comunicados (la seguridad real vive en el backend)
  if (!esAdministrador) {
    return (
      <div>
        {enlaceVolver}
        <p className="mt-4 text-ink/60">No tienes permiso para acceder a esta sección.</p>
      </div>
    );
  }

  if (esEdicion && !comunicadoExiste) {
    return (
      <div>
        {enlaceVolver}
        <p className="mt-4 text-ink/60">Comunicado no encontrado.</p>
      </div>
    );
  }

  return (
    <div>
      {enlaceVolver}

      <h1 className="mt-4 font-display text-3xl font-semibold text-ink">
        {esEdicion ? "Editar comunicado" : "Nuevo comunicado"}
      </h1>
      <p className="mt-1 text-ink/60">Al publicarlo, los destinatarios reciben una notificación. Un borrador no avisa a nadie.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex max-w-lg flex-col gap-5">
        <FormInput
          id="titulo"
          label="Título"
          placeholder="Ej: Mantenimiento preventivo de ascensores"
          value={titulo}
          onChange={setTitulo}
          error={errores.titulo}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="categoria" className={CLASE_ETIQUETA}>Categoría</label>
            <select
              id="categoria"
              value={categoria}
              onChange={(evento) => setCategoria(evento.target.value as CategoriaComunicado)}
              className={CLASE_SELECT}
            >
              <option value="mantenimiento">Mantenimiento</option>
              <option value="administrativo">Administrativo</option>
              <option value="normativo">Normativo</option>
              <option value="comunidad">Comunidad</option>
            </select>
          </div>

          <div>
            <label htmlFor="destino" className={CLASE_ETIQUETA}>Dirigido a</label>
            <select
              id="destino"
              value={destino}
              onChange={(evento) => setDestino(evento.target.value as DestinoComunicado)}
              className={CLASE_SELECT}
            >
              <option value="todos">Todos</option>
              <option value="propietarios">Solo propietarios</option>
              <option value="arrendatarios">Solo arrendatarios</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="contenido" className={CLASE_ETIQUETA}>Contenido</label>
          <textarea
            id="contenido"
            rows={7}
            placeholder="Escribe el comunicado..."
            value={contenido}
            onChange={(evento) => setContenido(evento.target.value)}
            className={CLASE_SELECT}
          />
          {errores.contenido && <p className="mt-1.5 text-sm text-error">{errores.contenido}</p>}
        </div>

        <div>
          <label htmlFor="estado" className={CLASE_ETIQUETA}>Estado</label>
          <select
            id="estado"
            value={estado}
            onChange={(evento) => setEstado(evento.target.value as EstadoComunicado)}
            className={CLASE_SELECT}
          >
            <option value="publicado">Publicado</option>
            <option value="borrador">Borrador (no se muestra ni avisa)</option>
            {/* Archivar solo tiene sentido en algo que ya existe */}
            {esEdicion && <option value="archivado">Archivado (se oculta a los residentes)</option>}
          </select>
        </div>

        <label className="flex items-center gap-3 text-sm text-ink">
          <input
            type="checkbox"
            checked={fijado}
            onChange={(evento) => setFijado(evento.target.checked)}
            className="h-4 w-4 rounded border-line accent-brand"
          />
          📌 Fijar al inicio de la lista
        </label>

        <button
          type="submit"
          disabled={guardando}
          className="mt-2 rounded-lg bg-brand px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
        >
          {guardando ? "Guardando..." : esEdicion ? "Guardar cambios" : estado === "borrador" ? "Guardar borrador" : "Publicar comunicado"}
        </button>
      </form>
    </div>
  );
}