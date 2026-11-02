import { fechaEnMeses, hoyLocal } from "./fechas";
import { notificarARol, notificarUsuario, notificarSinDuplicar, type DatosNotificacion } from "./notificacionesStore";
import { obtenerPropiedades } from "./propiedadesStore";
import { obtenerUsuarios, type Usuario } from "./usuariosStore";
import { formatearMoneda } from "./formatos";
import { obtenerConfigConjunto } from "./configuracionStore";

// El comprobante de pago que sube el residente: una imagen que el administrador revisa
export type EstadoComprobante = "en_revision" | "aprobado" | "rechazado";

export interface Comprobante {
  imagen: string; // la imagen como data URL (en una version con backend seria el enlace a un archivo)
  fechaSubida: string; // ISO
  subidoPor: string; // correo del residente
  estado: EstadoComprobante;
  motivoRechazo: string | null;
}

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
  notaPago: string | null; // referencia que anota el administrador al registrar el pago
  comprobante: Comprobante | null; // lo sube el residente; null si no ha enviado ninguno
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
        notaPago: null,
        comprobante: null,
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

export function obtenerCuotaPorId(id: string): Cuota | undefined {
  return cuotas.find((c) => c.id === id);
}

// Cuantos comprobantes esperan la revision del administrador
export function contarComprobantesPorRevisar(): number {
  return cuotas.filter((c) => c.comprobante?.estado === "en_revision").length;
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
    { id: nuevoId, ...datos, fechaGeneracion: new Date().toISOString(), fechaPago: null, notaPago: null, comprobante: null, estadoPago: "pendiente" },
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

// "2026-11-02T13:00:00.000Z" -> "2026-11-02" (en horario local)
function fechaLocalDeIso(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA");
}

// La plataforma NO procesa pagos (el documento lo deja fuera de alcance). Quien registra el pago es
// el ADMINISTRADOR, cuando el residente pago por fuera: consignacion, transferencia o efectivo.
export function registrarPagoCuota(id: string, fechaPago: string, notaPago: string): { exito: boolean; mensaje?: string } {
  const cuota = cuotas.find((c) => c.id === id);
  if (!cuota) return { exito: false, mensaje: "La cuota no existe." };
  if (cuota.estadoPago === "pagada") return { exito: false, mensaje: "Esta cuota ya tiene un pago registrado." };

  if (fechaPago === "") return { exito: false, mensaje: "La fecha de pago es obligatoria." };
  if (fechaPago > hoyLocal()) return { exito: false, mensaje: "La fecha de pago no puede ser futura." };
  if (fechaPago < fechaLocalDeIso(cuota.fechaGeneracion)) {
    return { exito: false, mensaje: "El pago no puede ser anterior a la fecha en que se generó la cuota." };
  }

  const nota = notaPago.trim();
  cuotas = cuotas.map((c) => {
    if (c.id !== id) return c;

    // Si habia un comprobante esperando revision, al registrar el pago queda aprobado
    const comprobante: Comprobante | null =
      c.comprobante?.estado === "en_revision" ? { ...c.comprobante, estado: "aprobado" } : c.comprobante;

    return { ...c, estadoPago: "pagada", fechaPago, notaPago: nota === "" ? null : nota, comprobante };
  });

  // Avisar a quienes responden por la propiedad (el administrador ya sabe: es quien lo registro)
  for (const usuario of destinatariosDePropiedad(cuota.idPropiedad)) {
    notificarUsuario(usuario.correo, {
      tipo: "exito",
      titulo: "Pago registrado",
      mensaje: `${cuota.descripcion}: ${formatearMoneda(cuota.valor)}, pago registrado el ${fechaCorta(fechaPago)}`,
      enlace: "/panel/cuotas",
    });
  }

  return { exito: true };
}

// El RESIDENTE (propietario o arrendatario de la propiedad) sube la imagen de su comprobante.
// No paga nada: solo le muestra a la administracion que ya pago, para que ella registre el pago.
export function subirComprobante(id: string, correo: string, imagen: string): { exito: boolean; mensaje?: string } {
  const cuota = cuotas.find((c) => c.id === id);
  if (!cuota) return { exito: false, mensaje: "La cuota no existe." };
  if (cuota.estadoPago === "pagada") return { exito: false, mensaje: "Esta cuota ya está pagada." };

  // Solo quienes responden por la propiedad pueden enviar comprobantes de esa cuota
  const puede = destinatariosDePropiedad(cuota.idPropiedad).some((u) => u.correo === correo);
  if (!puede) return { exito: false, mensaje: "No puedes enviar comprobantes de esta cuota." };

  if (cuota.comprobante?.estado === "en_revision") {
    return { exito: false, mensaje: "Ya enviaste un comprobante y está en revisión." };
  }
  if (imagen === "") return { exito: false, mensaje: "Selecciona una imagen." };

  cuotas = cuotas.map((c) =>
    c.id === id
      ? { ...c, comprobante: { imagen, fechaSubida: new Date().toISOString(), subidoPor: correo, estado: "en_revision", motivoRechazo: null } }
      : c
  );

  // Avisar a los administradores que hay un comprobante por revisar
  const { unidad } = detalleDeCuota(cuota);
  notificarARol("administrador", {
    tipo: "info",
    titulo: "Comprobante de pago recibido",
    mensaje: `Unidad ${unidad}: ${cuota.descripcion} (${formatearMoneda(cuota.valor)})`,
    enlace: `/panel/cuotas/${id}`,
  });

  return { exito: true };
}

// El ADMINISTRADOR rechaza un comprobante (borroso, de otro valor, etc.) y le explica el motivo al residente
export function rechazarComprobante(id: string, motivo: string): { exito: boolean; mensaje?: string } {
  const cuota = cuotas.find((c) => c.id === id);
  if (!cuota || cuota.comprobante?.estado !== "en_revision") {
    return { exito: false, mensaje: "No hay un comprobante en revisión para esta cuota." };
  }
  if (motivo.trim() === "") return { exito: false, mensaje: "Escribe el motivo del rechazo." };

  const motivoLimpio = motivo.trim();
  const subidoPor = cuota.comprobante.subidoPor;

  cuotas = cuotas.map((c) =>
    c.id === id && c.comprobante ? { ...c, comprobante: { ...c.comprobante, estado: "rechazado", motivoRechazo: motivoLimpio } } : c
  );

  // Avisar a quien lo envio: tiene que subir uno nuevo
  notificarUsuario(subidoPor, {
    tipo: "alerta",
    titulo: "Comprobante rechazado",
    mensaje: `${cuota.descripcion}: ${motivoLimpio}`,
    enlace: "/panel/cuotas",
  });

  return { exito: true };
}

export function enviarRecordatorios(): { enviados: number; residentes: number } {
  // Cuantos dias antes se recuerda: lo define el administrador en Configuracion > Conjunto
  const { diasRecordatorio } = obtenerConfigConjunto();
  let enviados = 0;
  const avisados = new Set<string>();

  for (const cuota of cuotas) {
    const estado = estadoVisual(cuota);
    if (estado === "pagada") continue; // nada que recordar
    if (cuota.comprobante?.estado === "en_revision") continue; // ya envio su comprobante: espera la revision
    if (estado === "pendiente" && diasParaVencer(cuota.fechaLimite) > diasRecordatorio) continue; // aun falta mucho

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