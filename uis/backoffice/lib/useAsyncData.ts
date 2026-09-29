"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Fases de una carga asíncrona con datos que pueden estar vacíos.
 */
export type AsyncPhase = "loading" | "success" | "empty" | "error";

export interface AsyncState<T> {
  phase: AsyncPhase;
  data: T | null;
  error: string;
  reload: () => void;
}

/**
 * Hook reutilizable para cargar datos asíncronos con estados
 * loading / success / empty / error. Centraliza el patrón que estaba duplicado
 * en varios componentes del backoffice (p. ej. ProductsView, OrdersView).
 *
 * @param fetcher     función async que devuelve los datos.
 * @param isEmpty     opcional: decide si el resultado cuenta como "empty".
 * @param mapError    opcional: traduce un error a mensaje legible.
 */
export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  options?: {
    isEmpty?: (data: T) => boolean;
    mapError?: (error: unknown) => string;
  }
): AsyncState<T> {
  const [phase, setPhase] = useState<AsyncPhase>("loading");
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string>("");

  const isEmpty = options?.isEmpty;
  const mapError = options?.mapError;

  const load = useCallback(async () => {
    setPhase("loading");
    setError("");
    try {
      const result = await fetcher();
      setData(result);
      setPhase(isEmpty && isEmpty(result) ? "empty" : "success");
    } catch (err) {
      setError(mapError ? mapError(err) : "No fue posible cargar los datos.");
      setPhase("error");
    }
    // fetcher/isEmpty/mapError se asumen estables (useCallback en el consumidor).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher]);

  useEffect(() => {
    void load();
  }, [load]);

  return { phase, data, error, reload: () => void load() };
}
