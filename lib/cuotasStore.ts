import { fechaEnMeses } from "./fechas";
import { notificarARol, notificarUsuario } from "./notificacionesStore";
import { obtenerPropiedades } from "./propiedadesStore";
import { obtenerUsuarios } from "./usuariosStore";
import { formatearMoneda } from "./formatos";
// Refleja "Cuota" del MER: valor, fecha_generacion, fecha_limite,
// estado_pago, descripcion, id_propiedad (FK). Solo guardamos
// "pendiente" o "pagada" - "vencida" se CALCULA, no se guarda (ver
// estadoVisual mas abajo).
export interface Cuota {
  id: string;
  idPropiedad: string;
  valor: number;
  descripcion: string;
  fechaGeneracion: string; // ISO
  fechaLimite: string; // "YYYY-MM-DD"
  estadoPago: "pendiente" | "pagada";
}

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
      lista.push({
        id: String(id++),
        idPropiedad,
        valor: VALOR_CUOTA[idPropiedad],
        descripcion: `Administración - ${mes}`,
        fechaGeneracion: new Date(`${fechaEnMeses(mesesAtras, 1)}T08:00:00`).toISOString(),
        fechaLimite: fechaEnMeses(mesesAtras, 10),
        estadoPago: SIN_PAGAR.has(`${idPropiedad}-${mesesAtras}`) ? "pendiente" : "pagada",
      });
    }
  }
  return lista;
}

let cuotas: Cuota[] = generarCuotas();

export function obtenerTodasLasCuotas(): Cuota[] {
  return cuotas;
}

export function obtenerCuotasPorPropiedad(idPropiedad: string): Cuota[] {
  return cuotas.filter((c) => c.idPropiedad === idPropiedad);
}

// RF-27, RF-28, RF-29: registrar cuota, asociada a una propiedad, con
// fecha limite.
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
    { id: nuevoId, ...datos, fechaGeneracion: new Date().toISOString(), estadoPago: "pendiente" },
  ];

  // Avisar a quienes responden por la propiedad: propietario y arrendatario
  const propiedad = obtenerPropiedades().find((p) => p.id === datos.idPropiedad);
  if (!propiedad) return;

  // Set: si el propietario y el arrendatario son la misma persona, se avisa UNA vez
  const idsDestino = new Set(
    [propiedad.idPropietario, propiedad.idArrendatario].filter((id): id is string => id !== null)
  );
  const vence = new Date(`${datos.fechaLimite}T00:00:00`).toLocaleDateString("es-CO", { day: "numeric", month: "short" });

  for (const usuario of obtenerUsuarios().filter((u) => idsDestino.has(u.id))) {
    notificarUsuario(usuario.correo, {
      tipo: "info",
      titulo: "Nueva cuota de administración",
      mensaje: `${datos.descripcion}: ${formatearMoneda(datos.valor)}, vence el ${vence}`,
      enlace: "/panel/cuotas",
    });
  }
}

export function marcarComoPagada(id: string): void {
  const cuota = cuotas.find((c) => c.id === id);
  if (!cuota || cuota.estadoPago === "pagada") return; // ya estaba pagada: no se avisa dos veces

  cuotas = cuotas.map((c) => (c.id === id ? { ...c, estadoPago: "pagada" } : c));

  // Avisar a los administradores que llego un pago.
  // La cuota solo trae el id de la propiedad: buscamos la propiedad para mostrar su unidad.
  const propiedad = obtenerPropiedades().find((p) => p.id === cuota.idPropiedad);
  const unidad = propiedad ? `${propiedad.torre}-${propiedad.numero}` : "desconocida";

  notificarARol("administrador", {
    tipo: "exito",
    titulo: "Cuota recibida",
    mensaje: `Cuota de ${formatearMoneda(cuota.valor)} recibida de la unidad ${unidad}`,
    enlace: "/panel/cuotas",
  });
}

// El "estado calculado" del que hablamos: si ya esta pagada, listo.
// Si no, comparamos la fecha limite contra HOY para decidir si es
// "pendiente" (aun a tiempo) o "vencida" (RF-33) - un simple
// comparador de strings funciona porque "YYYY-MM-DD" ordena
export function estadoVisual(cuota: Cuota): "pendiente" | "vencida" | "pagada" {
  if (cuota.estadoPago === "pagada") return "pagada";
  const hoy = new Date().toISOString().slice(0, 10);
  return cuota.fechaLimite < hoy ? "vencida" : "pendiente";
}

// RF-32: recordatorio automatico antes del vencimiento. Simulamos
// esto como un calculo de "cuantos dias faltan", que la UI usa para
// decidir si mostrar un aviso o no - en vez de un correo real
// enviado por un job en el backend.
export function diasParaVencer(fechaLimite: string): number {
  const hoy = new Date();
  const limite = new Date(`${fechaLimite}T00:00:00`);
  const diferenciaMs = limite.getTime() - hoy.getTime();
  return Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
}

// Devuelve la cuota mas reciente de una propiedad (o null si no
// tiene ninguna) - la usamos para mostrar "cuota actual" en la
// tarjeta, sin tener que decidir aqui si esta pagada o no.
export function obtenerUltimaCuotaDePropiedad(idPropiedad: string): Cuota | null {
  const deLaPropiedad = obtenerCuotasPorPropiedad(idPropiedad);
  if (deLaPropiedad.length === 0) return null;

  return [...deLaPropiedad].sort(
    (a, b) => new Date(b.fechaGeneracion).getTime() - new Date(a.fechaGeneracion).getTime()
  )[0];
}