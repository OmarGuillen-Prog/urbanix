"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, type Rol } from "@/context/AuthContext";

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
  { label: "Reservaciones", href: "/panel/reservas", disponible: false, roles: ["administrador", "residente"] },
  { label: "Visitas", href: "/panel/visitas", disponible: true, roles: ["administrador", "residente", "portero"] },
  { label: "Parqueaderos", href: "/panel/parqueaderos", disponible: false, roles: ["administrador"] },
  { label: "Reportes de daños", href: "/panel/reportes", disponible: false, roles: ["administrador", "residente"] },
  { label: "Comunicados", href: "/panel/comunicados", disponible: false, roles: ["administrador", "residente"] },
  { label: "Cuotas", href: "/panel/cuotas", disponible: false, roles: ["administrador", "residente"] },
  { label: "Nóminas", href: "/panel/nominas", disponible: false, roles: ["administrador"] },
  { label: "Configuración", href: "/panel/configuracion", disponible: false, roles: ["administrador", "residente", "portero"] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { usuario } = useAuth();

  // Filtramos ANTES de dibujar: un residente ni siquiera "sabe" que
  // el item "Usuarios" existe en el arreglo - simplemente no aparece.
  // Si usuario es null (no deberia pasar aqui, porque el layout ya
  // protege esta ruta, pero TypeScript no lo sabe), usamos un arreglo
  // vacio como resguardo.
  const itemsVisibles = ITEMS_MENU.filter((item) =>
    usuario ? item.roles.includes(usuario.rol) : false
  );

  return (
    <aside className="flex h-screen w-64 flex-col bg-brand-dark p-6">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/70">
        URBANIX
      </p>

      {/* Mostramos el rol activo - ayuda muchisimo mientras pruebas
          con distintos usuarios, y tambien es una buena practica de
          UI real (que el usuario sepa "con que sombrero" esta viendo la app) */}
      {usuario && (
        <p className="mt-1 text-xs capitalize text-white/40">{usuario.rol}</p>
      )}

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
                <span className="text-[10px] uppercase tracking-wide">
                  Pronto
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
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
  );
}