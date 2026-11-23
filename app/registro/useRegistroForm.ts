"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ApiError, erroresDeFormulario } from "@/lib/api";
import { iniciarSesionApi, registrarCuentaApi } from "@/lib/authApi";

export function useRegistroForm() {
  const router = useRouter();
  const { iniciarSesion } = useAuth();

  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [documento, setDocumento] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [aceptoPolitica, setAceptoPolitica] = useState(false);
  const [errores, setErrores] = useState<{ [campo: string]: string }>({});
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();

    const nuevosErrores: { [campo: string]: string } = {};

    if (nombres.trim() === "") nuevosErrores.nombres = "El nombre es obligatorio";
    if (apellidos.trim() === "") nuevosErrores.apellidos = "El apellido es obligatorio";
    if (correo.trim() === "") nuevosErrores.correo = "El correo es obligatorio";
    if (telefono.trim() === "") nuevosErrores.telefono = "El teléfono es obligatorio";
    if (documento.trim().length < 5 || documento.trim().length > 20) {
      nuevosErrores.documento = "El documento debe tener entre 5 y 20 caracteres";
    }
    if (contrasena.length < 8) {
      nuevosErrores.contrasena = "La contraseña debe tener mínimo 8 caracteres";
    }
    if (confirmarContrasena !== contrasena) {
      nuevosErrores.confirmarContrasena = "Las contraseñas no coinciden";
    }
    if (!aceptoPolitica) {
      nuevosErrores.aceptoPolitica = "Debes aceptar la política de tratamiento de datos";
    }

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setEnviando(true);
    try {
      // 1) Crear la cuenta (HU-01, criterio 1)
      await registrarCuentaApi({ nombres, apellidos, correo, telefono, documento, contrasena, aceptoPolitica });

      // 2) Iniciar sesión con esos mismos datos para que entre directo al panel
      const { token, sesion } = await iniciarSesionApi(correo, contrasena);
      setErrores({});
      iniciarSesion(sesion, token);
      router.push("/panel");
    } catch (error) {
      if (!(error instanceof ApiError)) {
        setErrores({ general: "Ocurrió un error inesperado" });
      } else if (error.errores.length > 0) {
        // 422: el backend marca el campo con problema
        setErrores(
          erroresDeFormulario(error, { password: "contrasena", acepto_politica_datos: "aceptoPolitica" }),
        );
      } else if (error.status === 409) {
        // HU-01, criterio 3: duplicado. El mensaje dice "El correo..." o "El documento..."
        const campo = error.message.toLowerCase().includes("documento") ? "documento" : "correo";
        setErrores({ [campo]: error.message });
      } else {
        setErrores({ general: error.message });
      }
    } finally {
      setEnviando(false);
    }
  }

  return {
    nombres, setNombres,
    apellidos, setApellidos,
    correo, setCorreo,
    telefono, setTelefono,
    documento, setDocumento,
    contrasena, setContrasena,
    confirmarContrasena, setConfirmarContrasena,
    aceptoPolitica, setAceptoPolitica,
    errores,
    enviando,
    handleSubmit,
  };
}