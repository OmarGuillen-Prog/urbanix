"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ReservaFormulario } from "../../ReservaFormulario";

export default function EditarReservaPage() {
  const params = useParams<{ id: string }>();
  const { usuario } = useAuth();

  // Solo el administrador edita reservas (la seguridad real vive en el backend)
  if (usuario?.rol !== "administrador") {
    return (
      <div>
        <p className="text-ink/60">No tienes permiso para acceder a esta sección.</p>
        <Link href="/panel/reservas" className="mt-4 inline-block text-brand hover:text-brand-dark">
          ← Volver
        </Link>
      </div>
    );
  }

  return <ReservaFormulario reservaId={params.id} />;
}