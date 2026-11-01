"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { crearReporte, MAX_EVIDENCIAS, MAX_MB_POR_EVIDENCIA } from "@/lib/reportesStore";

interface ErroresReporte {
  [campo: string]: string;
}

// Envolvemos FileReader (que usa "callbacks") en una Promise para poder usar await
function leerArchivoComoDataURL(archivo: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onload = () => resolve(lector.result as string);
    lector.onerror = () => reject(new Error("No se pudo leer el archivo"));
    lector.readAsDataURL(archivo);
  });
}

export function useReportarDano() {
  const router = useRouter();
  const { usuario } = useAuth();

  const [titulo, setTitulo] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [evidencias, setEvidencias] = useState<string[]>([]); // HU-50: ahora pueden ser varias
  const [errores, setErrores] = useState<ErroresReporte>({});
  const [guardando, setGuardando] = useState(false);

  async function handleArchivosChange(evento: React.ChangeEvent<HTMLInputElement>) {
    // Copiamos la lista de archivos y limpiamos el input, para poder volver a
    // elegir el MISMO archivo despues de quitarlo
    const archivos = Array.from(evento.target.files ?? []);
    evento.target.value = "";
    if (archivos.length === 0) return;

    function rechazar(mensaje: string) {
      setErrores((anterior) => ({ ...anterior, evidencias: mensaje }));
    }

    if (evidencias.length + archivos.length > MAX_EVIDENCIAS) {
      rechazar(`Máximo ${MAX_EVIDENCIAS} imágenes por reporte.`);
      return;
    }
    if (archivos.some((archivo) => !archivo.type.startsWith("image/"))) {
      rechazar("Solo se permiten archivos de imagen.");
      return;
    }
    if (archivos.some((archivo) => archivo.size > MAX_MB_POR_EVIDENCIA * 1024 * 1024)) {
      rechazar(`Cada imagen debe pesar menos de ${MAX_MB_POR_EVIDENCIA} MB.`);
      return;
    }

    try {
      // Promise.all lee todas las imagenes a la vez y espera a que terminen
      const nuevas = await Promise.all(archivos.map(leerArchivoComoDataURL));
      setEvidencias((anterior) => [...anterior, ...nuevas]);
      setErrores((anterior) => ({ ...anterior, evidencias: "" }));
    } catch {
      rechazar("No se pudo cargar una de las imágenes. Intenta con otra.");
    }
  }

  function quitarEvidencia(indice: number) {
    setEvidencias((anterior) => anterior.filter((_, posicion) => posicion !== indice));
  }

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();

    const nuevosErrores: ErroresReporte = {};
    if (titulo.trim() === "") nuevosErrores.titulo = "El título es obligatorio";
    if (ubicacion.trim() === "") nuevosErrores.ubicacion = "Indica dónde está el daño";
    if (descripcion.trim() === "") nuevosErrores.descripcion = "La descripción es obligatoria";

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    if (!usuario) return;

    setGuardando(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setGuardando(false);

    crearReporte({
      titulo: titulo.trim(),
      ubicacion: ubicacion.trim(),
      descripcion: descripcion.trim(),
      evidencias,
      correoCreador: usuario.correo,
    });
    router.push("/panel/reportes");
  }

  return {
    titulo, setTitulo,
    ubicacion, setUbicacion,
    descripcion, setDescripcion,
    evidencias,
    handleArchivosChange,
    quitarEvidencia,
    errores,
    guardando,
    handleSubmit,
  };
}