import { useState, useCallback } from "react";

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  token?: string;
}

interface UseApiReturn {
  request: <T = any>(endpoint: string, options?: ApiOptions) => Promise<T>;
  loading: boolean;
  error: string | null;
}

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const useApi = (): UseApiReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(
    async <T = any>(endpoint: string, options: ApiOptions = {}): Promise<T> => {
      const { method = "GET", headers = {}, body, token } = options;

      setLoading(true);
      setError(null);

      try {
        const requestHeaders: Record<string, string> = {
          "Content-Type": "application/json",
          ...headers,
        };

        if (token) {
          requestHeaders.Authorization = `Bearer ${token}`;
        }

        const config: RequestInit = {
          method,
          headers: requestHeaders,
        };

        if (body && method !== "GET") {
          config.body = JSON.stringify(body);
        }

        const url = endpoint.startsWith("http")
          ? endpoint
          : `${BASE_URL}${endpoint}`;

        console.log("🔵 Requête API:", { url, method, body });

        const response = await fetch(url, config);

        console.log("🔵 Réponse API:", {
          status: response.status,
          ok: response.ok,
        });

        if (!response.ok) {
          let errorMessage = `Erreur ${response.status}: ${response.statusText}`;

          try {
            const errorData = await response.json();
            console.error("❌ Erreur serveur:", errorData);
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch {
            // Ignore JSON parsing errors
          }

          throw new Error(errorMessage);
        }

        const contentType = response.headers.get("content-type");
        let data: T;

        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
          console.log("✅ Data reçue:", data);
        } else {
          data = (await response.text()) as unknown as T;
        }

        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Une erreur inconnue est survenue";
        console.error("❌ Erreur hook useApi:", errorMessage);
        setError(errorMessage);
        throw err; // Important: on throw l'erreur originale, pas une nouvelle
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { request, loading, error };
};
