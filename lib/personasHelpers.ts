// Ayudantes para "traducir" un correo a datos legibles. Los usan PQRS y Reservas.
import { obtenerUsuarioPorCorreo } from "./usuariosStore";
import { obtenerPropiedades } from "./propiedadesStore";

// La unidad del usuario: la primera propiedad donde es propietario o arrendatario
export function unidadDeUsuario(correo: string): string {
  const usuario = obtenerUsuarioPorCorreo(correo);
  if (!usuario) return "—";

  const propiedad = obtenerPropiedades().find(
    (p) => p.idPropietario === usuario.id || p.idArrendatario === usuario.id
  );
  return propiedad ? `${propiedad.torre}-${propiedad.numero}` : "—";
}

export function nombrePorCorreo(correo: string | null): string {
  if (!correo) return "Sin asignar";
  const usuario = obtenerUsuarioPorCorreo(correo);
  return usuario ? `${usuario.nombres} ${usuario.apellidos}` : "Sin asignar";
}