import { redirect } from "next/navigation";

// La raiz del sitio ("/") no tiene pantalla propia: manda a la persona al panel.
// Si ya tiene sesion, el panel la deja pasar; si no, el panel la lleva al login.
export default function Inicio() {
  redirect("/panel");
}