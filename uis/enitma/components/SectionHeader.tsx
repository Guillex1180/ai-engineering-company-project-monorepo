/**
 * Encabezado de sección reutilizable (design system, sección 30).
 */
export default function SectionHeader({
  eyebrow,
  title,
  description
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2 className="t-h2">{title}</h2>
      {description ? <p className="mt-3 t-small prose-width">{description}</p> : null}
    </div>
  );
}
