export type TipoVehiculo = "carro" | "moto";

// Refleja "Vehiculo" del MER: placa, marca, modelo, color, tipo_vehiculo,
// id_usuario (FK), id_parqueadero (FK). La relacion con el espacio vive
// SOLO aqui: el parqueadero la calcula buscando que vehiculo lo apunta.
export interface Vehiculo {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  color: string;
  tipoVehiculo: TipoVehiculo;
  correoPropietario: string;
  idParqueadero: string | null;
}

let vehiculos: Vehiculo[] = [
  {
    id: "1",
    placa: "ABC123",
    marca: "Mazda",
    modelo: "3",
    color: "Gris",
    tipoVehiculo: "carro",
    correoPropietario: "juan@urbanix.com",
    idParqueadero: "1",
  },
];

export function obtenerVehiculos(): Vehiculo[] {
  return vehiculos;
}

export function obtenerVehiculoPorId(id: string): Vehiculo | undefined {
  return vehiculos.find((v) => v.id === id);
}

// RF-65: las placas no se repiten. "idExcluir": al EDITAR, el vehiculo
// no debe chocar consigo mismo.
export function existePlaca(placa: string, idExcluir?: string): boolean {
  return vehiculos.some(
    (v) => v.id !== idExcluir && v.placa.toUpperCase() === placa.trim().toUpperCase()
  );
}

export function crearVehiculo(datos: Omit<Vehiculo, "id">): void {
  const nuevoId = (Math.max(0, ...vehiculos.map((v) => Number(v.id))) + 1).toString();
  vehiculos = [...vehiculos, { id: nuevoId, ...datos, placa: datos.placa.trim().toUpperCase() }];
}

export function actualizarVehiculo(id: string, datos: Omit<Vehiculo, "id">): void {
  vehiculos = vehiculos.map((v) =>
    v.id === id ? { ...v, ...datos, placa: datos.placa.trim().toUpperCase() } : v
  );
}

// Cuando un parqueadero se libera, el vehiculo que lo usaba queda sin parqueadero
export function desvincularParqueadero(idParqueadero: string): void {
  vehiculos = vehiculos.map((v) => (v.idParqueadero === idParqueadero ? { ...v, idParqueadero: null } : v));
}