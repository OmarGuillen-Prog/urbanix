"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { obtenerPQRSPorUsuario, type PQRS } from "@/lib/pqrsStore";

export function usePQRSResidente() {
  const { usuario } = useAuth();
  const [pqrsLista] = useState<PQRS[]>(() => (usuario ? obtenerPQRSPorUsuario(usuario.correo) : []));

  return { pqrsLista };
}