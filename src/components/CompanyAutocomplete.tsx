import { type FC, useState, useRef, useEffect } from 'react';
import { useCompanySearch } from '@/hooks/useCompanySearch';

interface CompanyAutocompleteProps {
    onSelect: (company: {
        name: string;
        siren: string;
        siret: string;
        vat_number: string;
        address: string;
    }) => void;
    initialValue?: string;
}

const CompanyAutocomplete: FC<CompanyAutocompleteProps> = ({ onSelect, initialValue = '' }) => {
    const { query, setQuery, results, isLoading } = useCompanySearch();
    const [showResults, setShowResults] = useState(false);
    const [inputValue, setInputValue] = useState(initialValue);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const calculateVATNumber = (siren: string): string => {
        const sirenNum = parseInt(siren, 10);
        const key = (12 + 3 * (sirenNum % 97)) % 97;
        return `FR${key.toString().padStart(2, '0')}${siren}`;
    };

    const handleInputChange = (value: string) => {
        setInputValue(value);
        setQuery(value);
        setShowResults(true);
    };

    const handleSelect = (company: any) => {
        const vatNumber = calculateVATNumber(company.siren);
        const selectedCompany = {
            name: company.nom_complet || company.nom_raison_sociale,
            siren: company.siren,
            siret: company.siege?.siret || '',
            vat_number: vatNumber,
            address: company.siege?.adresse || '',
        };

        setInputValue(selectedCompany.name);
        setShowResults(false);
        onSelect(selectedCompany);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={wrapperRef} className="relative">
            <div className="relative">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onFocus={() => query && setShowResults(true)}
                    placeholder="Rechercher une entreprise..."
                    className="w-full bg-black/40 border border-emerald-900/30 rounded-xl px-4 py-3 text-white pr-10"
                />
                {isLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </div>

            {showResults && results.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-black/95 backdrop-blur-sm border border-emerald-900/30 rounded-xl shadow-xl max-h-80 overflow-y-auto">
                    {results.map((company) => (
                        <button
                            key={company.siren}
                            onClick={() => handleSelect(company)}
                            className="w-full text-left px-4 py-3 hover:bg-emerald-900/20 transition-colors border-b border-emerald-900/10 last:border-b-0"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium truncate">
                                        {company.nom_complet || company.nom_raison_sociale}
                                    </p>
                                    {company.siege && (
                                        <p className="text-neutral-400 text-sm mt-1">
                                            {company.siege.adresse}, {company.siege.code_postal} {company.siege.commune}
                                        </p>
                                    )}
                                    <div className="flex gap-3 mt-2">
                                        <span className="text-emerald-400 text-xs">
                                            SIREN: {company.siren}
                                        </span>
                                        {company.siege?.siret && (
                                            <span className="text-emerald-400 text-xs">
                                                SIRET: {company.siege.siret}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <span className="text-xs text-neutral-500 shrink-0">
                                    {company.activite_principale}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {showResults && query && !isLoading && results.length === 0 && (
                <div className="absolute z-50 w-full mt-2 bg-black/95 backdrop-blur-sm border border-emerald-900/30 rounded-xl p-4">
                    <p className="text-neutral-400 text-sm text-center">
                        Aucune entreprise trouvée
                    </p>
                </div>
            )}
        </div>
    );
};

export default CompanyAutocomplete;