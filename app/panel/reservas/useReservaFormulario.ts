"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { obtenerUsuarios } from "@/lib/usuariosStore";
import {
  obtenerZonas,
  obtenerReservaPorId,
  crearReserva,
  actualizarReserva,
  hoyLocal,
} from "@/lib/reservasStore";

interface ErroresReserva {
  [campo: string]: string;
}

// Si recibe un reservaId, el formulario EDITA esa reserva; si no, CREA una nueva.
export function useReservaFormulario(reservaId?: string) {
  const router = useRouter();
  const { usuario } = useAuth();

  const zonas = obtenerZonas();
  const residentes = obtenerUsuarios().filter((u) => u.rol === "residente" && u.estado === "activo");
  const reservaOriginal = reservaId ? obtenerReservaPorId(reservaId) : undefined;
  const esEdicion = reservaId !== undefined;
  const esAdministrador = usuario?.rol === "administrador";

  const [idZona, setIdZona] = useState(reservaOriginal?.idZona ?? zonas[0]?.id ?? "");
  const [fecha, setFecha] = useState(reservaOriginal?.fecha ?? "");
  const [horaInicio, setHoraInicio] = useState(reservaOriginal?.horaInicio ?? "");
  const [horaFin, setHoraFin] = useState(reservaOriginal?.horaFin ?? "");
  const [invitados, setInvitados] = useState(reservaOriginal ? String(reservaOriginal.invitados) : "");
  // Solo se usa cuando un administrador crea una reserva "a nombre de" un residente
  const [correoResidente, setCorreoResidente] = useState(residentes[0]?.correo ?? "");
  const [errores, setErrores] = useState<ErroresReserva>({});
  const [guardando, setGuardando] = useState(false);

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();

    const cantidad = Number(invitados);
    const nuevosErrores: ErroresReserva = {};

    if (fecha === "") nuevosErrores.fecha = "La fecha es obligatoria";
    else if (fecha < hoyLocal()) nuevosErrores.fecha = "La fecha no puede ser anterior a hoy";
    if (horaInicio === "") nuevosErrores.horaInicio = "La hora de inicio es obligatoria";
    if (horaFin === "") nuevosErrores.horaFin = "La hora de fin es obligatoria";
    if (horaInicio && horaFin && horaFin <= horaInicio) {
      nuevosErrores.horaFin = "La hora de fin debe ser posterior a la de inicio";
    }
    if (invitados.trim() === "" || !Number.isInteger(cantidad) || cantidad < 1) {
      nuevosErrores.invitados = "Ingresa un número de invitados válido (mínimo 1)";
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    if (!usuario) return;

    setGuardando(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setGuardando(false);

    const datos = { idZona, fecha, horaInicio, horaFin, invitados: cantidad };

    const resultado =
      esEdicion && reservaId
        ? actualizarReserva(reservaId, datos)
        : crearReserva({
        /*                                    // DEScomentar esta linea para que TODO se confirme por medio del administrador (Se intercala con el de abajo)
            ...datos,
            correoResidente: esAdministrador ? correoResidente : usuario.correo,
            // Si quieres que TODO se confirme solo, cambia esta linea por: estado: "confirmada",
            estado: esAdministrador ? "confirmada" : "pendiente",
          });
        */
       ////////////////////// En app/panel/reservas/ReservaFormulario.tsx, el aviso para residentes debe cambiar al intercalar
          ////////////  Comentar esta linea para que TODO se confirme por medio del administrador (el store ya valida capacidad y choques de horario)
            ...datos,
            correoResidente: esAdministrador ? correoResidente : usuario.correo,
            // Se confirma sola: el store ya rechaza choques de horario y exceso
            // de capacidad, asi que si llega hasta aqui, hay disponibilidad.
            estado: "confirmada",
          });

    // El store aplica capacidad y choque de horario, y nos dice si fallo
    if (!resultado.exito) {
      setErrores({ general: resultado.mensaje ?? "No se pudo guardar la reserva" });
      return;
    }

    router.push("/panel/reservas");
  }

  return {
    esEdicion,
    esAdministrador,
    reservaExiste: reservaOriginal !== undefined,
    reservaCancelada: reservaOriginal?.estado === "cancelada",
    zonas,
    residentes,
    idZona, setIdZona,
    fecha, setFecha,
    horaInicio, setHoraInicio,
    horaFin, setHoraFin,
    invitados, setInvitados,
    correoResidente, setCorreoResidente,
    errores,
    guardando,
    handleSubmit,
  };
}