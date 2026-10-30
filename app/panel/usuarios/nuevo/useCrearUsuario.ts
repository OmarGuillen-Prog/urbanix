// app/panel/usuarios/nuevo/useCrearUsuario.ts
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { crearUsuario, existeCorreoUsuario } from "@/lib/usuariosStore";
import type { Rol } from "@/context/AuthContext";

interface ErroresUsuario {
  [campo: string]: string;
}

export function useCrearUsuario() {
  const router = useRouter();

  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [documento, setDocumento] = useState("");
  const [rol, setRol] = useState<Rol>("residente");
  const [errores, setErrores] = useState<ErroresUsuario>({});
  const [guardando, setGuardando] = useState(false);

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();

    const nuevosErrores: ErroresUsuario = {};
    if (nombres.trim() === "") nuevosErrores.nombres = "El nombre es obligatorio";
    if (apellidos.trim() === "") nuevosErrores.apellidos = "El apellido es obligatorio";
    if (correo.trim() === "") nuevosErrores.correo = "El correo es obligatorio";
    else if (existeCorreoUsuario(correo)) nuevosErrores.correo = "Ya existe un usuario con este correo";

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setGuardando(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setGuardando(false);

    crearUsuario({ nombres, apellidos, correo, telefono, documento, estado: "activo", rol });
    router.push("/panel/usuarios");
  }

  return {
    nombres, setNombres,
    apellidos, setApellidos,
    correo, setCorreo,
    telefono, setTelefono,
    documento, setDocumento,
    rol, setRol,
    errores,
    guardando,
    handleSubmit,
  };
}