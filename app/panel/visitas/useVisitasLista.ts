"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  obtenerTodasLasVisitas,
  obtenerVisitasPorResidente,
  registrarEntrada,
  registrarSalida,
  type Visita,
} from "@/lib/visitasStore";

export function useVisitasLista() {
  const { usuario } = useAuth();

  const [visitas, setVisitas] = useState<Visita[]>(() => {
    if (!usuario) return [];
    // RF-46 (portero) y RF-50 (administrador, historial): ambos ven
    // TODAS las visitas. Un residente (extension de HU-27) solo ve
    // las que el mismo registro.
    if (usuario.rol === "residente") return obtenerVisitasPorResidente(usuario.correo);
    return obtenerTodasLasVisitas();
  });

  function refrescar() {
    if (!usuario) return;
    if (usuario.rol === "residente") {
      setVisitas(obtenerVisitasPorResidente(usuario.correo));
    } else {
      setVisitas(obtenerTodasLasVisitas());
    }
  }

  function handleRegistrarEntrada(id: string) {
    if (!usuario) return;
    registrarEntrada(id, usuario.correo);
    refrescar();
  }

  function handleRegistrarSalida(id: string) {
    registrarSalida(id);
    refrescar();
  }

  // Simulacion de HU-31 (notificar visita): si el residente tiene
  // alguna visita en estado "en_conjunto", se la resaltamos como
  // aviso de llegada apenas carga o refresca esta pantalla.
  const visitaRecienLlegada =
    usuario?.rol === "residente" ? visitas.find((v) => v.estado === "en_conjunto") : undefined;

  return {
    visitas,
    esPortero: usuario?.rol === "portero",
    esAdministrador: usuario?.rol === "administrador",
    esResidente: usuario?.rol === "residente",
    visitaRecienLlegada,
    handleRegistrarEntrada,
    handleRegistrarSalida,
  };
}