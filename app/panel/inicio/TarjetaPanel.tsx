import Link from "next/link";
import type { ReactNode } from "react";

interface TarjetaPanelProps {
  titulo: string;
  enlace?: { href: string; texto: string }; // "Ver todo"
  derecha?: ReactNode; // algo a la derecha del titulo (por ejemplo, un indicador)
  children: ReactNode;
}

// El marco de cada bloque del panel: titulo a la izquierda, "Ver todo" o un indicador a la derecha
export function TarjetaPanel({ titulo, enlace, derecha, children }: TarjetaPanelProps) {
  return (
    <section className="rounded-xl border border-line bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-lg font-semibold text-ink">{titulo}</h2>
        {derecha}
        {enlace && (
          <Link href={enlace.href} className="text-sm font-medium text-brand hover:text-brand-dark">
            {enlace.texto}
          </Link>
        )}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}