"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { obtenerTodasLasPQRS, obtenerPQRSPorUsuario, type PQRS } from "@/lib/pqrsStore";

export function usePQRSLista() {
  const { usuario } = useAuth();

  // Aqui esta el concepto clave: la MISMA pantalla decide que datos
  // traer segun el rol. Un administrador ve todo (RF-44); un
  // residente solo ve lo suyo (extension logica de HU-24, para que
  // pueda darle seguimiento a lo que reporto).
  const [pqrsLista] = useState<PQRS[]>(() => {
    if (!usuario) return [];
    if (usuario.rol === "administrador") return obtenerTodasLasPQRS();
    return obtenerPQRSPorUsuario(usuario.correo);
  });

  return { pqrsLista, esAdministrador: usuario?.rol === "administrador" };
}