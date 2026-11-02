"use client";

import { useAuth } from "@/context/AuthContext";
import { obtenerUsuarioPorCorreo } from "@/lib/usuariosStore";
import { obtenerPreferencias } from "@/lib/configuracionStore";
import { obtenerNotificacionesDeUsuario } from "@/lib/notificacionesStore";

export function usePrivacidad() {
  const { usuario } = useAuth();

  // Ley 1581 de 2012: derecho de acceso. La persona puede descargar los datos que la plataforma guarda de ella.
  function handleDescargarDatos() {
    if (!usuario) return;

    const registro = obtenerUsuarioPorCorreo(usuario.correo);
    const datos = {
      generadoEl: new Date().toISOString(),
      perfil: {
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        telefono: registro?.telefono ?? "",
        documento: registro?.documento ?? "",
        rol: usuario.rol,
      },
      preferencias: obtenerPreferencias(usuario.correo),
      notificaciones: obtenerNotificacionesDeUsuario(usuario.correo).map((n) => ({
        titulo: n.titulo,
        mensaje: n.mensaje,
        fecha: n.fecha,
        leida: n.leida,
      })),
    };

    // Un archivo "virtual" en memoria que el navegador descarga como si viniera de un servidor
    const archivo = new Blob([JSON.stringify(datos, null, 2)], { type: "application/json" });
    const direccion = URL.createObjectURL(archivo);
    const enlace = document.createElement("a");
    enlace.href = direccion;
    enlace.download = "mis-datos-urbanix.json";
    enlace.click();
    URL.revokeObjectURL(direccion);
  }

  return { handleDescargarDatos };
}