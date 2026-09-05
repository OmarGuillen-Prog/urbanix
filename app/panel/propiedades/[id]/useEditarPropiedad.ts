"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  obtenerPropiedadPorId,
  actualizarPropiedad,
  type Propiedad,
} from "@/lib/propiedadesStore";

interface ErroresPropiedad {
  [campo: string]: string;
}

export function useEditarPropiedad(id: string) {
  const router = useRouter();

  const propiedadOriginal = obtenerPropiedadPorId(id);

  const [numero, setNumero] = useState(propiedadOriginal?.numero ?? "");
  const [torre, setTorre] = useState(propiedadOriginal?.torre ?? "");
  const [tipo, setTipo] = useState<Propiedad["tipo"]>(propiedadOriginal?.tipo ?? "apartamento");
  const [area, setArea] = useState(String(propiedadOriginal?.area ?? ""));
  const [estadoOcupacion, setEstadoOcupacion] = useState<Propiedad["estadoOcupacion"]>(
    propiedadOriginal?.estadoOcupacion ?? "vacio"
  );
  // "" representa "Sin asignar" en el <select> - HTML no tiene un
  // concepto nativo de "null" en un option, asi que usamos un string
  // vacio como convencion, y lo traducimos de vuelta a null al guardar.
  const [idPropietario, setIdPropietario] = useState(propiedadOriginal?.idPropietario ?? "");
  const [idArrendatario, setIdArrendatario] = useState(propiedadOriginal?.idArrendatario ?? "");

  const [errores, setErrores] = useState<ErroresPropiedad>({});
  const [guardando, setGuardando] = useState(false);

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();

    const nuevosErrores: ErroresPropiedad = {};
    if (numero.trim() === "") nuevosErrores.numero = "El número es obligatorio";
    if (torre.trim() === "") nuevosErrores.torre = "La torre/bloque es obligatoria";
    if (area.trim() === "" || Number(area) <= 0) {
      nuevosErrores.area = "Ingresa un área válida (mayor a 0)";
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setGuardando(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setGuardando(false);

    actualizarPropiedad(id, {
      numero,
      torre,
      tipo,
      area: Number(area),
      estadoOcupacion,
      idPropietario: idPropietario === "" ? null : idPropietario,
      idArrendatario: idArrendatario === "" ? null : idArrendatario,
    });

    router.push("/panel/propiedades");
  }

  return {
    propiedadExiste: propiedadOriginal !== undefined,
    numero, setNumero,
    torre, setTorre,
    tipo, setTipo,
    area, setArea,
    estadoOcupacion, setEstadoOcupacion,
    idPropietario, setIdPropietario,
    idArrendatario, setIdArrendatario,
    errores,
    guardando,
    handleSubmit,
  };
}