// Ayudantes para imagenes que sube una persona (comprobantes, evidencias...)

export const TAMANO_MAXIMO_MB = 2;
const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp"];

// Devuelve un mensaje de error, o null si la imagen es valida
export function validarImagen(archivo: File): string | null {
  if (!TIPOS_PERMITIDOS.includes(archivo.type)) return "Solo se permiten imágenes JPG, PNG o WEBP.";
  if (archivo.size > TAMANO_MAXIMO_MB * 1024 * 1024) return `La imagen no puede pesar más de ${TAMANO_MAXIMO_MB} MB.`;
  return null;
}

// Convierte la imagen en un texto ("data URL") que se puede guardar y mostrar en un <img>
export function leerComoDataUrl(archivo: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onload = () => resolve(String(lector.result));
    lector.onerror = () => reject(new Error("No se pudo leer la imagen."));
    lector.readAsDataURL(archivo);
  });
}