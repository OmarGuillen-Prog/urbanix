// Regla de negocio del conjunto: maximo de parqueaderos que una
// misma propiedad puede tener asignados a la vez (RF-66/67).
const MAX_PARQUEADEROS_POR_PROPIEDAD = 2;

// Refleja "Parqueadero" del MER: numero_parqueadero, tipo, estado,
// id_propiedad (FK). A diferencia de Propiedades o PQRS, aqui el
// inventario es FIJO - no se "crean" parqueaderos desde la UI, ya
// existen fisicamente en el conjunto; lo que cambia es a quien
// estan asignados.
export interface Parqueadero {
  id: string;
  numero: string;
  tipo: "carro" | "moto";
  idPropiedad: string | null;
}

let parqueaderos: Parqueadero[] = [
  { id: "1", numero: "P-01", tipo: "carro", idPropiedad: "1" },
  { id: "2", numero: "P-02", tipo: "carro", idPropiedad: null },
  { id: "3", numero: "P-03", tipo: "carro", idPropiedad: null },
  { id: "4", numero: "P-04", tipo: "moto", idPropiedad: "1" },
  { id: "5", numero: "P-05", tipo: "moto", idPropiedad: null },
  { id: "6", numero: "P-06", tipo: "carro", idPropiedad: null },
];

export function obtenerParqueaderos(): Parqueadero[] {
  return parqueaderos;
}

function contarAsignadosAPropiedad(idPropiedad: string): number {
  return parqueaderos.filter((p) => p.idPropiedad === idPropiedad).length;
}

// HU-37 + HU-49: asignar un parqueadero, validando el cupo maximo.
// Igual que en Reservas, devolvemos un resultado explicito en vez de
// lanzar un error - el componente decide como mostrarlo.
export function asignarParqueadero(
  idParqueadero: string,
  idPropiedad: string
): { exito: boolean; mensaje?: string } {
  const yaAsignados = contarAsignadosAPropiedad(idPropiedad);

  if (yaAsignados >= MAX_PARQUEADEROS_POR_PROPIEDAD) {
    // RF-67: impedir asignaciones que excedan el limite permitido
    return {
      exito: false,
      mensaje: `Esta propiedad ya tiene ${MAX_PARQUEADEROS_POR_PROPIEDAD} parqueadero(s) asignado(s), el máximo permitido.`,
    };
  }

  parqueaderos = parqueaderos.map((p) =>
    p.id === idParqueadero ? { ...p, idPropiedad } : p
  );
  return { exito: true };
}

export function liberarParqueadero(idParqueadero: string): void {
  parqueaderos = parqueaderos.map((p) =>
    p.id === idParqueadero ? { ...p, idPropiedad: null } : p
  );
}