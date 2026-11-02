"use client";

import { useAuth } from "@/context/AuthContext";
import type { ItemResumen } from "@/components/ResumenTarjetas";
import { formatearMoneda } from "@/lib/formatos";
import { codigoTicket, obtenerPQRSPorUsuario } from "@/lib/pqrsStore";
import { obtenerReservasPorUsuario, nombreDeZona } from "@/lib/reservasStore";
import { obtenerComunicadosParaUsuario } from "@/lib/comunicadosStore";
import { resumenResidente, pqrsRecientes, proximasReservaciones, etiquetaFecha, etiquetaFechaHora } from "@/lib/panelStore";

export function usePanelResidente() {
  const { usuario } = useAuth();
  const correo = usuario?.correo ?? "";

  const resumen = resumenResidente(correo);
  const proximas = proximasReservaciones(obtenerReservasPorUsuario(correo), 3);

  const tarjetas: ItemResumen[] = [
    {
      etiqueta: "Por pagar",
      valor: formatearMoneda(resumen.porPagar),
      icono: "💳",
      tono: resumen.cuotasVencidas > 0 ? "rojo" : "verde",
      detalle:
        resumen.cuotasVencidas > 0
          ? { texto: `${resumen.cuotasVencidas} cuota(s) vencida(s)`, tono: "malo" }
          : resumen.porPagar === 0
            ? { texto: "Estás al día", tono: "bueno" }
            : { texto: "Dentro del plazo", tono: "neutro" },
    },
    {
      etiqueta: "Mis PQRS abiertas",
      valor: resumen.pqrsAbiertas,
      icono: "💬",
      tono: "dorado",
      detalle: { texto: `${resumen.pqrsResueltas} resuelta(s)`, tono: "neutro" },
    },
    {
      etiqueta: "Próxima reserva",
      // En la tarjeta solo cabe la fecha corta; la zona y la hora van en el texto de apoyo
      valor: proximas.length > 0 ? etiquetaFecha(proximas[0].fecha) : "—",
      icono: "📅",
      tono: "brand",
      detalle: {
        texto: proximas.length > 0 ? `${nombreDeZona(proximas[0].idZona)} · ${proximas[0].horaInicio}` : "Sin reservas próximas",
        tono: "neutro",
      },
    },
    {
      etiqueta: "Visitas esperadas hoy",
      valor: resumen.visitasEsperadasHoy,
      icono: "🚪",
      tono: "gris",
      detalle: { texto: `${resumen.visitasEnConjunto} en el conjunto`, tono: "neutro" },
    },
  ];

  return {
    nombres: usuario?.nombres ?? "",
    tarjetas,
    pqrs: pqrsRecientes(obtenerPQRSPorUsuario(correo), 4).map((p) => ({
      id: p.id,
      codigo: codigoTicket(p.id),
      asunto: p.asunto,
      estado: p.estado,
      prioridad: p.prioridad,
    })),
    reservaciones: proximas.map((r) => ({
      id: r.id,
      zona: nombreDeZona(r.idZona),
      cuando: etiquetaFechaHora(r.fecha, r.horaInicio),
    })),
    comunicados: usuario ? obtenerComunicadosParaUsuario(usuario.correo, usuario.rol).slice(0, 3) : [],
    correo,
  };
}