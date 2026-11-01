import { fechaEnMeses, hoyLocal } from "./fechas";
import { notificarARol, notificarUsuario, notificarSinDuplicar, type DatosNotificacion } from "./notificacionesStore";
import { obtenerPropiedades } from "./propiedadesStore";
import { obtenerUsuarios, type Usuario } from "./usuariosStore";
import { formatearMoneda } from "./formatos";

// Refleja "Cuota" del MER: valor, fecha_generacion, fecha_limite, estado_pago,
// descripcion, id_propiedad (FK). Solo guardamos "pendiente" o "pagada":
// "vencida" se CALCULA comparando la fecha limite con hoy (ver estadoVisual).
export interface Cuota {
  id: string;
  idPropiedad: string;
  valor: number;
  descripcion: string;
  fechaGeneracion: string; // ISO
  fechaLimite: string; // "YYYY-MM-DD"
  fechaPago: string | null; // "YYYY-MM-DD"; null mientras no se pague
  estadoPago: "pendiente" | "pagada";
}

export type EstadoVisualCuota = "pendiente" | "vencida" | "pagada";

// --- Datos de ejemplo: 6 meses de historial (el mes actual y los 5 anteriores) ---
const VALOR_CUOTA: Record<string, number> = { "1": 1200000, "2": 900000, "3": 1100000, "4": 1300000 };
// Cuotas que quedaron SIN pagar, con la forma "idPropiedad-mesesAtras" (0 = mes actual)
const SIN_PAGAR = new Set(["2-4", "3-3", "4-2", "1-1", "2-0"]);

function generarCuotas(): Cuota[] {
  const lista: Cuota[] = [];
  let id = 1;

  for (let mesesAtras = 5; mesesAtras >= 0; mesesAtras--) {
    const nombreMes = new Date(`${fechaEnMeses(mesesAtras, 1)}T00:00:00`).toLocaleDateString("es-CO", { month: "long" });
    const mes = nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);

    for (const idPropiedad of Object.keys(VALOR_CUOTA)) {
      const sinPagar = SIN_PAGAR.has(`${idPropiedad}-${mesesAtras}`);

      lista.push({
        id: String(id++),
        idPropiedad,
        valor: VALOR_CUOTA[idPropiedad],
        descripcion: `Administración - ${mes}`,
        fechaGeneracion: new Date(`${fechaEnMeses(mesesAtras, 1)}T08:00:00`).toISOString(),
        fechaLimite: fechaEnMeses(mesesAtras, 10),
        // Las pagadas se pagaron el dia 8 de su mes (o hoy, si es el mes actual)
        fechaPago: sinPagar ? null : mesesAtras === 0 ? hoyLocal() : fechaEnMeses(mesesAtras, 8),
        estadoPago: sinPagar ? "pendiente" : "pagada",
      });
    }
  }
  return lista;
}

let cuotas: Cuota[] = generarCuotas();

// ---------- Lectura ----------
export function obtenerTodasLasCuotas(): Cuota[] {
  return cuotas;
}

export function obtenerCuotasPorPropiedad(idPropiedad: string): Cuota[] {
  return cuotas.filter((c) => c.idPropiedad === idPropiedad);
}

// "1" -> "CUO-0001"
export function codigoCuota(id: string): string {
  return `CUO-${id.padStart(4, "0")}`;
}

// Regla de negocio: no se factura dos veces el mismo concepto a la misma propiedad
export function existeCuota(idPropiedad: string, descripcion: string): boolean {
  const concepto = descripcion.trim().toLowerCase();
  return cuotas.some((c) => c.idPropiedad === idPropiedad && c.descripcion.trim().toLowerCase() === concepto);
}

// Devuelve la cuota mas reciente de una propiedad (o null si no tiene ninguna)
export function obtenerUltimaCuotaDePropiedad(idPropiedad: string): Cuota | null {
  const deLaPropiedad = obtenerCuotasPorPropiedad(idPropiedad);
  if (deLaPropiedad.length === 0) return null;

  return [...deLaPropiedad].sort(
    (a, b) => new Date(b.fechaGeneracion).getTime() - new Date(a.fechaGeneracion).getTime()
  )[0];
}

// ---------- Estados CALCULADOS (no se guardan) ----------
// Si ya esta pagada, listo. Si no, comparamos la fecha limite con HOY (en horario local).
export function estadoVisual(cuota: Cuota): EstadoVisualCuota {
  if (cuota.estadoPago === "pagada") return "pagada";
  return cuota.fechaLimite < hoyLocal() ? "vencida" : "pendiente";
}

export function diasParaVencer(fechaLimite: string): number {
  const hoy = new Date();
  const limite = new Date(`${fechaLimite}T00:00:00`);
  const diferenciaMs = limite.getTime() - hoy.getTime();
  return Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
}

// ---------- Resumen para tarjetas y barra de progreso ----------
export interface ResumenCuotas {
  facturado: number; // todo lo cobrado en cuotas
  recaudado: number; // lo ya pagado
  pendiente: number; // sin pagar, pero aun dentro del plazo
  vencido: number; // sin pagar y fuera de plazo
  porcentaje: number; // % recaudado sobre lo facturado
}

export function resumenDeCuotas(lista: Cuota[]): ResumenCuotas {
  let recaudado = 0;
  let pendiente = 0;
  let vencido = 0;

  for (const cuota of lista) {
    const estado = estadoVisual(cuota);
    if (estado === "pagada") recaudado += cuota.valor;
    else if (estado === "vencida") vencido += cuota.valor;
    else pendiente += cuota.valor;
  }

  const facturado = recaudado + pendiente + vencido;
  return { facturado, recaudado, pendiente, vencido, porcentaje: facturado === 0 ? 0 : (recaudado / facturado) * 100 };
}

// Los "JOIN manuales" de siempre: unidad y residente responsable de la cuota.
// El responsable es el PROPIETARIO (la obligacion de pagar la administracion es suya, Ley 675).
export function detalleDeCuota(cuota: Cuota): { unidad: string; residente: string } {
  const propiedad = obtenerPropiedades().find((p) => p.id === cuota.idPropiedad);
  const idDueno = propiedad?.idPropietario ?? null;
  const dueno = idDueno ? obtenerUsuarios().find((u) => u.id === idDueno) : undefined;

  return {
    unidad: propiedad ? `${propiedad.torre}-${propiedad.numero}` : "—",
    residente: dueno ? `${dueno.nombres} ${dueno.apellidos}` : "Sin propietario",
  };
}

// Periodos (meses) que tienen cuotas, del mas reciente al mas antiguo
export function mesesConCuotas(): { valor: string; etiqueta: string }[] {
  const meses = [...new Set(cuotas.map((c) => c.fechaLimite.slice(0, 7)))].sort().reverse();

  return meses.map((mes) => {
    const nombre = new Date(`${mes}-01T00:00:00`).toLocaleDateString("es-CO", { month: "long", year: "numeric" });
    return { valor: mes, etiqueta: nombre.charAt(0).toUpperCase() + nombre.slice(1) };
  });
}

// ---------- Avisos: a quienes responden por una propiedad ----------
// Propietario y arrendatario. Set: si son la misma persona, se cuenta UNA vez.
function destinatariosDePropiedad(idPropiedad: string): Usuario[] {
  const propiedad = obtenerPropiedades().find((p) => p.id === idPropiedad);
  if (!propiedad) return [];

  const ids = new Set([propiedad.idPropietario, propiedad.idArrendatario].filter((id): id is string => id !== null));
  return obtenerUsuarios().filter((u) => ids.has(u.id));
}

function fechaCorta(fecha: string): string {
  return new Date(`${fecha}T00:00:00`).toLocaleDateString("es-CO", { day: "numeric", month: "short" });
}

// ---------- Escritura ----------
// RF-27, RF-28, RF-29: registrar cuota, asociada a una propiedad, con fecha limite.
export function crearCuota(datos: {
  idPropiedad: string;
  valor: number;
  descripcion: string;
  fechaLimite: string;
}): void {
  const nuevoId = (Math.max(0, ...cuotas.map((c) => Number(c.id))) + 1).toString();
  cuotas = [
    ...cuotas,
    { id: nuevoId, ...datos, fechaGeneracion: new Date().toISOString(), fechaPago: null, estadoPago: "pendiente" },
  ];

  for (const usuario of destinatariosDePropiedad(datos.idPropiedad)) {
    notificarUsuario(usuario.correo, {
      tipo: "info",
      titulo: "Nueva cuota de administración",
      mensaje: `${datos.descripcion}: ${formatearMoneda(datos.valor)}, vence el ${fechaCorta(datos.fechaLimite)}`,
      enlace: "/panel/cuotas",
    });
  }
}

export function marcarComoPagada(id: string): void {
  const cuota = cuotas.find((c) => c.id === id);
  if (!cuota || cuota.estadoPago === "pagada") return; // ya estaba pagada: no se avisa dos veces

  cuotas = cuotas.map((c) => (c.id === id ? { ...c, estadoPago: "pagada", fechaPago: hoyLocal() } : c));

  // Avisar a los administradores que llego un pago
  const { unidad } = detalleDeCuota(cuota);

  notificarARol("administrador", {
    tipo: "exito",
    titulo: "Cuota recibida",
    mensaje: `Cuota de ${formatearMoneda(cuota.valor)} recibida de la unidad ${unidad}`,
    enlace: "/panel/cuotas",
  });
}

// RF-32 / RF-33: recordatorios de pago. Aqui los dispara el administrador con un boton;
// con backend serian automaticos (una tarea programada que corre cada dia).
const DIAS_ANTES_PARA_RECORDAR = 7;

export function enviarRecordatorios(): { enviados: number; residentes: number } {
  let enviados = 0;
  const avisados = new Set<string>();

  for (const cuota of cuotas) {
    const estado = estadoVisual(cuota);
    if (estado === "pagada") continue; // nada que recordar
    if (estado === "pendiente" && diasParaVencer(cuota.fechaLimite) > DIAS_ANTES_PARA_RECORDAR) continue; // aun falta mucho

    const datos: DatosNotificacion =
      estado === "vencida"
        ? {
            tipo: "alerta",
            titulo: "Cuota vencida",
            mensaje: `${cuota.descripcion}: ${formatearMoneda(cuota.valor)} venció el ${fechaCorta(cuota.fechaLimite)}`,
            enlace: "/panel/cuotas",
          }
        : {
            tipo: "alerta",
            titulo: "Cuota por vencer",
            mensaje: `${cuota.descripcion}: ${formatearMoneda(cuota.valor)} vence el ${fechaCorta(cuota.fechaLimite)}`,
            enlace: "/panel/cuotas",
          };

    for (const usuario of destinatariosDePropiedad(cuota.idPropiedad)) {
      // notificarSinDuplicar: si ya tiene ese mismo aviso sin leer, no se repite
      if (notificarSinDuplicar(usuario.correo, datos)) {
        enviados++;
        avisados.add(usuario.correo);
      }
    }
  }

  return { enviados, residentes: avisados.size };
}