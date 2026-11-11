"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";

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

// ---------- localStorage como "fuente externa" ----------
// localStorage vive FUERA de React. Para leer algo externo que cambia, React ofrece
// useSyncExternalStore: nos suscribimos, y React vuelve a dibujar cuando avisamos un cambio.
// (Antes se hacia con un useEffect que llamaba a setState; la regla nueva del linter lo
// desaconseja porque obliga a dibujar la pantalla dos veces.)
const oyentes = new Set<() => void>();

function suscribirse(oyente: () => void): () => void {
  oyentes.add(oyente);
  // "storage" avisa cuando OTRA pestana cambia el localStorage: cerrar sesion en una la cierra en todas
  window.addEventListener("storage", oyente);

  return () => {
    oyentes.delete(oyente);
    window.removeEventListener("storage", oyente);
  };
}

function avisarCambio() {
  oyentes.forEach((oyente) => oyente());
}

// Lo que React lee: el TEXTO guardado (un texto es estable, no genera dibujos de mas)
function leerSesionGuardada(): string | null {
  return localStorage.getItem(CLAVE_STORAGE);
}

// En el servidor no existe localStorage: ahi siempre "no hay sesion"
function leerSesionEnServidor(): string | null {
  return null;
}

// Para saber si ya estamos en el navegador: en el servidor responde false; en el navegador, true.
const sinSuscripcion = () => () => {};

export function AuthProvider({ children }: { children: ReactNode }) {
  const sesionGuardada = useSyncExternalStore(suscribirse, leerSesionGuardada, leerSesionEnServidor);
  const enNavegador = useSyncExternalStore(sinSuscripcion, () => true, () => false);

  // useMemo: el objeto "usuario" solo se vuelve a crear cuando cambia el texto guardado.
  // Asi los componentes que dependen de "usuario" no se redibujan sin necesidad.
  const usuario = useMemo<UsuarioSesion | null>(() => {
    if (!sesionGuardada) return null;
    try {
      return JSON.parse(sesionGuardada) as UsuarioSesion;
    } catch {
      return null; // texto danado: lo tratamos como "sin sesion"
    }
  }, [sesionGuardada]);

  function iniciarSesion(nuevoUsuario: UsuarioSesion) {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(nuevoUsuario));
    avisarCambio();
  }

  function cerrarSesion() {
    localStorage.removeItem(CLAVE_STORAGE);
    avisarCambio();
  }

  return (
    <AuthContext.Provider value={{ usuario, cargando: !enNavegador, iniciarSesion, cerrarSesion }}>
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