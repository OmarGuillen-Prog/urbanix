"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { SECCIONES, type SeccionConfiguracion } from "./etiquetas";
import { SeccionPerfil } from "./SeccionPerfil";
import { SeccionNotificaciones } from "./SeccionNotificaciones";
import { SeccionSeguridad } from "./SeccionSeguridad";
import { SeccionConjunto } from "./SeccionConjunto";
import { SeccionPrivacidad } from "./SeccionPrivacidad";

export default function ConfiguracionPage() {
  const { usuario } = useAuth();
  const [seccion, setSeccion] = useState<SeccionConfiguracion>("perfil");

  // Cada persona solo ve las secciones que le corresponden por su rol
  const seccionesVisibles = SECCIONES.filter((s) => !s.soloAdministrador || usuario?.rol === "administrador");

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Configuración</h1>
      <p className="mt-1 text-ink/60">Administra tus preferencias y la configuración del sistema</p>

      <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start">
        <nav
          aria-label="Secciones de configuración"
          className="flex gap-1 overflow-x-auto rounded-xl border border-line bg-white p-2 lg:w-64 lg:shrink-0 lg:flex-col"
        >
          {seccionesVisibles.map((item) => (
            <button
              key={item.clave}
              onClick={() => setSeccion(item.clave)}
              aria-current={seccion === item.clave ? "page" : undefined}
              className={`flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                seccion === item.clave ? "bg-brand/10 font-medium text-brand" : "text-ink/70 hover:bg-canvas"
              }`}
            >
              <span aria-hidden="true">{item.icono}</span>
              {item.titulo}
            </button>
          ))}
        </nav>

        <div className="min-w-0 flex-1">
          {seccion === "perfil" && <SeccionPerfil />}
          {seccion === "notificaciones" && <SeccionNotificaciones />}
          {seccion === "seguridad" && <SeccionSeguridad />}
          {seccion === "conjunto" && <SeccionConjunto />}
          {seccion === "privacidad" && <SeccionPrivacidad />}
        </div>
      </div>
    </div>
  );
}