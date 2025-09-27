// Archivo: hooks/useApi.ts

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

// Este hook manejará el estado de carga, los datos y los errores de una llamada a la API.
export function useApi<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Usamos el método get de nuestro apiClient centralizado
      const result = await apiClient.get<T>(endpoint);
      setData(result);
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      toast.error(`Failed to fetch data: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Devolvemos los datos y una función para recargar
  return { data, isLoading, error, refetch: fetchData };
}