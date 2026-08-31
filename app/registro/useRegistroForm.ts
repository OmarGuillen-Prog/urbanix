"use client";

import { useState } from "react";

interface DatosRegistro {
  nombres: string;
  apellidos: string;
  correo: string;
  contrasena: string;
}

interface ErroresRegistro {
  [campo: string]: string;
}

// --- SIMULACIÓN DE BACKEND ---
// Esta lista representa "correos que ya existen en la base de datos".
// Cuando Juan Manuel tenga el backend listo, esta función entera se
// reemplaza por una llamada real (fetch) a la API - el resto del código
// que la usa no debería necesitar cambios.
const correosYaRegistrados = ["omar@urbanix.com", "juan@urbanix.com"];

function verificarCorreoExistente(correo: string): Promise<boolean> {
  // Promise es una "promesa" de que en algún momento futuro vas a
  // tener una respuesta (true o false). resolve() es como decir
  // "aquí está tu respuesta, ya puedes usarla".
  return new Promise((resolve) => {
    // setTimeout simula el tiempo real que tardaría un servidor en
    // responder por internet (aquí, medio segundo).
    setTimeout(() => {
      const existe = correosYaRegistrados.includes(correo.toLowerCase().trim());
      resolve(existe);
    }, 500);
  });
}
// --- FIN SIMULACIÓN ---

export function useRegistroForm() {
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [errores, setErrores] = useState<ErroresRegistro>({});

  // Nuevo: mientras esperamos la respuesta del "servidor", el botón
  // debe avisar al usuario que algo está pasando, en vez de quedarse
  // mudo por medio segundo (mala experiencia de usuario).
  const [enviando, setEnviando] = useState(false);

  function validarCamposObligatorios(datos: DatosRegistro): ErroresRegistro {
    const nuevosErrores: ErroresRegistro = {};

    if (datos.nombres.trim() === "") {
      nuevosErrores.nombres = "El nombre es obligatorio";
    }
    if (datos.apellidos.trim() === "") {
      nuevosErrores.apellidos = "El apellido es obligatorio";
    }
    if (datos.correo.trim() === "") {
      nuevosErrores.correo = "El correo es obligatorio";
    }
    if (datos.contrasena.length < 8) {
      nuevosErrores.contrasena = "La contraseña debe tener mínimo 8 caracteres";
    }

    return nuevosErrores;
  }

  // async marca esta función como "va a hacer esperas".
  // Antes era una función normal; ahora, como necesita preguntarle
  // algo al "servidor" (verificarCorreoExistente), tiene que poder pausarse.
  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();

    const datos: DatosRegistro = { nombres, apellidos, correo, contrasena };

    // Paso 1: validaciones que no necesitan preguntarle nada a nadie
    // (son instantáneas, no requieren await).
    const erroresDeCampos = validarCamposObligatorios(datos);

    if (Object.keys(erroresDeCampos).length > 0) {
      setErrores(erroresDeCampos);
      return; // Si ya hay errores obvios, ni siquiera molestamos al "servidor"
    }

    // Paso 2: ahora sí, la validación que requiere esperar una respuesta.
    setEnviando(true); // avisamos a la UI: "estamos verificando"

    // await PAUSA esta función hasta que la Promise se resuelva,
    // sin bloquear el resto de la página (el usuario puede seguir
    // interactuando con otras partes mientras tanto).
    const correoYaExiste = await verificarCorreoExistente(datos.correo);

    setEnviando(false); // la espera terminó, "server" respondió

    if (correoYaExiste) {
      setErrores({ correo: "Este correo ya está registrado" });
      return;
    }

    // Si llegamos aquí: todo pasó, ni campos vacíos ni correo duplicado
    setErrores({});
    console.log("Formulario válido, listo para enviar:", datos);
  }

  return {
    nombres,
    setNombres,
    apellidos,
    setApellidos,
    correo,
    setCorreo,
    contrasena,
    setContrasena,
    errores,
    enviando,
    handleSubmit,
  };
}