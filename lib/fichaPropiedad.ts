// Arma la "ficha" de cada propiedad de un residente juntando datos de varios stores.
// NO guarda nada: lee y resume (igual que panelStore).
import { obtenerPropiedades, type Propiedad } from "./propiedadesStore";
import { obtenerUsuarios, obtenerUsuarioPorCorreo } from "./usuariosStore";
import { obtenerCuotasPorPropiedad, estadoVisual, resumenDeCuotas, type EstadoVisualCuota } from "./cuotasStore";
import { obtenerParqueaderos, MAX_PARQUEADEROS_POR_PROPIEDAD, type TipoParqueadero } from "./parqueaderosStore";
import { obtenerVehiculos } from "./vehiculosStore";

export type Relacion = "Propietario" | "Arrendatario";

export interface FichaPropiedad {
  propiedad: Propiedad;
  miRelacion: Relacion;
  // La OTRA persona de la unidad: si yo soy propietario, el arrendatario; si soy arrendatario, el propietario
  otraParte: { etiqueta: Relacion; nombre: string | null };
  cuotas: {
    estado: EstadoVisualCuota; // vencida > pendiente > pagada ("al dia")
    porPagar: number; // pesos: pendientes + vencidas
    cuotasVencidas: number;
    proximoVencimiento: string | null; // "YYYY-MM-DD" de la cuota sin pagar mas cercana
    ultimoPago: string | null; // "YYYY-MM-DD" del pago mas reciente
  };
  parqueaderos: { id: string; numero: string; nivel: number; tipo: TipoParqueadero; placa: string | null }[];
  cupoParqueaderos: number; // maximo permitido por propiedad
}

// Nombre completo de una persona, o null si no hay nadie (o soy yo mismo)
function nombreDe(id: string | null, excluirId: string): string | null {
  if (id === null || id === excluirId) return null;
  const persona = obtenerUsuarios().find((u) => u.id === id);
  return persona ? `${persona.nombres} ${persona.apellidos}` : null;
}

export function fichasDelResidente(correo: string): FichaPropiedad[] {
  const usuario = obtenerUsuarioPorCorreo(correo);
  if (!usuario) return [];

  const vehiculos = obtenerVehiculos();

  return obtenerPropiedades()
    .filter((p) => p.idPropietario === usuario.id || p.idArrendatario === usuario.id)
    .map((propiedad): FichaPropiedad => {
      const esPropietario = propiedad.idPropietario === usuario.id;

      // --- Cuotas ---
      const cuotas = obtenerCuotasPorPropiedad(propiedad.id);
      const sinPagar = cuotas.filter((c) => c.estadoPago === "pendiente");
      const cuotasVencidas = cuotas.filter((c) => estadoVisual(c) === "vencida").length;
      const dinero = resumenDeCuotas(cuotas);

      const vencimientos = sinPagar.map((c) => c.fechaLimite).sort(); // de la mas cercana a la mas lejana
      const pagos = cuotas
        .map((c) => c.fechaPago)
        .filter((fecha): fecha is string => fecha !== null)
        .sort((a, b) => b.localeCompare(a)); // del mas reciente al mas antiguo

      // --- Parqueaderos (con la placa del vehiculo que usa cada espacio) ---
      const parqueaderos = obtenerParqueaderos()
        .filter((p) => p.idPropiedad === propiedad.id)
        .sort((a, b) => a.numero.localeCompare(b.numero))
        .map((p) => ({
          id: p.id,
          numero: p.numero,
          nivel: p.nivel,
          tipo: p.tipo,
          placa: vehiculos.find((v) => v.idParqueadero === p.id)?.placa ?? null,
        }));

      return {
        propiedad,
        miRelacion: esPropietario ? "Propietario" : "Arrendatario",
        otraParte: esPropietario
          ? { etiqueta: "Arrendatario", nombre: nombreDe(propiedad.idArrendatario, usuario.id) }
          : { etiqueta: "Propietario", nombre: nombreDe(propiedad.idPropietario, usuario.id) },
        cuotas: {
          estado: cuotasVencidas > 0 ? "vencida" : sinPagar.length > 0 ? "pendiente" : "pagada",
          porPagar: dinero.pendiente + dinero.vencido,
          cuotasVencidas,
          proximoVencimiento: vencimientos[0] ?? null,
          ultimoPago: pagos[0] ?? null,
        },
        parqueaderos,
        cupoParqueaderos: MAX_PARQUEADEROS_POR_PROPIEDAD,
      };
    });
}