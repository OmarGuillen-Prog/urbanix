"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEditarPropiedad } from "./useEditarPropiedad";
import { FormInput } from "@/components/FormInput";
import { obtenerUsuarios } from "@/lib/usuariosStore";

export default function EditarPropiedadPage() {
  const params = useParams<{ id: string }>();

  const {
    propiedadExiste,
    numero, setNumero,
    torre, setTorre,
    tipo, setTipo,
    area, setArea,
    estadoOcupacion, setEstadoOcupacion,
    idPropietario, setIdPropietario,
    idArrendatario, setIdArrendatario,
    errores,
    guardando,
    handleSubmit,
  } = useEditarPropiedad(params.id);

  // La lista de usuarios para poblar los selects de propietario y
  // arrendatario - se recalcula en cada render, algo aceptable con
  // pocos usuarios (si esto creciera a miles, seria candidato a
  // useMemo, como vimos en el buscador de Usuarios).
  const usuarios = obtenerUsuarios();

  if (!propiedadExiste) {
    return (
      <div>
        <p className="text-ink/60">Propiedad no encontrada.</p>
        <Link href="/panel/propiedades" className="mt-4 inline-block text-brand hover:text-brand-dark">
          ← Volver al listado
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/panel/propiedades" className="text-sm text-ink/60 hover:text-brand">
        ← Volver al listado
      </Link>

      <h1 className="mt-4 font-display text-3xl font-semibold text-ink">
        Editar propiedad
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 flex max-w-lg flex-col gap-5">
        <FormInput id="numero" label="Número de propiedad" value={numero} onChange={setNumero} error={errores.numero} />
        <FormInput id="torre" label="Torre / Bloque" value={torre} onChange={setTorre} error={errores.torre} />

        <div>
          <label htmlFor="tipo" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
            Tipo
          </label>
          <select
            id="tipo"
            value={tipo}
            onChange={(evento) => setTipo(evento.target.value as "apartamento" | "casa" | "local")}
            className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          >
            <option value="apartamento">Apartamento</option>
            <option value="casa">Casa</option>
            <option value="local">Local comercial</option>
          </select>
        </div>

        <FormInput id="area" label="Área (m²)" type="number" value={area} onChange={setArea} error={errores.area} />

        {/* HU-15: cambiar estado de ocupacion */}
        <div>
          <label htmlFor="estado" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
            Estado de ocupación
          </label>
          <select
            id="estado"
            value={estadoOcupacion}
            onChange={(evento) => setEstadoOcupacion(evento.target.value as "ocupado" | "vacio")}
            className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          >
            <option value="vacio">Vacío</option>
            <option value="ocupado">Ocupado</option>
          </select>
        </div>

        {/* HU-13: asignar propietario. Las <option> se generan
            dinamicamente con .map() sobre la lista real de usuarios,
            a diferencia de los selects anteriores con opciones fijas. */}
        <div>
          <label htmlFor="propietario" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
            Propietario
          </label>
          <select
            id="propietario"
            value={idPropietario ?? ""}
            onChange={(evento) => setIdPropietario(evento.target.value)}
            className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          >
            <option value="">Sin asignar</option>
            {usuarios.map((usuario) => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.nombres} {usuario.apellidos}
              </option>
            ))}
          </select>
        </div>

        {/* HU-14: asignar arrendatario, mismo patron que propietario */}
        <div>
          <label htmlFor="arrendatario" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
            Arrendatario
          </label>
          <select
            id="arrendatario"
            value={idArrendatario ?? ""}
            onChange={(evento) => setIdArrendatario(evento.target.value)}
            className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          >
            <option value="">Sin asignar</option>
            {usuarios.map((usuario) => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.nombres} {usuario.apellidos}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={guardando}
          className="mt-2 rounded-lg bg-brand px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
        >
          {guardando ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}