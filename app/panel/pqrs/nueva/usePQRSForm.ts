"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { crearPQRS, type TipoPQRS } from "@/lib/pqrsStore";

interface ErroresPQRS {
  [campo: string]: string;
}

export function usePQRSForm() {
  const router = useRouter();
  const { usuario } = useAuth();

  const [tipo, setTipo] = useState<TipoPQRS>("peticion");
  const [asunto, setAsunto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [errores, setErrores] = useState<ErroresPQRS>({});
  const [guardando, setGuardando] = useState(false);

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();

    const nuevosErrores: ErroresPQRS = {};
    if (asunto.trim() === "") nuevosErrores.asunto = "El asunto es obligatorio";
    if (descripcion.trim() === "") nuevosErrores.descripcion = "La descripción es obligatoria";

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    if (!usuario) return;

    setGuardando(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setGuardando(false);

    crearPQRS({ tipo, asunto, descripcion, correoCreador: usuario.correo });
    router.push("/panel/pqrs");
  }

  return { tipo, setTipo, asunto, setAsunto, descripcion, setDescripcion, errores, guardando, handleSubmit };
}