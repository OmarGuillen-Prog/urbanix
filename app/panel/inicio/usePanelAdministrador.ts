"use client";

import type { ItemResumen } from "@/components/ResumenTarjetas";
import { codigoTicket, obtenerTodasLasPQRS } from "@/lib/pqrsStore";
import { obtenerTodasLasReservas, nombreDeZona } from "@/lib/reservasStore";
import { unidadDeUsuario } from "@/lib/personasHelpers";
import {
  resumenAdministrador,
  resumenParqueadero,
  serieActividad,
  variacionActividad,
  pqrsRecientes,
  proximasReservaciones,
  etiquetaFechaHora,
} from "@/lib/panelStore";

// Son datos DERIVADOS de los stores: se calculan al dibujar la pantalla, sin useState
export function usePanelAdministrador() {
  const resumen = resumenAdministrador();
  const parqueadero = resumenParqueadero();
  const actividad = serieActividad();

  const tarjetas: ItemResumen[] = [
    {
      etiqueta: "Residentes",
      valor: resumen.residentesActivos,
      icono: "👥",
      tono: "brand",
      detalle:
        resumen.residentesInactivos > 0
          ? { texto: `${resumen.residentesInactivos} inactivo(s)`, tono: "neutro" }
          : { texto: "Todos activos", tono: "bueno" },
    },
    {
      etiqueta: "Propiedades",
      valor: resumen.propiedades,
      icono: "🏢",
      tono: "verde",
      detalle: { texto: `${resumen.propiedadesOcupadas} ocupadas`, tono: "bueno" },
    },
    {
      etiqueta: "Ocupación parqueadero",
      valor: `${parqueadero.porcentajeOcupacion}%`,
      icono: "🚗",
      tono: "dorado",
      detalle: { texto: `${parqueadero.ocupados}/${parqueadero.total} ocupados`, tono: "neutro" },
    },
    {
      etiqueta: "PQRS pendientes",
      valor: resumen.pqrsAbiertas,
      icono: "💬",
      tono: "rojo",
      detalle:
        resumen.pqrsAltaPrioridad > 0
          ? { texto: `${resumen.pqrsAltaPrioridad} de alta prioridad`, tono: "malo" }
          : { texto: "Ninguna de alta prioridad", tono: "bueno" },
    },
  ];

  return {
    tarjetas,
    actividad,
    variacion: variacionActividad(actividad),
    parqueadero,
    pqrs: pqrsRecientes(obtenerTodasLasPQRS(), 4).map((p) => ({
      id: p.id,
      codigo: codigoTicket(p.id),
      asunto: p.asunto,
      estado: p.estado,
      prioridad: p.prioridad,
    })),
    reservaciones: proximasReservaciones(obtenerTodasLasReservas(), 3).map((r) => ({
      id: r.id,
      zona: nombreDeZona(r.idZona),
      unidad: unidadDeUsuario(r.correoResidente),
      cuando: etiquetaFechaHora(r.fecha, r.horaInicio),
    })),
  };
}