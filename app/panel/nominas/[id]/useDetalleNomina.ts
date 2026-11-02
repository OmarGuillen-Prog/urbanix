"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  obtenerRegistroNominaPorId,
  marcarNominaComoPagada,
  liquidar,
  type RegistroNomina,
} from "@/lib/nominaStore";

export function useDetalleNomina() {
  const params = useParams<{ id: string }>();
  const { usuario } = useAuth();
  const id = params.id;

  const [registro, setRegistro] = useState<RegistroNomina | undefined>(() => obtenerRegistroNominaPorId(id));

  function handleMarcarPagado() {
    if (!registro) return;
    marcarNominaComoPagada(registro.id);
    setRegistro(obtenerRegistroNominaPorId(id));
  }

  return {
    esAdministrador: usuario?.rol === "administrador",
    registro,
    liquidacion: registro ? liquidar(registro) : null,
    handleMarcarPagado,
  };
}