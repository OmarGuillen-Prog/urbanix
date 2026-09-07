"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { crearReporte } from "@/lib/reportesStore";

interface ErroresReporte {
  [campo: string]: string;
}

// Envolvemos FileReader (que usa "callbacks", un estilo mas viejo de
// JavaScript) en una Promise, para poder usar await con el igual que
// con cualquier otra operacion asincrona que ya conoces.
function leerArchivoComoDataURL(archivo: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    // onload se dispara cuando termina de leer el archivo con exito
    lector.onload = () => resolve(lector.result as string);
    // onerror se dispara si algo falla (archivo corrupto, etc.)
    lector.onerror = () => reject(new Error("No se pudo leer el archivo"));
    lector.readAsDataURL(archivo);
  });
}

export function useReportarDano() {
  const router = useRouter();
  const { usuario } = useAuth();

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  // "preview" es lo que se muestra en pantalla (Data URL); es
  // opcional, HU-50 permite adjuntar foto, no lo exige.
  const [preview, setPreview] = useState<string | null>(null);
  const [errores, setErrores] = useState<ErroresReporte>({});
  const [guardando, setGuardando] = useState(false);

  async function handleArchivoChange(evento: React.ChangeEvent<HTMLInputElement>) {
    // evento.target.files es una lista (el input podria permitir
    // varios archivos); tomamos solo el primero con [0].
    const archivo = evento.target.files?.[0];
    if (!archivo) return;

    try {
      const dataUrl = await leerArchivoComoDataURL(archivo);
      setPreview(dataUrl);
    } catch {
      setErrores({ evidenciaFoto: "No se pudo cargar la imagen. Intenta con otro archivo." });
    }
  }

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();

    const nuevosErrores: ErroresReporte = {};
    if (titulo.trim() === "") nuevosErrores.titulo = "El título es obligatorio";
    if (descripcion.trim() === "") nuevosErrores.descripcion = "La descripción es obligatoria";

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    if (!usuario) return;

    setGuardando(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setGuardando(false);

    crearReporte({ titulo, descripcion, evidenciaFoto: preview, correoCreador: usuario.correo });
    router.push("/panel/reportes");
  }

  return {
    titulo, setTitulo,
    descripcion, setDescripcion,
    preview,
    handleArchivoChange,
    errores,
    guardando,
    handleSubmit,
  };
}