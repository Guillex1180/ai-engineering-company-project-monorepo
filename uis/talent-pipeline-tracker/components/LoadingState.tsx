export default function LoadingState({
  message = "Cargando..."
}: {
  message?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-6 text-slate-600"
    >
      <span
        aria-hidden="true"
        className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-brand-600"
      />
      <span>{message}</span>
    </div>
  );
}
