// Dibuja N estrellas llenas de 5. Se usa en las tarjetas y en los comentarios.
export function Estrellas({ calificacion }: { calificacion: number }) {
  return (
    // role="img" + aria-label: un lector de pantalla dice "4 de 5 estrellas"
    // en vez de leer cinco simbolos sueltos.
    <div className="flex gap-0.5 text-gold" role="img" aria-label={`${calificacion} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((valor) => (
        <span key={valor} aria-hidden="true">
          {valor <= calificacion ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}