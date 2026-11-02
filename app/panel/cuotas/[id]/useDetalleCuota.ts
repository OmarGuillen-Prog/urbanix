"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { hoyLocal } from "@/lib/fechas";
import {
  obtenerCuotaPorId,
  registrarPagoCuota,
  rechazarComprobante,
  estadoVisual,
  detalleDeCuota,
  type Cuota,
} from "@/lib/cuotasStore";

export function useDetalleCuota() {
  const params = useParams<{ id: string }>();
  const { usuario } = useAuth();
  const id = params.id;

  const [cuota, setCuota] = useState<Cuota | undefined>(() => obtenerCuotaPorId(id));

  // Registrar el pago
  const [fechaPago, setFechaPago] = useState(() => hoyLocal()); // por defecto, hoy
  const [notaPago, setNotaPago] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [registrado, setRegistrado] = useState(false);
  const [guardando, setGuardando] = useState(false);

  // Revisar el comprobante
  const [ampliada, setAmpliada] = useState(false); // la imagen en grande
  const [rechazando, setRechazando] = useState(false); // se esta escribiendo el motivo
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const [errorRechazo, setErrorRechazo] = useState<string | null>(null);
  const [rechazado, setRechazado] = useState(false);

  async function handleRegistrarPago(evento: React.FormEvent) {
    evento.preventDefault();
    if (!cuota) return;

    setGuardando(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setGuardando(false);

    const resultado = registrarPagoCuota(cuota.id, fechaPago, notaPago);

    if (!resultado.exito) {
      setError(resultado.mensaje ?? "No se pudo registrar el pago.");
      return;
    }

    setError(null);
    setRegistrado(true);
    setCuota(obtenerCuotaPorId(id));
  }

  function handleRechazarComprobante(evento: React.FormEvent) {
    evento.preventDefault();
    if (!cuota) return;

    const resultado = rechazarComprobante(cuota.id, motivoRechazo);

    if (!resultado.exito) {
      setErrorRechazo(resultado.mensaje ?? "No se pudo rechazar el comprobante.");
      return;
    }

    setErrorRechazo(null);
    setRechazando(false);
    setMotivoRechazo("");
    setRechazado(true);
    setCuota(obtenerCuotaPorId(id));
  }

  return {
    esAdministrador: usuario?.rol === "administrador",
    cuota,
    estado: cuota ? estadoVisual(cuota) : null,
    detalle: cuota ? detalleDeCuota(cuota) : null,
    fechaPago, setFechaPago,
    notaPago, setNotaPago,
    error,
    registrado,
    guardando,
    handleRegistrarPago,
    ampliada, setAmpliada,
    rechazando, setRechazando,
    motivoRechazo, setMotivoRechazo,
    errorRechazo,
    rechazado,
    handleRechazarComprobante,
  };
}