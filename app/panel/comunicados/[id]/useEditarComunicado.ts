"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { obtenerComunicadoPorId, actualizarComunicado } from "@/lib/comunicadosStore";

interface ErroresComunicado {
  [campo: string]: string;
}

export function useEditarComunicado(id: string) {
  const router = useRouter();
  const comunicadoOriginal = obtenerComunicadoPorId(id);

  const [titulo, setTitulo] = useState(comunicadoOriginal?.titulo ?? "");
  const [contenido, setContenido] = useState(comunicadoOriginal?.contenido ?? "");
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

    setGuardando(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setGuardando(false);

    actualizarComunicado(id, { titulo, contenido });
    router.push("/panel/comunicados");
  }

  return {
    comunicadoExiste: comunicadoOriginal !== undefined,
    titulo, setTitulo,
    contenido, setContenido,
    errores,
    guardando,
    handleSubmit,
  };
}