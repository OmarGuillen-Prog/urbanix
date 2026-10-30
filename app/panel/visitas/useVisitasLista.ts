"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  obtenerTodasLasVisitas,
  obtenerVisitasPorResidente,
  registrarEntrada,
  registrarSalida,
  codigoVisita,
  type Visita,
  type TipoVisita,
  type EstadoVisita,
} from "@/lib/visitasStore";
import { unidadDeUsuario, nombrePorCorreo } from "@/lib/personasHelpers";
import { hoyLocal } from "@/lib/fechas";

const TAMANO_PAGINA = 6;

export function useVisitasLista() {
  const { usuario } = useAuth();
  const esResidente = usuario?.rol === "residente";
  const esPortero = usuario?.rol === "portero";
  const esAdministrador = usuario?.rol === "administrador";

  // El residente ve solo las suyas; portero y administrador ven todas
  function cargarVisitas(): Visita[] {
    if (!usuario) return [];
    return esResidente ? obtenerVisitasPorResidente(usuario.correo) : obtenerTodasLasVisitas();
  }

  const [visitas, setVisitas] = useState<Visita[]>(() => cargarVisitas());

  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<TipoVisita | "todos">("todos");
  const [filtroEstado, setFiltroEstado] = useState<EstadoVisita | "todos">("todos");
  const [filtroFecha, setFiltroFecha] = useState<"todas" | "hoy">("todas");
  const [pagina, setPagina] = useState(1);

  // Cada cambio de filtro vuelve a la pagina 1 en el manejador (no en un useEffect)
  function cambiarBusqueda(valor: string) { setBusqueda(valor); setPagina(1); }
  function cambiarTipo(valor: TipoVisita | "todos") { setFiltroTipo(valor); setPagina(1); }
  function cambiarEstado(valor: EstadoVisita | "todos") { setFiltroEstado(valor); setPagina(1); }
  function cambiarFecha(valor: "todas" | "hoy") { setFiltroFecha(valor); setPagina(1); }

  const filtradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    const hoy = hoyLocal();

    return visitas.filter((v) => {
      const coincideTexto =
        termino === "" ||
        codigoVisita(v.id).toLowerCase().includes(termino) ||
        v.nombreVisitante.toLowerCase().includes(termino) ||
        v.documentoVisitante.toLowerCase().includes(termino) ||
        unidadDeUsuario(v.correoResidente).toLowerCase().includes(termino);
      const coincideTipo = filtroTipo === "todos" || v.tipo === filtroTipo;
      const coincideEstado = filtroEstado === "todos" || v.estado === filtroEstado;
      const coincideFecha = filtroFecha === "todas" || v.fechaVisita === hoy;
      return coincideTexto && coincideTipo && coincideEstado && coincideFecha;
    });
  }, [visitas, busqueda, filtroTipo, filtroEstado, filtroFecha]);

  // --- Paginacion (la misma receta de PQRS) ---
  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / TAMANO_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const inicio = (paginaActual - 1) * TAMANO_PAGINA;
  const visibles = filtradas.slice(inicio, inicio + TAMANO_PAGINA);

  // --- Metricas: SOLO las visitas de hoy, sobre lo que este rol puede ver ---
  const deHoy = visitas.filter((v) => v.fechaVisita === hoyLocal());
  const visitasHoy = deHoy.length;
  const ingresaron = deHoy.filter((v) => v.estado === "en_conjunto").length;
  const esperados = deHoy.filter((v) => v.estado === "pendiente").length;
  const completados = deHoy.filter((v) => v.estado === "finalizada").length;

  // Simulacion de HU-31: si una visita del residente ya esta dentro, se lo avisamos
  const visitaQueLlego = esResidente ? visitas.find((v) => v.estado === "en_conjunto") : undefined;

  function handleRegistrarEntrada(id: string) {
    if (!usuario) return;
    registrarEntrada(id, usuario.correo);
    setVisitas(cargarVisitas());
  }

  function handleRegistrarSalida(id: string) {
    registrarSalida(id);
    setVisitas(cargarVisitas());
  }

  return {
    esPortero,
    esAdministrador,
    esResidente,
    visibles,
    totalFiltradas: filtradas.length,
    paginaActual,
    totalPaginas,
    setPagina,
    busqueda, cambiarBusqueda,
    filtroTipo, cambiarTipo,
    filtroEstado, cambiarEstado,
    filtroFecha, cambiarFecha,
    visitasHoy,
    ingresaron,
    esperados,
    completados,
    visitaQueLlego,
    handleRegistrarEntrada,
    handleRegistrarSalida,
  };
}