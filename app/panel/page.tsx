"use client";

import { useAuth } from "@/context/AuthContext";
import { obtenerConfigConjunto } from "@/lib/configuracionStore";
import { PanelAdministrador } from "./inicio/PanelAdministrador";
import { PanelResidente } from "./inicio/PanelResidente";
import { PanelPortero } from "./inicio/PanelPortero";

export default function PanelPage() {
  const { usuario } = useAuth();

  // El panel de inicio se adapta al rol: cada persona ve lo que le sirve en su dia a dia
  if (!usuario) return null;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Hola, {usuario.nombres}</h1>
      <p className="mt-1 text-ink/60">{obtenerConfigConjunto().nombre}</p>

      {usuario.rol === "administrador" && <PanelAdministrador />}
      {usuario.rol === "residente" && <PanelResidente />}
      {usuario.rol === "portero" && <PanelPortero />}
    </div>
  );
}