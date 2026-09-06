"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { obtenerPQRSPorId, responderPQRS } from "@/lib/pqrsStore";

export function useDetallePQRS(id: string) {
  const { usuario } = useAuth();
  const [pqrs, setPqrs] = useState(() => obtenerPQRSPorId(id));
  const [respuesta, setRespuesta] = useState("");
  const [enviando, setEnviando] = useState(false);

  const esAdministrador = usuario?.rol === "administrador";
  // Un residente solo puede ver ESTA pqrs si el fue quien la creo -
  // segunda capa de la misma idea de "filtrado por rol", ahora
  // aplicada a un solo registro en vez de a una lista completa.
  const tieneAcceso = esAdministrador || pqrs?.correoCreador === usuario?.correo;

  async function handleResponder(evento: React.FormEvent) {
    evento.preventDefault();
    if (respuesta.trim() === "" || !pqrs) return;

    setEnviando(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setEnviando(false);

    responderPQRS(pqrs.id, respuesta);
    // Volvemos a leer del store para reflejar el cambio en esta misma
    // pantalla (misma idea que usaste al editar/eliminar usuarios).
    setPqrs(obtenerPQRSPorId(id));
    setRespuesta("");
  }

  return { pqrs, tieneAcceso, esAdministrador, respuesta, setRespuesta, enviando, handleResponder };
}