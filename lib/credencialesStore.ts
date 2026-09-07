import type { UsuarioSesion } from "@/context/AuthContext";

interface Credencial extends UsuarioSesion {
  contrasena: string;
}

// Este arreglo reemplaza al que antes vivia dentro de
// useLoginForm.ts - ahora es la UNICA fuente de verdad para
// autenticacion, usada tanto por el login como por el cambio de
// contraseña.
let credenciales: Credencial[] = [
  { correo: "omar@urbanix.com", contrasena: "12345678", nombres: "Omar", apellidos: "Guillén", rol: "administrador" },
  { correo: "juan@urbanix.com", contrasena: "12345678", nombres: "Juan Manuel", apellidos: "Ciro", rol: "residente" },
  { correo: "andres@urbanix.com", contrasena: "12345678", nombres: "Andrés", apellidos: "Vélez", rol: "portero" },
];

export function verificarCredenciales(correo: string, contrasena: string): Promise<UsuarioSesion | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const encontrado = credenciales.find(
        (c) => c.correo === correo.toLowerCase().trim() && c.contrasena === contrasena
      );
      if (!encontrado) {
        resolve(null);
        return;
      }
      // Destructuring para "quitar" la contraseña antes de devolver
      // los datos de sesion - nunca deberia viajar mas alla de aqui.
      const { contrasena: _sinUsar, ...sesion } = encontrado;
      resolve(sesion);
    }, 500);
  });
}

export function cambiarContrasena(
  correo: string,
  actual: string,
  nueva: string
): { exito: boolean; mensaje?: string } {
  const credencial = credenciales.find((c) => c.correo === correo);

  if (!credencial) {
    return { exito: false, mensaje: "Usuario no encontrado" };
  }
  if (credencial.contrasena !== actual) {
    return { exito: false, mensaje: "La contraseña actual es incorrecta" };
  }

  credenciales = credenciales.map((c) => (c.correo === correo ? { ...c, contrasena: nueva } : c));
  return { exito: true };
}