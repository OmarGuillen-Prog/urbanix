"use client";

import { usePrivacidad } from "./usePrivacidad";

export function SeccionPrivacidad() {
  const { handleDescargarDatos } = usePrivacidad();

  return (
    <section className="rounded-xl border border-line bg-white p-6">
      <h2 className="font-display text-lg font-semibold text-ink">Privacidad y datos personales</h2>

      <p className="mt-3 max-w-2xl text-sm text-ink/70">
        URBANIX guarda tus nombres, documento, correo y teléfono, y los datos de tu propiedad, únicamente para gestionar la
        convivencia del conjunto. Su tratamiento se rige por la Ley 1581 de 2012 de protección de datos personales: tienes
        derecho a conocer, actualizar y solicitar la corrección de tu información.
      </p>

      <ul className="mt-4 flex max-w-2xl list-disc flex-col gap-1.5 pl-5 text-sm text-ink/70">
        <li>Tus datos solo los ve la administración y el personal autorizado de tu conjunto.</li>
        <li>Puedes corregir tu nombre y teléfono en la sección Perfil.</li>
        <li>Para cambiar tu correo o eliminar tu cuenta, comunícate con la administración.</li>
      </ul>

      <div className="mt-6 border-t border-line pt-5">
        <p className="font-medium text-ink">Descargar mis datos</p>
        <p className="mt-1 text-sm text-ink/60">
          Obtén un archivo con tu perfil, tus preferencias y tus notificaciones.
        </p>
        <button
          onClick={handleDescargarDatos}
          className="mt-3 rounded-lg border border-line px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-brand hover:text-brand"
        >
          ⬇ Descargar mis datos
        </button>
      </div>
    </section>
  );
}