"use client";

import { useParams } from "next/navigation";
import { ComunicadoFormulario } from "../ComunicadoFormulario";

export default function EditarComunicadoPage() {
  const params = useParams<{ id: string }>();
  return <ComunicadoFormulario comunicadoId={params.id} />;
}