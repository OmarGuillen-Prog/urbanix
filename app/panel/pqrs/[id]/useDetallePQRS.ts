"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  obtenerPQRSPorId,
  actualizarPQRS,
  usuariosAsignables,
  type PQRS,
  type EstadoPQRS,
  type PrioridadPQRS,
} from "@/lib/pqrsStore";

export function useDetallePQRS(id: string) {
  const { usuario } = useAuth();

  const [pqrs, setPqrs] = useState<PQRS | undefined>(() => obtenerPQRSPorId(id));
  const [estado, setEstado] = useState<EstadoPQRS>(pqrs?.estado ?? "pendiente");
  const [prioridad, setPrioridad] = useState<PrioridadPQRS>(pqrs?.prioridad ?? "media");
  const [correoAsignado, setCorreoAsignado] = useState(pqrs?.correoAsignado ?? "");
  const [respuesta, setRespuesta] = useState(pqrs?.respuesta ?? "");
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);

  const esAdministrador = usuario?.rol === "administrador";
  // Un residente solo ve SU solicitud (cosmetico: la seguridad real vive en el backend)
  const tieneAcceso = esAdministrador || pqrs?.correoCreador === usuario?.correo;

  async function handleGuardar(evento: React.FormEvent) {
    evento.preventDefault();
    if (!pqrs) return;

    setGuardado(false);

    // Regla de negocio: no se puede cerrar una solicitud sin responderla (HU-25)
    if (estado === "resuelto" && respuesta.trim() === "") {
      setError("Escribe una respuesta antes de marcar la solicitud como resuelta.");
      return;
    }
    setError(null);

    setGuardando(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setGuardando(false);

    actualizarPQRS(pqrs.id, {
      estado,
      prioridad,
      correoAsignado: correoAsignado === "" ? null : correoAsignado,
      respuesta,
    });
    setPqrs(obtenerPQRSPorId(id));
    setGuardado(true);
  }

  return {
    pqrs,
    tieneAcceso,
    esAdministrador,
    asignables: usuariosAsignables(),
    estado, setEstado,
    prioridad, setPrioridad,
    correoAsignado, setCorreoAsignado,
    respuesta, setRespuesta,
    error,
    guardando,
    guardado,
    handleGuardar,
  };
}