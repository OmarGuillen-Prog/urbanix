import type { Rol } from "@/context/AuthContext";

// Esta interfaz refleja la entidad "Usuario" del MER del documento
// (id_usuario, nombres, apellidos, correo, telefono, documento,
// estado, id_rol). No incluimos la contraseña aqui a proposito - un
// listado de usuarios nunca deberia mostrar ni manejar contraseñas.
export interface Usuario {
  id: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  documento: string;
  estado: "activo" | "inactivo";
  rol: Rol;
}

// Datos de ejemplo. Cuando exista el backend, esta lista se
// reemplaza por una llamada a la API (fetch), pero la interfaz
// Usuario de arriba se mantiene igual - por eso vale la pena
// definirla bien desde ahora.
export const usuariosSimulados: Usuario[] = [
  { id: "1", nombres: "Omar", apellidos: "Guillén", correo: "omar@urbanix.com", telefono: "3001234567", documento: "1020304050", estado: "activo", rol: "administrador" },
  { id: "2", nombres: "Juan Manuel", apellidos: "Ciro", correo: "juan@urbanix.com", telefono: "3007654321", documento: "1030405060", estado: "activo", rol: "residente" },
  { id: "3", nombres: "María", apellidos: "López", correo: "maria@urbanix.com", telefono: "3011122334", documento: "1040506070", estado: "activo", rol: "residente" },
  { id: "4", nombres: "Carlos", apellidos: "Restrepo", correo: "carlos@urbanix.com", telefono: "3022233445", documento: "1050607080", estado: "inactivo", rol: "residente" },
  { id: "5", nombres: "Andrés", apellidos: "Vélez", correo: "andres@urbanix.com", telefono: "3033344556", documento: "1060708090", estado: "activo", rol: "portero" },
  { id: "6", nombres: "Laura", apellidos: "Gómez", correo: "laura@urbanix.com", telefono: "3044455667", documento: "1070809010", estado: "activo", rol: "residente" },
];