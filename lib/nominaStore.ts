import { fechaEnMeses } from "./fechas";

export type Departamento = "seguridad" | "administracion" | "aseo" | "mantenimiento";
export type TipoContrato = "tiempo_completo" | "medio_tiempo" | "por_horas";

// Refleja "Nomina" del MER: nombre_empleado, cargo, salario, fecha_pago,
// estado_pago, observaciones, id_administrador (FK). Se suman departamento y tipo de contrato.
// Hay UN registro por empleado y por mes. El "periodo" es el mes de su fecha de pago.
export interface RegistroNomina {
  id: string;
  nombreEmpleado: string;
  cargo: string;
  departamento: Departamento;
  tipoContrato: TipoContrato;
  salario: number; // salario BASE mensual
  fechaPago: string; // "YYYY-MM-DD"
  estadoPago: "pendiente" | "pagado";
  observaciones: string;
  correoAdministrador: string;
}

// ---------- Parametros legales (cambian cada ano) ----------
// Salario minimo 2026: Decreto 1469 de 2025 (fijado de forma transitoria por el Decreto 159 de 2026
// mientras el Consejo de Estado decide de fondo). Auxilio de transporte 2026: Decreto 1470 de 2025.
// Valores de REFERENCIA para control administrativo: no reemplazan una liquidacion contable.
export const PARAMETROS_NOMINA = {
  anio: 2026,
  salarioMinimo: 1750905,
  auxilioTransporte: 249095,
  tasaSalud: 0.04, // aporte del trabajador
  tasaPension: 0.04, // aporte del trabajador
};

// Simplificacion: el auxilio de transporte se paga por dias trabajados, asi que se reduce
// segun el contrato (completo = todo el mes, medio tiempo = la mitad, por horas = la cuarta parte)
const FACTOR_AUXILIO: Record<TipoContrato, number> = {
  tiempo_completo: 1,
  medio_tiempo: 0.5,
  por_horas: 0.25,
};

// ---------- Datos de ejemplo: 4 empleados durante 6 meses ----------
const EMPLEADOS: Pick<RegistroNomina, "nombreEmpleado" | "cargo" | "departamento" | "tipoContrato" | "salario">[] = [
  { nombreEmpleado: "Andrés Vélez", cargo: "Portero", departamento: "seguridad", tipoContrato: "medio_tiempo", salario: 1200000 },
  { nombreEmpleado: "Rosa Martínez", cargo: "Aseo y mantenimiento", departamento: "aseo", tipoContrato: "por_horas", salario: 800000 },
  { nombreEmpleado: "Jorge Pardo", cargo: "Jardinería", departamento: "mantenimiento", tipoContrato: "por_horas", salario: 500000 },
  { nombreEmpleado: "Luis Ortega", cargo: "Vigilancia nocturna", departamento: "seguridad", tipoContrato: "por_horas", salario: 400000 },
];

function generarNomina(): RegistroNomina[] {
  const lista: RegistroNomina[] = [];
  let id = 1;

  for (let mesesAtras = 5; mesesAtras >= 0; mesesAtras--) {
    EMPLEADOS.forEach((empleado, indice) => {
      lista.push({
        id: String(id++),
        ...empleado,
        fechaPago: fechaEnMeses(mesesAtras, 28),
        // Los meses anteriores ya se pagaron; en el mes actual queda pendiente solo el ultimo empleado
        estadoPago: mesesAtras === 0 && indice === EMPLEADOS.length - 1 ? "pendiente" : "pagado",
        observaciones: "",
        correoAdministrador: "omar@urbanix.com",
      });
    });
  }
  return lista;
}

let registrosNomina: RegistroNomina[] = generarNomina();

// ---------- Lectura ----------
export function obtenerNomina(): RegistroNomina[] {
  return registrosNomina;
}

export function obtenerRegistroNominaPorId(id: string): RegistroNomina | undefined {
  return registrosNomina.find((r) => r.id === id);
}

// "2026-11-28" -> "2026-11"
export function periodoDe(registro: Pick<RegistroNomina, "fechaPago">): string {
  return registro.fechaPago.slice(0, 7);
}

// Meses que tienen nomina, del mas reciente al mas antiguo
export function periodosDeNomina(): { valor: string; etiqueta: string }[] {
  const meses = [...new Set(registrosNomina.map(periodoDe))].sort().reverse();

  return meses.map((mes) => {
    const nombre = new Date(`${mes}-01T00:00:00`).toLocaleDateString("es-CO", { month: "long", year: "numeric" });
    return { valor: mes, etiqueta: nombre.charAt(0).toUpperCase() + nombre.slice(1) };
  });
}

// Regla de negocio: un empleado no se liquida dos veces en el mismo periodo
export function existeRegistroNomina(nombreEmpleado: string, periodo: string): boolean {
  const nombre = nombreEmpleado.trim().toLowerCase();
  return registrosNomina.some((r) => r.nombreEmpleado.trim().toLowerCase() === nombre && periodoDe(r) === periodo);
}

// ---------- Calculos (DERIVADOS: no se guardan) ----------
export interface Liquidacion {
  salarioBase: number;
  auxilio: number; // auxilio de transporte
  salud: number; // descuento al trabajador
  pension: number; // descuento al trabajador
  bruto: number; // base + auxilio
  neto: number; // bruto - descuentos: lo que recibe el empleado
}

export function liquidar({ salario, tipoContrato }: { salario: number; tipoContrato: TipoContrato }): Liquidacion {
  const { salarioMinimo, auxilioTransporte, tasaSalud, tasaPension } = PARAMETROS_NOMINA;

  // El auxilio de transporte solo aplica a quien gana hasta 2 salarios minimos
  const auxilio = salario <= 2 * salarioMinimo ? Math.round(auxilioTransporte * FACTOR_AUXILIO[tipoContrato]) : 0;
  const salud = Math.round(salario * tasaSalud);
  const pension = Math.round(salario * tasaPension);
  const bruto = salario + auxilio;

  return { salarioBase: salario, auxilio, salud, pension, bruto, neto: bruto - salud - pension };
}

export interface ResumenNomina {
  empleados: number;
  bruto: number;
  neto: number;
  pendientes: number;
}

export function resumenDeNomina(lista: RegistroNomina[]): ResumenNomina {
  let bruto = 0;
  let neto = 0;

  for (const registro of lista) {
    const liquidacion = liquidar(registro);
    bruto += liquidacion.bruto;
    neto += liquidacion.neto;
  }

  return { empleados: lista.length, bruto, neto, pendientes: lista.filter((r) => r.estadoPago === "pendiente").length };
}

const ORDEN_DEPARTAMENTOS: Departamento[] = ["seguridad", "administracion", "aseo", "mantenimiento"];

// Empleados y neto por departamento (solo los departamentos que tienen gente)
export function resumenPorDepartamento(lista: RegistroNomina[]): { departamento: Departamento; empleados: number; neto: number }[] {
  return ORDEN_DEPARTAMENTOS.map((departamento) => {
    const delDepartamento = lista.filter((r) => r.departamento === departamento);
    return { departamento, empleados: delDepartamento.length, neto: resumenDeNomina(delDepartamento).neto };
  }).filter((fila) => fila.empleados > 0);
}

// ---------- Escritura ----------
export function crearRegistroNomina(datos: Omit<RegistroNomina, "id">): void {
  const nuevoId = (Math.max(0, ...registrosNomina.map((r) => Number(r.id))) + 1).toString();
  registrosNomina = [...registrosNomina, { id: nuevoId, ...datos }];
}

export function marcarNominaComoPagada(id: string): void {
  registrosNomina = registrosNomina.map((r) => (r.id === id ? { ...r, estadoPago: "pagado" } : r));
}