// Refleja "Vehiculo" del MER: placa, marca, modelo, color,
// tipo_vehiculo, id_usuario (FK), id_parqueadero (FK).
export interface Vehiculo {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  color: string;
  tipoVehiculo: "carro" | "moto";
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

// RF-65: el sistema debe almacenar correctamente las placas -
// incluye evitar duplicados, algo que ya practicaste con el correo
// en HU-01.
export function existePlaca(placa: string): boolean {
  return vehiculos.some((v) => v.placa.toUpperCase() === placa.toUpperCase());
}

export function crearVehiculo(datos: Omit<Vehiculo, "id">): void {
  const nuevoId = (Math.max(0, ...vehiculos.map((v) => Number(v.id))) + 1).toString();
  vehiculos = [...vehiculos, { id: nuevoId, ...datos, placa: datos.placa.toUpperCase() }];
}