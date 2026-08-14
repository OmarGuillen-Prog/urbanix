// Este componente representa la pantalla de Registro de Usuario (HU-01)
// De momento es solo la estructura visual - sin lógica aun

export default function RegistroPage() {
    return (
        // Contenedor principal: Ocupa toda la pantalla y centra su contenido
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
            {/* La tarjeta blanca que contiene el formulario */}
            <div className="w-full max-w-md rounted-xl bg-white p-8 shadow-md">
                <h1 className="mb-6 text-2x1 font-semibold text-zinc-900">
                    Crear Cuenta En URBANIX
                </h1>

                {/* El elemento <form> agrupa todos los campos de entrada */}
                <form className="flex flex-col gap-4">

                {/* Campo: Nombre */}
                <div>
                    <label htmlFor="nombres" className="mb-1 block text-sm font-medium text-zinc-700"> Nombres </label>
                    <input id="nombres" type="text" 
                        placeholder="Ej: Omar Daniel"
                        className="w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-900 focus:outline-none"/>
                </div>

                {/* Campo: Apellido */}
                <div>
                    <label htmlFor="apellidos" className="mb-1 block text-sm font-medium text-zinc-700"> Apellidos </label>
                    <input id="apellidos" type="text" 
                        placeholder="Ej: Guillen Roche"
                        className="w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-900 focus:outline-none"/>
                </div>

                {/* Campo: Correo Electrónico */}
                <div>
                    <label htmlFor="email" className="mb-1 block text-sm font-medium text-zinc-700"> Correo Electrónico </label>
                    <input id="email" type="email" 
                        placeholder="Ej: tucorreo@ejemplo.com"
                        className="w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-900 focus:outline-none"/>
                </div>

                {/* Campo: Contraseña */}
                <div>
                    <label htmlFor="password" className="mb-1 block text-sm font-medium text-zinc-700"> Contraseña </label>
                    <input id="password" type="password" 
                        placeholder="Mínimo 8 caracteres"
                        className="w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-900 focus:outline-none"/>
                </div>

                {/* Botón de Envío */}
                <button type="submit" className="mt-2 rounded-md bg-zinc-900 px-4 py-2 text-white transition-colors hover:bg-zinc-700">
                    Registrarme
                </button>
                </form>
            </div>
        </div>
    );
}