// RNF-05: cerrar sesiones inactivas. Esta parte es solo el "cronometro": no sabe nada de React.

export interface TemporizadorInactividad {
  reiniciar: () => void; // "hubo actividad": vuelve a empezar la cuenta
  detener: () => void;
}

// obtenerMinutos se consulta en CADA reinicio: si la persona cambia el limite en Configuracion,
// el cambio se aplica en cuanto vuelva a tocar algo.
export function crearTemporizadorInactividad(
  obtenerMinutos: () => number,
  alExpirar: () => void
): TemporizadorInactividad {
  let temporizador: ReturnType<typeof setTimeout> | undefined;

  function detener() {
    if (temporizador !== undefined) clearTimeout(temporizador);
    temporizador = undefined;
  }

  function reiniciar() {
    detener();
    temporizador = setTimeout(alExpirar, obtenerMinutos() * 60 * 1000);
  }

  reiniciar();
  return { reiniciar, detener };
}