"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  obtenerParqueaderos,
  estadoDeParqueadero,
  detalleDeParqueadero,
  liberarParqueadero,
  reservarParqueadero,
  quitarReservaParqueadero,
  type Parqueadero,
  type TipoParqueadero,
  type EstadoParqueadero,
} from "@/lib/parqueaderosStore";
import { desvincularParqueadero } from "@/lib/vehiculosStore";

const TAMANO_PAGINA = 8;

export function useParqueaderosLista() {
  const { usuario } = useAuth();
  const esAdministrador = usuario?.rol === "administrador";

  const [parqueaderos, setParqueaderos] = useState<Parqueadero[]>(() => obtenerParqueaderos());

  const [busqueda, setBusqueda] = useState("");
  const [filtroNivel, setFiltroNivel] = useState<string>("todos"); // "todos" o "1", "2"...
  const [filtroTipo, setFiltroTipo] = useState<TipoParqueadero | "todos">("todos");
  const [filtroEstado, setFiltroEstado] = useState<EstadoParqueadero | "todos">("todos");
  const [pagina, setPagina] = useState(1);

  // Cada cambio de filtro vuelve a la pagina 1 aqui, en el manejador
  function cambiarBusqueda(valor: string) { setBusqueda(valor); setPagina(1); }
  function cambiarNivel(valor: string) { setFiltroNivel(valor); setPagina(1); }
  function cambiarTipo(valor: TipoParqueadero | "todos") { setFiltroTipo(valor); setPagina(1); }
  function cambiarEstado(valor: EstadoParqueadero | "todos") { setFiltroEstado(valor); setPagina(1); }

  // Los niveles salen de los DATOS (Set elimina repetidos): si manana existe el Nivel 4, aparece solo
  const niveles = [...new Set(parqueaderos.map((p) => p.nivel))].sort((a, b) => a - b);

  const filtrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return parqueaderos.filter((p) => {
      const detalle = detalleDeParqueadero(p);
      const coincideTexto =
        termino === "" ||
        p.numero.toLowerCase().includes(termino) ||
        detalle.unidad.toLowerCase().includes(termino) ||
        detalle.propietario.toLowerCase().includes(termino) ||
        detalle.placa.toLowerCase().includes(termino);
      const coincideNivel = filtroNivel === "todos" || String(p.nivel) === filtroNivel;
      const coincideTipo = filtroTipo === "todos" || p.tipo === filtroTipo;
      const coincideEstado = filtroEstado === "todos" || estadoDeParqueadero(p) === filtroEstado;
      return coincideTexto && coincideNivel && coincideTipo && coincideEstado;
    });
  }, [parqueaderos, busqueda, filtroNivel, filtroTipo, filtroEstado]);

  // --- Paginacion ---
  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / TAMANO_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const inicio = (paginaActual - 1) * TAMANO_PAGINA;
  const visibles = filtrados.slice(inicio, inicio + TAMANO_PAGINA);

  // --- Metricas generales (sobre TODOS los espacios) ---
  const totalEspacios = parqueaderos.length;
  const ocupados = parqueaderos.filter((p) => estadoDeParqueadero(p) === "ocupado").length;
  const disponibles = parqueaderos.filter((p) => estadoDeParqueadero(p) === "disponible").length;
  const reservados = parqueaderos.filter((p) => estadoDeParqueadero(p) === "reservado").length;

  // --- Resumen por nivel ---
  const resumenNiveles = niveles.map((nivel) => {
    const delNivel = parqueaderos.filter((p) => p.nivel === nivel);
    const ocupadosNivel = delNivel.filter((p) => estadoDeParqueadero(p) === "ocupado").length;
    const disponiblesNivel = delNivel.filter((p) => estadoDeParqueadero(p) === "disponible").length;
    const reservadosNivel = delNivel.filter((p) => estadoDeParqueadero(p) === "reservado").length;

    return {
      nivel,
      total: delNivel.length,
      ocupados: ocupadosNivel,
      disponibles: disponiblesNivel,
      reservados: reservadosNivel,
      porcentaje: delNivel.length === 0 ? 0 : Math.round((ocupadosNivel / delNivel.length) * 100),
    };
  });

  function refrescar() {
    setParqueaderos(obtenerParqueaderos());
  }

  function handleLiberar(p: Parqueadero) {
    const confirmado = window.confirm(
      `¿Liberar el espacio ${p.numero}? Si tenía un vehículo asociado, quedará sin parqueadero.`
    );
    if (!confirmado) return;

    liberarParqueadero(p.id);
    desvincularParqueadero(p.id); // integridad: el vehiculo no puede apuntar a un espacio libre
    refrescar();
  }

  function handleReservar(id: string) {
    reservarParqueadero(id);
    refrescar();
  }

  function handleQuitarReserva(id: string) {
    quitarReservaParqueadero(id);
    refrescar();
  }

  return {
    esAdministrador,
    niveles,
    visibles,
    totalFiltrados: filtrados.length,
    paginaActual,
    totalPaginas,
    setPagina,
    busqueda, cambiarBusqueda,
    filtroNivel, cambiarNivel,
    filtroTipo, cambiarTipo,
    filtroEstado, cambiarEstado,
    totalEspacios, ocupados, disponibles, reservados,
    resumenNiveles,
    handleLiberar,
    handleReservar,
    handleQuitarReserva,
  };
}