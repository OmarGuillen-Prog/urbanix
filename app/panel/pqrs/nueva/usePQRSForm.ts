"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { crearPQRS } from "@/lib/pqrsStore";

interface ErroresPQRS {
  [campo: string]: string;
}

export function usePQRSForm() {
  const router = useRouter();
  const { usuario } = useAuth();

  const [asunto, setAsunto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [errores, setErrores] = useState<ErroresPQRS>({});
  const [guardando, setGuardando] = useState(false);

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();

    // RF-42: validar informacion obligatoria de las PQRS
    const nuevosErrores: ErroresPQRS = {};
    if (asunto.trim() === "") nuevosErrores.asunto = "El asunto es obligatorio";
    if (descripcion.trim() === "") nuevosErrores.descripcion = "La descripción es obligatoria";

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    // Guardia defensiva: en la practica esta pantalla siempre se
    // renderiza con sesion activa (heredado del layout de /panel),
    // pero TypeScript no puede saberlo por si solo.
    if (!usuario) return;

    setGuardando(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setGuardando(false);

    crearPQRS({ asunto, descripcion, correoCreador: usuario.correo });
    router.push("/panel/pqrs");
  }

  return { asunto, setAsunto, descripcion, setDescripcion, errores, guardando, handleSubmit };
}