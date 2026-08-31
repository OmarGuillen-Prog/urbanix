// Simulacion de una tabla de base de datos para tokens de recuperacion
// de contraseña. Vive en memoria del navegador mientras no exista el
// backend real - se perderia si recargas la pagina (F5), a diferencia
// de una base de datos de verdad que persiste siempre.

interface TokenRecuperacion {
  token: string;
  correo: string;
  expiraEn: number; // timestamp: momento exacto en que deja de ser valido
}

const tokensActivos: TokenRecuperacion[] = [];

// Genera un token "aleatorio" simple y lo guarda con una expiracion
// de 15 minutos - practica estandar de seguridad: un link de
// recuperacion no deberia ser valido para siempre.
export function generarTokenRecuperacion(correo: string): string {
  const token = Math.random().toString(36).slice(2, 10);
  const quinceMinutosEnMs = 15 * 60 * 1000;

  tokensActivos.push({
    token,
    correo,
    expiraEn: Date.now() + quinceMinutosEnMs,
  });

  return token;
}

export function validarToken(token: string): boolean {
  const encontrado = tokensActivos.find((t) => t.token === token);
  if (!encontrado) return false;
  return Date.now() < encontrado.expiraEn;
}