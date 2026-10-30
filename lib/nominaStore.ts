import { fechaEnMeses } from "./fechas";

// Refleja "Nomina" del MER: nombre_empleado, cargo, salario,
// fecha_pago, estado_pago, observaciones, id_administrador (FK).
export interface RegistroNomina {
  id: string;
  nombreEmpleado: string;
  cargo: string;
  salario: number;
  fechaPago: string; // "YYYY-MM-DD"
  estadoPago: "pendiente" | "pagado";
  observaciones: string;
  correoAdministrador: string;
}

// --- Datos de ejemplo: 4 empleados durante 6 meses ---
const EMPLEADOS = [
  { nombreEmpleado: "Andrés Vélez", cargo: "Portero", salario: 1200000 },
  { nombreEmpleado: "Rosa Martínez", cargo: "Aseo y mantenimiento", salario: 800000 },
  { nombreEmpleado: "Jorge Pardo", cargo: "Jardinería", salario: 500000 },
  { nombreEmpleado: "Luis Ortega", cargo: "Vigilancia nocturna", salario: 400000 },
];

function generarNomina(): RegistroNomina[] {
  const lista: RegistroNomina[] = [];
  let id = 1;

  for (let mesesAtras = 5; mesesAtras >= 0; mesesAtras--) {
    for (const empleado of EMPLEADOS) {
      lista.push({
        id: String(id++),
        ...empleado,
        fechaPago: fechaEnMeses(mesesAtras, 28),
        // Los meses anteriores ya se pagaron; el actual queda pendiente
        estadoPago: mesesAtras === 0 ? "pendiente" : "pagado",
        observaciones: "",
        correoAdministrador: "omar@urbanix.com",
      });
    }
  }
  return lista;
}

let registrosNomina: RegistroNomina[] = generarNomina();

export function obtenerNomina(): RegistroNomina[] {
  return registrosNomina;
}

export function crearRegistroNomina(datos: Omit<RegistroNomina, "id">): void {
  const nuevoId = (Math.max(0, ...registrosNomina.map((r) => Number(r.id))) + 1).toString();
  registrosNomina = [...registrosNomina, { id: nuevoId, ...datos }];
}

export function marcarNominaComoPagada(id: string): void {
  registrosNomina = registrosNomina.map((r) => (r.id === id ? { ...r, estadoPago: "pagado" } : r));
}