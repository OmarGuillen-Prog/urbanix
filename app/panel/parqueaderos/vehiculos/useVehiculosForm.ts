"use client";

import { useState } from "react";
import { crearVehiculo, existePlaca, obtenerVehiculos, type Vehiculo } from "@/lib/vehiculosStore";
import { obtenerUsuarios } from "@/lib/usuariosStore";
import { obtenerParqueaderos } from "@/lib/parqueaderosStore";

interface ErroresVehiculo {
  [campo: string]: string;
}

export function useVehiculosForm() {
  const usuarios = obtenerUsuarios();
  // Solo ofrecemos, en el select, los parqueaderos que SI estan
  // libres (Parqueadero(1)--(1)Vehiculo del MER: uno no puede tener
  // dos vehiculos). Evitamos el error en vez de solo detectarlo despues.
  const parqueaderosDisponibles = obtenerParqueaderos().filter((p) => {
    const yaTieneVehiculo = obtenerVehiculos().some((v) => v.idParqueadero === p.id);
    return !yaTieneVehiculo;
  });

  const [vehiculos, setVehiculos] = useState<Vehiculo[]>(() => obtenerVehiculos());
  const [placa, setPlaca] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [color, setColor] = useState("");
  const [tipoVehiculo, setTipoVehiculo] = useState<"carro" | "moto">("carro");
  const [correoPropietario, setCorreoPropietario] = useState(usuarios[0]?.correo ?? "");
  const [idParqueadero, setIdParqueadero] = useState("");
  const [errores, setErrores] = useState<ErroresVehiculo>({});
  const [guardando, setGuardando] = useState(false);

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();

    const nuevosErrores: ErroresVehiculo = {};
    if (placa.trim() === "") nuevosErrores.placa = "La placa es obligatoria";
    else if (existePlaca(placa)) nuevosErrores.placa = "Ya existe un vehículo con esta placa";
    if (marca.trim() === "") nuevosErrores.marca = "La marca es obligatoria";

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setGuardando(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setGuardando(false);

    crearVehiculo({
      placa,
      marca,
      modelo,
      color,
      tipoVehiculo,
      correoPropietario,
      idParqueadero: idParqueadero === "" ? null : idParqueadero,
    });

    setVehiculos(obtenerVehiculos());
    setPlaca("");
    setMarca("");
    setModelo("");
    setColor("");
    setIdParqueadero("");
    setErrores({});
  }

  return {
    usuarios,
    parqueaderosDisponibles,
    vehiculos,
    placa, setPlaca,
    marca, setMarca,
    modelo, setModelo,
    color, setColor,
    tipoVehiculo, setTipoVehiculo,
    correoPropietario, setCorreoPropietario,
    idParqueadero, setIdParqueadero,
    errores,
    guardando,
    handleSubmit,
  };
}