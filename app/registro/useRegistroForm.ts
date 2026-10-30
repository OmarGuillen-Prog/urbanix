// app/registro/useRegistroForm.ts
"use client";

import { useState } from "react";

const correosYaRegistrados = ["omar@urbanix.com", "juan@urbanix.com"];

function verificarCorreoExistente(correo: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const existe = correosYaRegistrados.includes(correo.toLowerCase().trim());
      resolve(existe);
    }, 500);
  });
}

export function useRegistroForm() {
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
    // Nueva validacion: mismo patron que ya usaste en Restablecer
    // contraseña - comparar los dos campos de contraseña entre si.
    if (confirmarContrasena !== contrasena) {
      nuevosErrores.confirmarContrasena = "Las contraseñas no coinciden";
    }

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    setEnviando(true);
    const correoYaExiste = await verificarCorreoExistente(correo);
    setEnviando(false);

    if (correoYaExiste) {
      setErrores({ correo: "Este correo ya está registrado" });
      return;
    }

    setErrores({});
    console.log("Formulario válido, listo para enviar:", {
      nombres,
      apellidos,
      correo,
      telefono,
      numeroUnidad,
      contrasena,
    });
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