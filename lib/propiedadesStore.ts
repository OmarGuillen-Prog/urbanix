// Refleja la entidad "Propiedad" del MER: numero_propiedad, torre,
// tipo_propiedad, estado_ocupacion, area, id_propietario (FK),
// id_arrendatario (FK).
export interface Propiedad {
  id: string;
  numero: string;
  torre: string;
  tipo: "apartamento" | "casa" | "local";
  area: number;
  estadoOcupacion: "ocupado" | "vacio";
  // "string | null": o tiene el id de un usuario, o no tiene a nadie
  // asignado todavia. Lo distinguimos explicitamente de un string
  // vacio "" para que sea imposible confundir "sin asignar" con
  // "un id invalido".
  idPropietario: string | null;
  idArrendatario: string | null;
}

let propiedades: Propiedad[] = [
  { id: "1", numero: "101", torre: "A", tipo: "apartamento", area: 68, estadoOcupacion: "ocupado", idPropietario: "3", idArrendatario: null },
  { id: "2", numero: "102", torre: "A", tipo: "apartamento", area: 72, estadoOcupacion: "vacio", idPropietario: null, idArrendatario: null },
  { id: "3", numero: "201", torre: "B", tipo: "apartamento", area: 90, estadoOcupacion: "ocupado", idPropietario: "2", idArrendatario: "6" },
  { id: "4", numero: "1", torre: "C", tipo: "casa", area: 150, estadoOcupacion: "vacio", idPropietario: null, idArrendatario: null },
];

export function obtenerPropiedades(): Propiedad[] {
  return propiedades;
}

export function obtenerPropiedadPorId(id: string): Propiedad | undefined {
  return propiedades.find((p) => p.id === id);
}

// Omit<Propiedad, "id">: "dame la forma de Propiedad, pero sin el
// campo id" - porque el id todavia no existe cuando estamos creando.
export function crearPropiedad(datos: Omit<Propiedad, "id">): void {
  const nuevoId = (
    Math.max(0, ...propiedades.map((p) => Number(p.id))) + 1
  ).toString();
  propiedades = [...propiedades, { id: nuevoId, ...datos }];
}

export function actualizarPropiedad(id: string, cambios: Partial<Propiedad>): void {
  propiedades = propiedades.map((p) => (p.id === id ? { ...p, ...cambios } : p));
}

export function eliminarPropiedad(id: string): void {
  propiedades = propiedades.filter((p) => p.id !== id);
}