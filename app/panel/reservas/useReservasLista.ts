"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  obtenerTodasLasReservas,
  obtenerReservasPorUsuario,
  obtenerZonas,
  codigoReserva,
  nombreDeZona,
  hoyLocal,
  type Reserva,
  type EstadoReserva,
} from "@/lib/reservasStore";
import { nombrePorCorreo } from "@/lib/personasHelpers";

export function useReservasLista() {
  const { usuario } = useAuth();
  const esAdministrador = usuario?.rol === "administrador";

  // El administrador ve todas; el residente, solo las suyas
  const [reservas] = useState<Reserva[]>(() => {
    if (!usuario) return [];
    return esAdministrador ? obtenerTodasLasReservas() : obtenerReservasPorUsuario(usuario.correo);
  });

  const [busqueda, setBusqueda] = useState("");
  const [filtroZona, setFiltroZona] = useState<string>("todas");
  const [filtroEstado, setFiltroEstado] = useState<EstadoReserva | "todos">("todos");

  const reservasFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return reservas.filter((r) => {
      const coincideTexto =
        termino === "" ||
        codigoReserva(r.id).toLowerCase().includes(termino) ||
        nombreDeZona(r.idZona).toLowerCase().includes(termino) ||
        nombrePorCorreo(r.correoResidente).toLowerCase().includes(termino);
      const coincideZona = filtroZona === "todas" || r.idZona === filtroZona;
      const coincideEstado = filtroEstado === "todos" || r.estado === filtroEstado;
      return coincideTexto && coincideZona && coincideEstado;
    });
  }, [reservas, busqueda, filtroZona, filtroEstado]);

  // --- Metricas: solo reservas del MES ACTUAL (como en tu referencia) ---
  const mesActual = hoyLocal().slice(0, 7); // "2026-10"
  const delMes = reservas.filter((r) => r.fecha.startsWith(mesActual));
  const totalMes = delMes.length;
  const confirmadas = delMes.filter((r) => r.estado === "confirmada").length;
  const pendientes = delMes.filter((r) => r.estado === "pendiente").length;
  const canceladas = delMes.filter((r) => r.estado === "cancelada").length;

  return {
    esAdministrador,
    zonas: obtenerZonas(),
    reservasFiltradas,
    busqueda, setBusqueda,
    filtroZona, setFiltroZona,
    filtroEstado, setFiltroEstado,
    totalMes,
    confirmadas,
    pendientes,
    canceladas,
  };
}