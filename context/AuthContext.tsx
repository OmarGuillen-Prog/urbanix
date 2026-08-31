"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// El rol determina que puede ver y hacer cada usuario (RNF-03).
// Definirlo como un tipo (no un string cualquiera) evita errores de
// tipeo: TypeScript no te deja escribir "Administrador" con mayuscula
// por accidente, por ejemplo.
export type Rol = "administrador" | "residente" | "portero";

export interface UsuarioSesion {
  nombres: string;
  apellidos: string;
  correo: string;
  rol: Rol;
}

interface AuthContextValue {
  usuario: UsuarioSesion | null;
  cargando: boolean; // true mientras revisamos si habia sesion guardada
  iniciarSesion: (usuario: UsuarioSesion) => void;
  cerrarSesion: () => void;
}

// El "undefined" inicial es intencional: nos sirve para detectar en
// useAuth() si alguien intenta usar el contexto fuera del Provider.
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const CLAVE_STORAGE = "urbanix_sesion";

// El Provider es el componente que "instala el intercomunicador" -
// envuelve tu app entera y le da a todos sus hijos acceso al contexto.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);
  const [cargando, setCargando] = useState(true);

  // Efecto legitimo (a diferencia del caso de HU-03): localStorage es
  // un sistema EXTERNO a React (vive en el navegador), asi que
  // sincronizar nuestro estado con el, al arrancar la app, es
  // exactamente para lo que useEffect existe.
  useEffect(() => {
    const guardado = localStorage.getItem(CLAVE_STORAGE);
    if (guardado) {
      setUsuario(JSON.parse(guardado));
    }
    setCargando(false);
  }, []);

  function iniciarSesion(nuevoUsuario: UsuarioSesion) {
    setUsuario(nuevoUsuario);
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(nuevoUsuario));
  }

  function cerrarSesion() {
    setUsuario(null);
    localStorage.removeItem(CLAVE_STORAGE);
  }

  return (
    <AuthContext.Provider value={{ usuario, cargando, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook de conveniencia: en vez de que cada componente escriba
// useContext(AuthContext) y maneje el caso "undefined" el mismo,
// centralizamos eso aqui - y lanzamos un error claro si alguien usa
// useAuth() fuera del Provider, en vez de un bug silencioso raro.
export function useAuth() {
  const contexto = useContext(AuthContext);
  if (contexto === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return contexto;
}