"use client";

/**
 * Módulo Facturas — experiencia de carga (Fase 1 UX premium).
 *
 * Flujo: seleccionar PDF → validar → previsualizar localmente → revisar →
 * subir de forma segura → confirmación.
 *
 * Estados: empty · selected/ready · validating · uploading · success · error.
 *
 * Principios UX:
 *  - Lenguaje humano, sin jerga técnica (nada de bucket/S3/presigned URL/403).
 *  - Feedback claro en cada paso (badges, progreso, toast).
 *  - Preview 100% local (Object URL); el frontend nunca ve credenciales AWS.
 *
 * Preparado sin implementar (sección 22): el panel "Datos de la factura" queda
 * deshabilitado hasta que exista extracción (Textract). No se muestran datos
 * ficticios.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { InvoicesApiError, uploadInvoice, type PresignMode } from "@/lib/invoices";

type Status = "empty" | "ready" | "validating" | "uploading" | "success" | "error";

interface SelectedFile {
  file: File;
  previewUrl: string;
}

const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB (mensaje de la drop zone)

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isPdf(file: File): boolean {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

export default function InvoicesView() {
  const [status, setStatus] = useState<Status>("empty");
  const [selected, setSelected] = useState<SelectedFile | null>(null);
  const [error, setError] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [dragActive, setDragActive] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [storedMode, setStoredMode] = useState<PresignMode | null>(null);
  const [toast, setToast] = useState<{ kind: "success" | "error" | "info"; text: string } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const revokePreview = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  }, []);

  useEffect(() => revokePreview, [revokePreview]);
  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const showToast = useCallback((kind: "success" | "error" | "info", text: string) => {
    setToast({ kind, text });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  }, []);

  const acceptFile = useCallback(
    (file: File) => {
      setError("");
      setProgress(0);
      setStoredMode(null);
      setStatus("validating");

      if (!isPdf(file)) {
        setError("Ese archivo no es un PDF. Selecciona una factura en formato PDF.");
        setStatus("error");
        showToast("error", "El archivo debe ser un PDF.");
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        setError("La factura es demasiado grande. El tamaño máximo es 50 MB.");
        setStatus("error");
        showToast("error", "El archivo supera los 50 MB.");
        return;
      }

      revokePreview();
      const previewUrl = URL.createObjectURL(file);
      previewUrlRef.current = previewUrl;
      setSelected({ file, previewUrl });
      setZoom(100);
      setStatus("ready");
    },
    [revokePreview, showToast]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) acceptFile(file);
    e.target.value = "";
  };

  const openPicker = () => inputRef.current?.click();

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) acceptFile(file);
  };

  const removeSelection = () => {
    revokePreview();
    setSelected(null);
    setError("");
    setProgress(0);
    setStoredMode(null);
    setStatus("empty");
  };

  const upload = async () => {
    if (!selected) return;
    setStatus("uploading");
    setError("");
    setProgress(0);
    try {
      const result = await uploadInvoice(selected.file, (p) => setProgress(p));
      setStoredMode(result.mode);
      setStatus("success");
      showToast("success", "Factura cargada correctamente.");
    } catch (err) {
      // Mensaje amigable: el detalle técnico queda solo en el log del error.
      if (err instanceof InvoicesApiError) console.error("Invoice upload failed", err.status);
      setError("No pudimos cargar tu factura. Revisa tu conexión e inténtalo nuevamente.");
      setStatus("error");
      showToast("error", "No pudimos completar la operación.");
    }
  };

  const openInNewTab = () => {
    if (selected) window.open(selected.previewUrl, "_blank", "noopener,noreferrer");
  };

  const hasFile = Boolean(selected);
  const statusBadge = (() => {
    switch (status) {
      case "uploading":
        return <span className="badge bg-brand-100 text-brand-800">Subiendo…</span>;
      case "success":
        return <span className="badge bg-green-100 text-green-800">Almacenada</span>;
      case "error":
        return <span className="badge bg-red-100 text-red-800">Error</span>;
      default:
        return <span className="badge bg-slate-100 text-slate-700">Listo para cargar</span>;
    }
  })();

  return (
    <>
      {/* Toast global */}
      {toast ? (
        <div
          role="status"
          aria-live="polite"
          className={
            "fixed bottom-5 right-5 z-50 rounded-xl px-4 py-3 text-sm font-medium shadow-lg " +
            (toast.kind === "success"
              ? "bg-green-600 text-white"
              : toast.kind === "error"
                ? "bg-red-600 text-white"
                : "bg-slate-800 text-white")
          }
        >
          {toast.kind === "success" ? "✓ " : toast.kind === "error" ? "! " : ""}
          {toast.text}
        </div>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        onChange={onInputChange}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* Layout 35% controles / 65% visor */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,35%)_minmax(0,65%)]">
        {/* -------------------- Columna izquierda -------------------- */}
        <div className="order-1 space-y-4">
          {/* Éxito ocupa la tarjeta principal */}
          {status === "success" && selected ? (
            <div className="card border-green-200">
              <div className="success-pop flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl text-green-700">
                ✓
              </div>
              <h2 className="mt-3 text-lg font-bold text-slate-900">Factura cargada</h2>
              <p className="mt-1 text-sm text-slate-600">Tu documento se almacenó correctamente.</p>
              <dl className="mt-4 space-y-1 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Archivo</dt>
                  <dd className="max-w-[60%] truncate font-medium text-slate-900" title={selected.file.name}>{selected.file.name}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Tamaño</dt>
                  <dd className="font-medium text-slate-900">{formatSize(selected.file.size)}</dd>
                </div>
              </dl>
              {storedMode === "simulated" ? (
                <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  Modo demostración: el almacenamiento seguro aún no está configurado en este
                  entorno.
                </p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" className="btn-primary" onClick={removeSelection}>Subir otra factura</button>
                <button type="button" className="btn-secondary" onClick={openInNewTab}>Ver documento</button>
              </div>
            </div>
          ) : (
            <div className="card">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Cargar factura</h2>

              {/* Drop zone grande y amigable */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={onDrop}
                className={
                  "mt-3 flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-10 text-center transition-colors " +
                  (dragActive ? "border-brand-500 bg-brand-50" : "border-slate-300 bg-slate-50")
                }
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow-sm" aria-hidden="true">📄</span>
                <p className="mt-3 text-base font-semibold text-slate-800">Arrastra tu factura aquí</p>
                <p className="text-sm text-slate-500">o selecciona un archivo desde tu computadora</p>
                <button type="button" className="btn-primary mt-4" onClick={openPicker}>Seleccionar PDF</button>
                <p className="mt-3 text-xs text-slate-400">PDF · Hasta 50 MB</p>
              </div>

              {status === "validating" ? (
                <p role="status" className="mt-3 text-sm text-slate-500">Validando documento…</p>
              ) : null}

              {/* Información del archivo */}
              {selected ? (
                <dl className="mt-4 space-y-2 rounded-lg border border-slate-200 bg-white p-4 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Archivo</dt>
                    <dd className="max-w-[60%] truncate font-medium text-slate-900" title={selected.file.name}>{selected.file.name}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Tamaño</dt>
                    <dd className="font-medium text-slate-900">{formatSize(selected.file.size)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-slate-500">Estado</dt>
                    <dd>{statusBadge}</dd>
                  </div>
                </dl>
              ) : null}

              {/* Progreso */}
              {status === "uploading" ? (
                <div className="mt-4" aria-live="polite">
                  <p className="mb-1 text-sm text-slate-600">Subiendo… {progress}%</p>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              ) : null}

              {/* Acciones (ready) */}
              {status === "ready" ? (
                <div className="mt-4 space-y-2">
                  <button type="button" className="btn-primary w-full" onClick={upload}>Subir factura</button>
                  <div className="flex gap-2">
                    <button type="button" className="btn-secondary flex-1" onClick={openPicker}>Cambiar archivo</button>
                    <button type="button" className="btn-danger-ghost flex-1" onClick={removeSelection}>Eliminar</button>
                  </div>
                </div>
              ) : null}

              {/* Error amigable */}
              {status === "error" ? (
                <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                  <p className="font-semibold">! No pudimos cargar la factura</p>
                  {error ? <p className="mt-1">{error}</p> : null}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selected ? (
                      <button type="button" className="btn-primary" onClick={upload}>Reintentar</button>
                    ) : null}
                    <button type="button" className="btn-secondary" onClick={openPicker}>Cambiar archivo</button>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* Datos de la factura — FUTURO (deshabilitado, sección 22) */}
          <div className="card opacity-60" aria-hidden="true">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Datos de la factura</h2>
              <span className="badge bg-slate-100 text-slate-500">Próximamente</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-400">
              {["Proveedor", "Factura", "Fecha", "Subtotal", "Impuestos", "Total", "Moneda", "Estado"].map((f) => (
                <div key={f} className="rounded-md border border-dashed border-slate-200 px-2 py-1.5">{f}</div>
              ))}
            </div>
          </div>
        </div>

        {/* -------------------- Columna derecha: visor -------------------- */}
        <div className="order-2">
          <div className="card flex h-full flex-col">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Vista previa</h2>
              {hasFile ? (
                <div className="flex items-center gap-1">
                  <button type="button" aria-label="Reducir zoom" className="btn-secondary h-8 w-8 !px-0" onClick={() => setZoom((z) => Math.max(50, z - 10))} disabled={zoom <= 50}>−</button>
                  <span className="w-12 text-center text-xs tabular-nums text-slate-600">{zoom}%</span>
                  <button type="button" aria-label="Aumentar zoom" className="btn-secondary h-8 w-8 !px-0" onClick={() => setZoom((z) => Math.min(200, z + 10))} disabled={zoom >= 200}>+</button>
                  <button type="button" className="btn-secondary ml-1 h-8 px-3 text-xs" onClick={openInNewTab}>Pantalla completa</button>
                </div>
              ) : null}
            </div>

            <div className="mt-3 flex-1 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
              {hasFile && selected ? (
                <iframe
                  key={selected.previewUrl}
                  src={`${selected.previewUrl}#zoom=${zoom}`}
                  title={`Vista previa de ${selected.file.name}`}
                  className="h-full w-full min-h-[460px] border-0 bg-white lg:min-h-[620px]"
                />
              ) : (
                <div className="flex min-h-[460px] flex-col items-center justify-center px-6 text-center lg:min-h-[620px]">
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm" aria-hidden="true">📄</span>
                  <p className="mt-4 text-base font-semibold text-slate-700">Aún no has seleccionado una factura</p>
                  <p className="mt-1 max-w-xs text-sm text-slate-500">Selecciona un PDF para visualizarlo antes de cargarlo.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
