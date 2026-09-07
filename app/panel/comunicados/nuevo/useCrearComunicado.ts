"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { crearComunicado } from "@/lib/comunicadosStore";

interface ErroresComunicado {
  [campo: string]: string;
}

export function useCrearComunicado() {
  const router = useRouter();
  const { usuario } = useAuth();

  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [errores, setErrores] = useState<ErroresComunicado>({});
  const [guardando, setGuardando] = useState(false);

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();

    const nuevosErrores: ErroresComunicado = {};
    if (titulo.trim() === "") nuevosErrores.titulo = "El título es obligatorio";
    if (contenido.trim() === "") nuevosErrores.contenido = "El contenido es obligatorio";

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    if (!usuario) return;

    setGuardando(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setGuardando(false);

    // RF-35: el sistema notifica a los residentes al publicar. Sin
    // backend/websockets reales, la "notificacion" honesta que
    // podemos dar es: en cuanto entren a Comunicados, lo veran
    // arriba de todo (gracias al ordenamiento por fecha del store).
    crearComunicado({ titulo, contenido, correoAutor: usuario.correo });
    router.push("/panel/comunicados");
  }

  return { titulo, setTitulo, contenido, setContenido, errores, guardando, handleSubmit };
}