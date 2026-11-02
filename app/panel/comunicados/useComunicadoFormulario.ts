"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  obtenerComunicadoPorId,
  crearComunicado,
  actualizarComunicado,
  type CategoriaComunicado,
  type DestinoComunicado,
  type EstadoComunicado,
} from "@/lib/comunicadosStore";

interface ErroresComunicado {
  [campo: string]: string;
}

// Si recibe un comunicadoId, EDITA ese comunicado; si no, CREA uno nuevo.
export function useComunicadoFormulario(comunicadoId?: string) {
  const router = useRouter();
  const { usuario } = useAuth();

  const esEdicion = comunicadoId !== undefined;
  const original = comunicadoId ? obtenerComunicadoPorId(comunicadoId) : undefined;

  const [titulo, setTitulo] = useState(original?.titulo ?? "");
  const [contenido, setContenido] = useState(original?.contenido ?? "");
  const [categoria, setCategoria] = useState<CategoriaComunicado>(original?.categoria ?? "administrativo");
  const [destino, setDestino] = useState<DestinoComunicado>(original?.destino ?? "todos");
  const [estado, setEstado] = useState<EstadoComunicado>(original?.estado ?? "publicado");
  const [fijado, setFijado] = useState(original?.fijado ?? false);
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

    const datos = { titulo: titulo.trim(), contenido: contenido.trim(), categoria, destino, fijado };

    if (esEdicion && comunicadoId) {
      actualizarComunicado(comunicadoId, { ...datos, estado });
    } else {
      // Un comunicado nuevo solo puede nacer como publicado o como borrador
      crearComunicado({
        ...datos,
        estado: estado === "borrador" ? "borrador" : "publicado",
        correoAutor: usuario.correo,
      });
    }

    router.push("/panel/comunicados");
  }

  return {
    esAdministrador: usuario?.rol === "administrador",
    esEdicion,
    comunicadoExiste: original !== undefined,
    titulo, setTitulo,
    contenido, setContenido,
    categoria, setCategoria,
    destino, setDestino,
    estado, setEstado,
    fijado, setFijado,
    errores,
    guardando,
    handleSubmit,
  };
}