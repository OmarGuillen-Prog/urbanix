import { Suspense } from "react";
import { RestablecerView } from "./RestablecerView";

// Next.js exige que cualquier componente que use useSearchParams este
// envuelto en <Suspense> cuando la pagina podria pre-renderizarse en
// el servidor. El "fallback" es lo que se ve brevemente mientras React
// determina los parametros de la URL - en la practica, casi ni se nota.
export default function RestablecerPage() {
  return (
    <Suspense fallback={null}>
      <RestablecerView />
    </Suspense>
  );
}