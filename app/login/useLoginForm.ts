"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, type UsuarioSesion } from "@/context/AuthContext";

interface ErroresLogin {
  [campo: string]: string;
}

// --- SIMULACION DE BACKEND ---
// Ahora cada usuario simulado incluye su rol, igual que lo tendria
// el JWT real que devolveria FastAPI al iniciar sesion.
const usuariosValidos: (UsuarioSesion & { contrasena: string })[] = [
  {
    correo: "omar@urbanix.com",
    contrasena: "12345678",
    nombres: "Omar",
    apellidos: "Guillén",
    rol: "administrador",
  },
  {
    correo: "juan@urbanix.com",
    contrasena: "12345678",
    nombres: "Juan Manuel",
    apellidos: "Ciro",
    rol: "residente",
  },
  {
    correo: "andres@urbanix.com",
    contrasena: "12345678",
    nombres: "Andrés",
    apellidos: "Vélez",
    rol: "portero",
  },
];

function verificarCredenciales(
  correo: string,
  contrasena: string
): Promise<UsuarioSesion | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const encontrado = usuariosValidos.find(
        (u) =>
          u.correo === correo.toLowerCase().trim() &&
          u.contrasena === contrasena
      );
      resolve(encontrado ?? null);
    }, 500);
  });
}
// --- FIN SIMULACION ---

export function useLoginForm() {
  const router = useRouter();
  const { iniciarSesion } = useAuth();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [errores, setErrores] = useState<ErroresLogin>({});
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();

    const nuevosErrores: ErroresLogin = {};
    if (correo.trim() === "") nuevosErrores.correo = "El correo es obligatorio";
    if (contrasena.trim() === "") nuevosErrores.contrasena = "La contraseña es obligatoria";

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setEnviando(true);
    const usuarioEncontrado = await verificarCredenciales(correo, contrasena);
    setEnviando(false);

    if (!usuarioEncontrado) {
      setErrores({ general: "Correo o contraseña incorrectos" });
      return;
    }

    setErrores({});
    // Guardamos la sesion en el contexto global (y en localStorage,
    // por dentro del Provider) ANTES de navegar al panel.
    iniciarSesion({
      nombres: usuarioEncontrado.nombres,
      apellidos: usuarioEncontrado.apellidos,
      correo: usuarioEncontrado.correo,
      rol: usuarioEncontrado.rol,
    });
    router.push("/panel");
  }

  return { correo, setCorreo, contrasena, setContrasena, errores, enviando, handleSubmit };
}