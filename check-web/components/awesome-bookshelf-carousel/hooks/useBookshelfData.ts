import { useCallback, useEffect, useRef, useState } from "react";
import type { BookCard } from "../types";

type UseBookshelfDataOptions = {
  data?: BookCard[];
  apiEndpoint?: string;
  apiHeaders?: Record<string, string>;
  apiTransform?: (raw: unknown) => BookCard[];
};

export function useBookshelfData({
  data,
  apiEndpoint,
  apiHeaders,
  apiTransform,
}: UseBookshelfDataOptions) {
  const [books, setBooks] = useState<BookCard[]>(data ?? []);
  const [loading, setLoading] = useState(!data && !!apiEndpoint);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const refetch = useCallback(async () => {
    if (!apiEndpoint) return;

    const currentRequestId = ++requestId.current;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(apiEndpoint, {
        headers: { "Content-Type": "application/json", ...apiHeaders },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const raw: unknown = await response.json();
      if (currentRequestId !== requestId.current) return;

      const nextBooks: BookCard[] = apiTransform
        ? apiTransform(raw)
        : Array.isArray(raw)
          ? (raw as BookCard[])
          : (raw as { data: BookCard[] }).data;
      setBooks(nextBooks);
    } catch (requestError) {
      if (currentRequestId !== requestId.current) return;
      setError(
        requestError instanceof Error ? requestError.message : "Failed to load",
      );
    } finally {
      if (currentRequestId === requestId.current) setLoading(false);
    }
  }, [apiEndpoint]);

  useEffect(() => {
    if (data) {
      setBooks(data);
      return;
    }

    refetch();
  }, [data, refetch]);

  return { books, loading, error, refetch };
}