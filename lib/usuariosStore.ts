import type { Rol } from "@/context/AuthContext";

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

// "let" en vez de "const": este arreglo SI cambia con el tiempo,
// a diferencia de los stores anteriores que eran fijos.
let usuarios: Usuario[] = [
  { id: "1", nombres: "Omar", apellidos: "Guillén", correo: "omar@urbanix.com", telefono: "3001234567", documento: "1020304050", estado: "activo", rol: "administrador" },
  { id: "2", nombres: "Juan Manuel", apellidos: "Ciro", correo: "juan@urbanix.com", telefono: "3007654321", documento: "1030405060", estado: "activo", rol: "residente" },
  { id: "3", nombres: "María", apellidos: "López", correo: "maria@urbanix.com", telefono: "3011122334", documento: "1040506070", estado: "activo", rol: "residente" },
  { id: "4", nombres: "Carlos", apellidos: "Restrepo", correo: "carlos@urbanix.com", telefono: "3022233445", documento: "1050607080", estado: "inactivo", rol: "residente" },
  { id: "5", nombres: "Andrés", apellidos: "Vélez", correo: "andres@urbanix.com", telefono: "3033344556", documento: "1060708090", estado: "activo", rol: "portero" },
  { id: "6", nombres: "Laura", apellidos: "Gómez", correo: "laura@urbanix.com", telefono: "3044455667", documento: "1070809010", estado: "activo", rol: "residente" },
];

// Estas 4 funciones son la UNICA forma en que el resto de la app
// puede tocar los datos. Nadie importa el arreglo "usuarios"
// directamente - eso hace mas facil, el dia de mañana, reemplazar
// estas funciones por llamadas reales a la API sin tocar quien las usa.

export function obtenerUsuarios(): Usuario[] {
  return usuarios;
}

export function obtenerUsuarioPorId(id: string): Usuario | undefined {
  return usuarios.find((u) => u.id === id);
}

export function actualizarUsuario(id: string, cambios: Partial<Usuario>): void {
  // Partial<Usuario> significa "un objeto con algunas (o todas) las
  // propiedades de Usuario, pero ninguna es obligatoria" - util
  // porque quiza solo cambies el rol, sin tocar el resto de campos.
  usuarios = usuarios.map((u) => (u.id === id ? { ...u, ...cambios } : u));
}

export function eliminarUsuario(id: string): void {
  usuarios = usuarios.filter((u) => u.id !== id);
}