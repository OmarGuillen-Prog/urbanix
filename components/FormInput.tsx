// Campo de formulario reutilizable: label + input + mensaje de error,
// ya estilizado con los tokens de diseño de URBANIX. Cualquier
// formulario del proyecto (registro, login, PQRS, reservas...) lo usa.

interface FormInputProps {
  id: string;
  label: string;
  type?: string; // el "?" indica que es opcional
  placeholder?: string;
  value: string;
  onChange: (valor: string) => void;
  error?: string;
}

export function FormInput({
  id,
  label,
  type = "text", // valor por defecto si no se especifica
  placeholder,
  value,
  onChange,
  error,
}: FormInputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(evento) => onChange(evento.target.value)}
        className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink placeholder:text-ink/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
      />
      {error && <p className="mt-1.5 text-sm text-error">{error}</p>}
    </div>
  );
}