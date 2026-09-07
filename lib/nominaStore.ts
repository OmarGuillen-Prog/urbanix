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

let registrosNomina: RegistroNomina[] = [
  {
    id: "1",
    nombreEmpleado: "Andrés Vélez",
    cargo: "Portero",
    salario: 1400000,
    fechaPago: "2026-08-31",
    estadoPago: "pagado",
    observaciones: "Pago mensual completo",
    correoAdministrador: "omar@urbanix.com",
  },
  {
    id: "2",
    nombreEmpleado: "Rosa Martínez",
    cargo: "Aseo y mantenimiento",
    salario: 1300000,
    fechaPago: "2026-09-30",
    estadoPago: "pendiente",
    observaciones: "",
    correoAdministrador: "omar@urbanix.com",
  },
];

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