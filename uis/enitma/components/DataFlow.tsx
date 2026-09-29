/**
 * DataFlow — representa un flujo de pasos (DATA → INTELLIGENCE → … → ACTION)
 * como una fila de "pills" conectadas. Reutilizable en varias secciones.
 */
export default function DataFlow({
  steps,
  label
}: {
  steps: string[];
  label?: string;
}) {
  return (
    <div>
      {label ? <p className="eyebrow">{label}</p> : null}
      <ol className="flex flex-wrap items-center gap-2">
        {steps.map((step, i) => (
          <li key={step} className="flex items-center gap-2">
            <span className="flow-step">{step}</span>
            {i < steps.length - 1 ? (
              <span aria-hidden="true" className="text-signal-400">→</span>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
