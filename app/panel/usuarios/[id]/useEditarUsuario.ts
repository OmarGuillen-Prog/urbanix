"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  obtenerUsuarioPorId,
  actualizarUsuario,
  type Usuario,
} from "@/lib/usuariosStore";
import type { Rol } from "@/context/AuthContext";

interface ErroresEdicion {
  [campo: string]: string;
}

export function useEditarUsuario(id: string) {
  const router = useRouter();

  // Cálculo directo durante el render (¿recuerdas la lección del
  // useEffect innecesario en HU-03? Aquí aplica el mismo principio:
  // esto es síncrono, no hace falta useEffect).
  const usuarioOriginal = obtenerUsuarioPorId(id);

  const [nombres, setNombres] = useState(usuarioOriginal?.nombres ?? "");
  const [apellidos, setApellidos] = useState(usuarioOriginal?.apellidos ?? "");
  const [correo, setCorreo] = useState(usuarioOriginal?.correo ?? "");
  const [telefono, setTelefono] = useState(usuarioOriginal?.telefono ?? "");
  const [rol, setRol] = useState<Rol>(usuarioOriginal?.rol ?? "residente");
  const [estado, setEstado] = useState<Usuario["estado"]>(
    usuarioOriginal?.estado ?? "activo"
  );
  const [errores, setErrores] = useState<ErroresEdicion>({});
  const [guardando, setGuardando] = useState(false);

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();

    const nuevosErrores: ErroresEdicion = {};
    if (nombres.trim() === "") nuevosErrores.nombres = "El nombre es obligatorio";
    if (apellidos.trim() === "") nuevosErrores.apellidos = "El apellido es obligatorio";
    if (correo.trim() === "") nuevosErrores.correo = "El correo es obligatorio";

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setGuardando(true);
    await new Promise((resolve) => setTimeout(resolve, 400)); // simula guardado
    setGuardando(false);

    // RF-15/16: al guardar, el rol (y demas permisos derivados de el)
    // quedan actualizados de inmediato.
    actualizarUsuario(id, { nombres, apellidos, correo, telefono, rol, estado });

    // Volvemos al listado, que al montarse de nuevo leera los datos
    // ya actualizados desde el store.
    router.push("/panel/usuarios");
  }

  return {
    usuarioExiste: usuarioOriginal !== undefined,
    nombres,
    setNombres,
    apellidos,
    setApellidos,
    correo,
    setCorreo,
    telefono,
    setTelefono,
    rol,
    setRol,
    estado,
    setEstado,
    errores,
    guardando,
    handleSubmit,
  };
}