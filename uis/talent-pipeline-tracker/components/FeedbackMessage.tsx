export type FeedbackKind = "success" | "error";

const STYLES: Record<FeedbackKind, string> = {
  success: "border-green-200 bg-green-50 text-green-800",
  error: "border-red-200 bg-red-50 text-red-800"
};

/**
 * Mensaje de feedback dinámico. Usa aria-live para que los lectores de pantalla
 * anuncien el resultado de una operación (éxito o error).
 */
export default function FeedbackMessage({
  kind,
  message
}: {
  kind: FeedbackKind;
  message: string;
}) {
  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      aria-live={kind === "error" ? "assertive" : "polite"}
      className={`rounded-lg border px-4 py-3 text-sm font-medium ${STYLES[kind]}`}
    >
      {message}
    </div>
  );
}
