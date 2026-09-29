/**
 * Encabezado de página reutilizable (sección 30 del design system).
 * Propósito claro: eyebrow opcional + título grande + descripción breve.
 */
export default function PageHeader({
  eyebrow,
  title,
  description
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="container-enitma pt-16 lg:pt-20">
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h1 className="t-h1 max-w-4xl">{title}</h1>
      {description ? <p className="mt-4 t-body-lg prose-width">{description}</p> : null}
    </div>
  );
}
