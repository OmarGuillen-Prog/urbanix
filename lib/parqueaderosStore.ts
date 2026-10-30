import { obtenerPropiedades } from "./propiedadesStore";
import { obtenerUsuarios, obtenerUsuarioPorCorreo } from "./usuariosStore";
import { obtenerVehiculos } from "./vehiculosStore";

// Regla de negocio (RF-66/67): maximo de espacios por propiedad
export const MAX_PARQUEADEROS_POR_PROPIEDAD = 2;

export type TipoParqueadero = "carro" | "moto";
export type EstadoParqueadero = "disponible" | "ocupado" | "reservado";

export interface Parqueadero {
  id: string;
  numero: string; // "N1-01" = Nivel 1, puesto 01
  nivel: number;
  tipo: TipoParqueadero;
  idPropiedad: string | null;
  reservado: boolean; // apartado por la administracion (visitantes, uso especial)
}

// Asignaciones de ejemplo: numero de espacio -> id de propiedad
const ASIGNACIONES: Record<string, string> = {
  "N1-01": "3", // el espacio del vehiculo ABC123 de Juan Manuel
  "N2-02": "3",
  "N1-02": "1",
  "N1-03": "1",
  "N2-04": "4",
  "N3-03": "4",
};
const RESERVADOS = new Set(["N1-08", "N2-08", "N3-08"]);

// Inventario FIJO: los espacios ya existen fisicamente, solo cambia a quien
// estan asignados. Lo generamos con un ciclo en vez de escribir 24 lineas.
function generarParqueaderos(): Parqueadero[] {
  const lista: Parqueadero[] = [];
  let id = 1;

  for (const nivel of [1, 2, 3]) {
    for (let puesto = 1; puesto <= 8; puesto++) {
      const numero = `N${nivel}-${String(puesto).padStart(2, "0")}`;
      lista.push({
        id: String(id++),
        numero,
        nivel,
        tipo: puesto % 4 === 0 ? "moto" : "carro",
        idPropiedad: ASIGNACIONES[numero] ?? null,
        reservado: RESERVADOS.has(numero),
      });
    }
  }
  return lista;
}

let parqueaderos: Parqueadero[] = generarParqueaderos();

export function obtenerParqueaderos(): Parqueadero[] {
  return parqueaderos;
}

// El estado se CALCULA a partir de los datos: no se guarda, asi nunca se contradice
export function estadoDeParqueadero(p: Parqueadero): EstadoParqueadero {
  if (p.idPropiedad !== null) return "ocupado";
  return p.reservado ? "reservado" : "disponible";
}

export function cantidadAsignadaAPropiedad(idPropiedad: string): number {
  return parqueaderos.filter((p) => p.idPropiedad === idPropiedad).length;
}

// HU-37 + HU-49: asignar un espacio, validando todas las reglas
export function asignarParqueadero(
  idParqueadero: string,
  idPropiedad: string
): { exito: boolean; mensaje?: string } {
  const parqueadero = parqueaderos.find((p) => p.id === idParqueadero);

  if (!parqueadero) return { exito: false, mensaje: "El espacio seleccionado no existe." };
  if (parqueadero.idPropiedad !== null) return { exito: false, mensaje: "Este espacio ya está asignado." };
  if (parqueadero.reservado) {
    return { exito: false, mensaje: "Este espacio está reservado. Quita la reserva antes de asignarlo." };
  }
  if (cantidadAsignadaAPropiedad(idPropiedad) >= MAX_PARQUEADEROS_POR_PROPIEDAD) {
    return {
      exito: false,
      mensaje: `Esta propiedad ya tiene ${MAX_PARQUEADEROS_POR_PROPIEDAD} espacio(s) asignado(s), el máximo permitido.`,
    };
  }

  parqueaderos = parqueaderos.map((p) => (p.id === idParqueadero ? { ...p, idPropiedad } : p));
  return { exito: true };
}

export function liberarParqueadero(idParqueadero: string): void {
  parqueaderos = parqueaderos.map((p) => (p.id === idParqueadero ? { ...p, idPropiedad: null } : p));
}

// Solo se puede reservar un espacio que esta libre
export function reservarParqueadero(idParqueadero: string): void {
  parqueaderos = parqueaderos.map((p) =>
    p.id === idParqueadero && p.idPropiedad === null ? { ...p, reservado: true } : p
  );
}

export function quitarReservaParqueadero(idParqueadero: string): void {
  parqueaderos = parqueaderos.map((p) => (p.id === idParqueadero ? { ...p, reservado: false } : p));
}

// Los "JOIN manuales" de siempre: unidad, propietario y placa de un espacio
export function detalleDeParqueadero(p: Parqueadero): { unidad: string; propietario: string; placa: string } {
  const propiedad = p.idPropiedad ? obtenerPropiedades().find((x) => x.id === p.idPropiedad) : undefined;
  const idDueno = propiedad?.idPropietario ?? null;
  const dueno = idDueno ? obtenerUsuarios().find((u) => u.id === idDueno) : undefined;
  const vehiculo = obtenerVehiculos().find((v) => v.idParqueadero === p.id);

  return {
    unidad: propiedad ? `${propiedad.torre}-${propiedad.numero}` : "—",
    propietario: dueno ? `${dueno.nombres} ${dueno.apellidos}` : "—",
    placa: vehiculo ? vehiculo.placa : "—",
  };
}

// Espacios que un vehiculo PUEDE usar: asignados a una propiedad de su
// dueño (propietario o arrendatario), del mismo tipo, y sin otro vehiculo.
// "idVehiculoExcluir": al editar, el propio vehiculo no cuenta como "uso".
export function espaciosParaVehiculo(
  correoPropietario: string,
  tipo: TipoParqueadero,
  idVehiculoExcluir?: string
): Parqueadero[] {
  const usuario = obtenerUsuarioPorCorreo(correoPropietario);
  if (!usuario) return [];

  const idsPropiedadesDelDueno = obtenerPropiedades()
    .filter((p) => p.idPropietario === usuario.id || p.idArrendatario === usuario.id)
    .map((p) => p.id);

  const usadosPorOtrosVehiculos = new Set(
    obtenerVehiculos()
      .filter((v) => v.id !== idVehiculoExcluir)
      .map((v) => v.idParqueadero)
  );

  return parqueaderos.filter(
    (p) =>
      p.idPropiedad !== null &&
      idsPropiedadesDelDueno.includes(p.idPropiedad) &&
      p.tipo === tipo &&
      !usadosPorOtrosVehiculos.has(p.id)
  );
}