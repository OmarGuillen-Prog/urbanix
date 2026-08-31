"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Los 3 roles definidos en el documento del proyecto (MER, entidad Rol)
export type Rol = "administrador" | "residente" | "portero";

export interface Sesion {
  nombre: string;
  correo: string;
  rol: Rol;
}

interface SessionContextValue {
  sesion: Sesion | null;
  cargando: boolean;
  iniciarSesion: (datos: Sesion) => void;
  cerrarSesion: () => void;
}

// undefined como valor inicial (en vez de null) nos deja detectar en
// useSession() si alguien lo usa FUERA del Provider por error.
const SessionContext = createContext<SessionContextValue | undefined>(undefined);

const CLAVE_STORAGE = "urbanix_sesion";

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<Sesion | null>(null);
  // "cargando" evita un parpadeo: mientras revisamos localStorage,
  // no sabemos aun si hay sesion o no.
  const [cargando, setCargando] = useState(true);

  // localStorage es una API del NAVEGADOR (un "sistema externo" a
  // React) - por eso este SI es un uso correcto de useEffect, a
  // diferencia del caso que corregimos en HU-03.
  useEffect(() => {
    const guardada = localStorage.getItem(CLAVE_STORAGE);
    if (guardada) {
      setSesion(JSON.parse(guardada));
    }
    setCargando(false);
  }, []);

  function iniciarSesion(datos: Sesion) {
    setSesion(datos);
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(datos));
  }

  function cerrarSesion() {
    setSesion(null);
    localStorage.removeItem(CLAVE_STORAGE);
  }

  return (
    <SessionContext.Provider value={{ sesion, cargando, iniciarSesion, cerrarSesion }}>
      {children}
    </SessionContext.Provider>
  );
}

// Hook de conveniencia: en vez de que cada archivo escriba "useContext(SessionContext)" y maneje el caso undefined,
// centralizamos eso aqui una sola vez.
export function useSession() {
  const contexto = useContext(SessionContext);
  if (!contexto) {
    throw new Error("useSession debe usarse dentro de un SessionProvider");
  }
  return contexto;
}