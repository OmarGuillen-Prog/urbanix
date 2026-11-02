"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { obtenerPreferencias } from "@/lib/configuracionStore";
import { crearTemporizadorInactividad } from "@/lib/inactividad";

// Acciones que cuentan como "la persona sigue ahi"
const EVENTOS_ACTIVIDAD = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"] as const;

// No dibuja nada: solo vigila. Se coloca una vez en el layout del panel.
export function VigilanteInactividad() {
  const { usuario, cerrarSesion } = useAuth();
  const router = useRouter();
  const correo = usuario?.correo;

  useEffect(() => {
    if (!correo) return;

    const temporizador = crearTemporizadorInactividad(
      () => obtenerPreferencias(correo).minutosInactividad,
      () => {
        cerrarSesion();
        router.push("/login");
        window.alert("Tu sesión se cerró por inactividad. Vuelve a iniciar sesión.");
      }
    );

    // mousemove se dispara cientos de veces por segundo: solo reiniciamos a lo sumo 1 vez por segundo
    let ultimoReinicio = Date.now();
    function alHaberActividad() {
      const ahora = Date.now();
      if (ahora - ultimoReinicio < 1000) return;
      ultimoReinicio = ahora;
      temporizador.reiniciar();
    }

    EVENTOS_ACTIVIDAD.forEach((evento) => window.addEventListener(evento, alHaberActividad, { passive: true }));

    // Al desmontar (cerrar sesion, cambiar de usuario) se limpia todo: sin esto quedarian "fantasmas"
    return () => {
      temporizador.detener();
      EVENTOS_ACTIVIDAD.forEach((evento) => window.removeEventListener(evento, alHaberActividad));
    };
  }, [correo, cerrarSesion, router]);

  return null;
}