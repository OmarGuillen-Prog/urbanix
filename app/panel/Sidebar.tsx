"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, type Rol } from "@/context/AuthContext";
import { useEffect } from "react";

interface ItemMenu {
  label: string;
  href: string;
  disponible: boolean;
  // Que roles pueden VER este item en el menu. Basado en los actores
  // que el documento asigna a cada modulo en las historias de usuario.
  roles: Rol[];
}

const ITEMS_MENU: ItemMenu[] = [
  { label: "Panel Principal", href: "/panel", disponible: true, roles: ["administrador", "residente", "portero"] },
  { label: "Usuarios", href: "/panel/usuarios", disponible: true, roles: ["administrador"] },  
  { label: "Propiedades", href: "/panel/propiedades", disponible: true, roles: ["administrador", "residente"] },
  { label: "PQRS", href: "/panel/pqrs", disponible: true, roles: ["administrador", "residente"] },
  { label: "Reservaciones", href: "/panel/reservas", disponible: true, roles: ["administrador", "residente"] },
  { label: "Zonas comunes", href: "/panel/zonas-comunes", disponible: true, roles: ["administrador", "residente"] },
  { label: "Visitas", href: "/panel/visitas", disponible: true, roles: ["administrador", "residente", "portero"] },
  { label: "Parqueaderos", href: "/panel/parqueaderos", disponible: true, roles: ["administrador"] },
  { label: "Reportes", href: "/panel/estadisticas", disponible: true, roles: ["administrador"] },
  { label: "Reportes de daños", href: "/panel/reportes", disponible: true, roles: ["administrador", "residente"] },
  { label: "Comunicados", href: "/panel/comunicados", disponible: true, roles: ["administrador", "residente", "portero"] },
  { label: "Notificaciones", href: "/panel/notificaciones", disponible: true, roles: ["administrador", "residente", "portero"] },
  { label: "Cuotas", href: "/panel/cuotas", disponible: true, roles: ["administrador", "residente"] },
  { label: "Nóminas", href: "/panel/nominas", disponible: true, roles: ["administrador"] },
  { label: "Configuración", href: "/panel/configuracion", disponible: true, roles: ["administrador", "residente", "portero"] },
];

interface SidebarProps {
  abierto: boolean; // en pantallas pequeñas: ¿el menu esta desplegado?
  onCerrar: () => void;
}

export function Sidebar({ abierto, onCerrar }: SidebarProps) {
  const pathname = usePathname();
  const { usuario } = useAuth();

  const itemsVisibles = ITEMS_MENU.filter((item) => (usuario ? item.roles.includes(usuario.rol) : false));

  // Con el menu desplegado, la tecla Escape lo cierra
  useEffect(() => {
    if (!abierto) return;

    function alPulsarTecla(evento: KeyboardEvent) {
      if (evento.key === "Escape") onCerrar();
    }

    window.addEventListener("keydown", alPulsarTecla);
    return () => window.removeEventListener("keydown", alPulsarTecla);
  }, [abierto, onCerrar]);

  return (
    <>
      {/* Fondo oscuro detras del menu: solo existe en pantallas pequenas y mientras el menu esta abierto */}
      {abierto && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={onCerrar} aria-hidden="true" />}

      <aside
        aria-label="Menú principal"
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col overflow-y-auto bg-brand-dark p-6 transition-[transform,visibility] duration-200 lg:static lg:z-auto lg:translate-x-0 lg:visible ${
          abierto ? "translate-x-0" : "invisible -translate-x-full"
        }`}
      >
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/70">URBANIX</p>

        {usuario && <p className="mt-1 text-xs capitalize text-white/40">{usuario.rol}</p>}

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {itemsVisibles.map((item) => {
            const activo = pathname === item.href;

            if (!item.disponible) {
              return (
                <div
                  key={item.href}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-white/30"
                >
                  <span>{item.label}</span>
                  <span className="text-[10px] uppercase tracking-wide">Pronto</span>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCerrar}
                className={
                  activo
                    ? "rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white"
                    : "rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}