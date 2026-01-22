import { useState, useEffect } from "react";
import { debounce } from "lodash";

interface Company {
  siren: string;
  nom_complet: string;
  nom_raison_sociale: string;
  siege: {
    siret: string;
    code_postal: string;
    commune: string;
    adresse: string;
  };
  activite_principale: string;
  tranche_effectif_salarie?: string;
}

interface CompanySearchResult {
  results: Company[];
  total_results: number;
}

export const useCompanySearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCompanies = async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://recherche-entreprises.api.gouv.fr/search?q=${encodeURIComponent(searchQuery)}&per_page=10`,
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la recherche");
      }

      const data: CompanySearchResult = await response.json();
      setResults(data.results || []);
    } catch (err) {
      console.error("Erreur recherche entreprise:", err);
      setError("Impossible de rechercher les entreprises");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debouncedSearch = debounce(() => {
      searchCompanies(query);
    }, 300);

    debouncedSearch();

    return () => {
      debouncedSearch.cancel();
    };
  }, [query]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
  };
};
