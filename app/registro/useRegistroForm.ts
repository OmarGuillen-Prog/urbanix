"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { registrarCuenta } from "@/lib/credencialesStore";

export function useRegistroForm() {
  const router = useRouter();
  const { iniciarSesion } = useAuth();

  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [numeroUnidad, setNumeroUnidad] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [errores, setErrores] = useState<{ [campo: string]: string }>({});
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();

    const nuevosErrores: { [campo: string]: string } = {};

    if (nombres.trim() === "") nuevosErrores.nombres = "El nombre es obligatorio";
    if (apellidos.trim() === "") nuevosErrores.apellidos = "El apellido es obligatorio";
    if (correo.trim() === "") nuevosErrores.correo = "El correo es obligatorio";
    if (telefono.trim() === "") nuevosErrores.telefono = "El teléfono es obligatorio";
    if (numeroUnidad.trim() === "") nuevosErrores.numeroUnidad = "El número de unidad es obligatorio";
    if (contrasena.length < 8) {
      nuevosErrores.contrasena = "La contraseña debe tener mínimo 8 caracteres";
    }
    if (confirmarContrasena !== contrasena) {
      nuevosErrores.confirmarContrasena = "Las contraseñas no coinciden";
    }

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    // Las validaciones locales primero; solo si pasan "consultamos al servidor" (simulado)
    setEnviando(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const resultado = registrarCuenta({ nombres, apellidos, correo, telefono, numeroUnidad, contrasena });
    setEnviando(false);

    if (!resultado.exito) {
      // HU-01, criterio 3: no se permite el registro duplicado
      setErrores({ correo: resultado.mensaje });
      return;
    }

    // Cuenta creada (HU-01, criterio 1): la persona entra directo a su panel de residente
    setErrores({});
    iniciarSesion(resultado.sesion);
    router.push("/panel");
  }

  return {
    nombres, setNombres,
    apellidos, setApellidos,
    correo, setCorreo,
    telefono, setTelefono,
    numeroUnidad, setNumeroUnidad,
    contrasena, setContrasena,
    confirmarContrasena, setConfirmarContrasena,
    errores,
    enviando,
    handleSubmit,
  };
}