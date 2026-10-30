"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { obtenerUsuarios } from "@/lib/usuariosStore";
import {
  obtenerVehiculoPorId,
  crearVehiculo,
  actualizarVehiculo,
  existePlaca,
  type TipoVehiculo,
} from "@/lib/vehiculosStore";
import { espaciosParaVehiculo } from "@/lib/parqueaderosStore";

interface ErroresVehiculo {
  [campo: string]: string;
}

// Si recibe un vehiculoId, EDITA ese vehiculo; si no, CREA uno nuevo.
export function useVehiculoFormulario(vehiculoId?: string) {
  const router = useRouter();
  const { usuario } = useAuth();

  const esEdicion = vehiculoId !== undefined;
  const original = vehiculoId ? obtenerVehiculoPorId(vehiculoId) : undefined;
  const usuarios = obtenerUsuarios();

  const [placa, setPlaca] = useState(original?.placa ?? "");
  const [marca, setMarca] = useState(original?.marca ?? "");
  const [modelo, setModelo] = useState(original?.modelo ?? "");
  const [color, setColor] = useState(original?.color ?? "");
  const [tipoVehiculo, setTipoVehiculo] = useState<TipoVehiculo>(original?.tipoVehiculo ?? "carro");
  const [correoPropietario, setCorreoPropietario] = useState(original?.correoPropietario ?? usuarios[0]?.correo ?? "");
  const [idParqueadero, setIdParqueadero] = useState(original?.idParqueadero ?? "");
  const [errores, setErrores] = useState<ErroresVehiculo>({});
  const [guardando, setGuardando] = useState(false);

  // SELECT DEPENDIENTE: las opciones salen del propietario y del tipo elegidos.
  // Se calculan en cada render (sin useEffect) porque son un simple calculo.
  const espacios = espaciosParaVehiculo(correoPropietario, tipoVehiculo, vehiculoId);

  // Si cambia el propietario o el tipo, el espacio elegido ya no tiene por que
  // ser valido: lo limpiamos AQUI, en el manejador (no en un efecto).
  function cambiarTipo(valor: TipoVehiculo) {
    setTipoVehiculo(valor);
    setIdParqueadero("");
  }
  function cambiarPropietario(valor: string) {
    setCorreoPropietario(valor);
    setIdParqueadero("");
  }

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();

    const nuevosErrores: ErroresVehiculo = {};
    if (placa.trim() === "") nuevosErrores.placa = "La placa es obligatoria";
    else if (existePlaca(placa, vehiculoId)) nuevosErrores.placa = "Ya existe un vehículo con esta placa";
    if (marca.trim() === "") nuevosErrores.marca = "La marca es obligatoria";
    if (idParqueadero !== "" && !espacios.some((e) => e.id === idParqueadero)) {
      nuevosErrores.idParqueadero = "El espacio seleccionado ya no está disponible para este vehículo";
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setGuardando(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setGuardando(false);

    const datos = {
      placa,
      marca,
      modelo,
      color,
      tipoVehiculo,
      correoPropietario,
      idParqueadero: idParqueadero === "" ? null : idParqueadero,
    };

    if (esEdicion && vehiculoId) {
      actualizarVehiculo(vehiculoId, datos);
    } else {
      crearVehiculo(datos);
    }

    router.push("/panel/parqueaderos/vehiculos");
  }

  return {
    esAdministrador: usuario?.rol === "administrador",
    esEdicion,
    vehiculoExiste: original !== undefined,
    usuarios,
    espacios,
    placa, setPlaca,
    marca, setMarca,
    modelo, setModelo,
    color, setColor,
    tipoVehiculo, cambiarTipo,
    correoPropietario, cambiarPropietario,
    idParqueadero, setIdParqueadero,
    errores,
    guardando,
    handleSubmit,
  };
}