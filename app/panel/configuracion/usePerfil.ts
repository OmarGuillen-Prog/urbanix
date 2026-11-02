"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { obtenerUsuarioPorCorreo, actualizarUsuario } from "@/lib/usuariosStore";
import { actualizarNombresCredencial } from "@/lib/credencialesStore";
import { validarImagen, leerComoDataUrl } from "@/lib/imagenes";

interface ErroresPerfil {
  [campo: string]: string;
}

export function usePerfil() {
  const { usuario, iniciarSesion } = useAuth();
  const registro = usuario ? obtenerUsuarioPorCorreo(usuario.correo) : undefined;

  const [nombres, setNombres] = useState(usuario?.nombres ?? "");
  const [apellidos, setApellidos] = useState(usuario?.apellidos ?? "");
  const [telefono, setTelefono] = useState(registro?.telefono ?? "");
  const [foto, setFoto] = useState<string | null>(registro?.foto ?? null);
  const [errores, setErrores] = useState<ErroresPerfil>({});
  const [errorFoto, setErrorFoto] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);

  // La foto se previsualiza al elegirla, pero solo se guarda al pulsar "Guardar cambios"
  async function handleElegirFoto(archivo: File) {
    const error = validarImagen(archivo);
    if (error) {
      setErrorFoto(error);
      return;
    }

    try {
      setFoto(await leerComoDataUrl(archivo));
      setErrorFoto(null);
      setGuardado(false);
    } catch {
      setErrorFoto("No se pudo leer la imagen. Intenta con otra.");
    }
  }

  function handleQuitarFoto() {
    setFoto(null);
    setErrorFoto(null);
    setGuardado(false);
  }

  // "Cancelar" devuelve todo a como esta guardado
  function handleCancelar() {
    setNombres(usuario?.nombres ?? "");
    setApellidos(usuario?.apellidos ?? "");
    setTelefono(registro?.telefono ?? "");
    setFoto(registro?.foto ?? null);
    setErrores({});
    setErrorFoto(null);
    setGuardado(false);
  }

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();
    setGuardado(false);

    const nuevosErrores: ErroresPerfil = {};
    if (nombres.trim() === "") nuevosErrores.nombres = "El nombre es obligatorio";
    if (apellidos.trim() === "") nuevosErrores.apellidos = "El apellido es obligatorio";
    // El telefono es opcional, pero si lo escribe debe tener al menos 7 digitos
    if (telefono.trim() !== "" && telefono.replace(/\D/g, "").length < 7) {
      nuevosErrores.telefono = "Ingresa un teléfono válido (mínimo 7 dígitos)";
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    if (!usuario || !registro) return;

    setGuardando(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setGuardando(false);

    const nombresLimpios = nombres.trim();
    const apellidosLimpios = apellidos.trim();

    // 1) La ficha del usuario (lo que ve el administrador en Usuarios)
    actualizarUsuario(registro.id, {
      nombres: nombresLimpios,
      apellidos: apellidosLimpios,
      telefono: telefono.trim(),
      foto: foto ?? undefined,
    });
    // 2) Los datos con los que se inicia sesion la proxima vez
    actualizarNombresCredencial(usuario.correo, nombresLimpios, apellidosLimpios);
    // 3) La sesion actual: el nombre del Topbar se actualiza al instante
    iniciarSesion({ ...usuario, nombres: nombresLimpios, apellidos: apellidosLimpios });

    setErrores({});
    setGuardado(true);
  }

  return {
    usuario,
    correo: usuario?.correo ?? "",
    nombres, setNombres,
    apellidos, setApellidos,
    telefono, setTelefono,
    foto,
    errores,
    errorFoto,
    guardando,
    guardado,
    handleElegirFoto,
    handleQuitarFoto,
    handleCancelar,
    handleSubmit,
  };
}