"use client";

import { useParams } from "next/navigation";
import { VehiculoFormulario } from "../VehiculoFormulario";

export default function EditarVehiculoPage() {
  const params = useParams<{ id: string }>();
  return <VehiculoFormulario vehiculoId={params.id} />;
}