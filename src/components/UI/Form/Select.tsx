import { ErrorMessage } from 'formik';
import { useState, useEffect, useRef, type FC } from 'react'
import { useFieldError } from '@/hooks/useFieldError';

interface FormSelectOption {
    label: string;
    value: string;
}

interface FormSelectProps {
    id: string;
    error?: string | string[] | undefined;
    options: FormSelectOption[];
    placeholder?: string;
    className?: string;
    multiple?: boolean;
    searchable?: boolean;
    defaultValue?: string | string[];
    allowAdd?: boolean;
    disabled?: boolean;
    value?: string | string[];
    onChange?: (value: string | string[]) => void;
    useFormik?: boolean;
}

const FormSelect: FC<FormSelectProps> = ({
    id,
    error,
    options = [],
    placeholder = "Sélectionner...",
    className,
    multiple = false,
    searchable = true,
    defaultValue,
    allowAdd = false,
    disabled = false,
    value,
    onChange,
    useFormik = true,
}) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [internalValue, setInternalValue] = useState<string | string[]>(
        defaultValue ?? (multiple ? [] : "")
    );
    const [addedOptions] = useState<FormSelectOption[]>([]);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const { hasError, errorMessage } = useFieldError(id);

    const showError = error || hasError;
    const displayErrorMessage = typeof error === 'string' ? error : errorMessage;

    const fieldValue = value !== undefined ? value : internalValue;

    const allOptions = [...options, ...addedOptions];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const updateValue = (newValue: string | string[]) => {
        if (onChange) onChange(newValue);
        else setInternalValue(newValue);
    }

    const handleFormSelect = (value: string) => {
        if (multiple) {
            const current = Array.isArray(fieldValue) ? fieldValue : [];
            updateValue(
                current.includes(value) ? current.filter(v => v !== value) : [...current, value]
            )
        } else {
            updateValue(value);
            setOpen(false);
        }
    }

    const clearAll = () => {
        updateValue([]);
    }

    const isFormSelected = (value: string) => multiple ? Array.isArray(fieldValue) && fieldValue.includes(value) : fieldValue === value;

    const handleAddOption = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        const trimmed = query.trim();
        if (!trimmed) return;

        const exists = allOptions.some(option => option.value === trimmed);
        if (exists) return;

        updateValue(multiple ? [...(Array.isArray(fieldValue) ? fieldValue : []), trimmed] : trimmed);

        setQuery("");
        setOpen(false);
    }

    const getDisplayText = () => {
        if (multiple) {
            const FormSelected = allOptions.filter(option => Array.isArray(fieldValue) && fieldValue.includes(option.value));
            if (!FormSelected.length) return placeholder;
            if (FormSelected.length === 1) return FormSelected[0].label;
            return `${FormSelected.length} sélectionnés`;
        }

        return allOptions.find(option => option.value === fieldValue)?.label ?? placeholder;
    }

    const filteredOptions = allOptions.filter(option => option.label && option.label.toLowerCase().includes(query.toLowerCase()));

    const getButtonClasses = () => {
        if (disabled) {
            return "bg-white/5 text-gray-500 cursor-not-allowed border-white/5";
        }
        if (showError) {
            return "bg-red-500/5 text-white border-red-500 hover:border-red-500";
        }
        return "bg-black/10 text-white border-white/10 hover:border-white/30";
    };

    return (
        <div className='space-y-1'>
            <div className={`relative ${className}`} ref={dropdownRef}>
                <button
                    type='button'
                    id={id}
                    disabled={disabled}
                    className={`w-full flex justify-between items-center rounded-xl px-3 py-2 border transition-all ${getButtonClasses()}`}
                    onClick={() => setOpen(prev => !prev)}
                >
                    <span className={getDisplayText() === placeholder ? "text-neutral-400" : ""}>
                        {getDisplayText()}
                    </span>
                    <span className='ml-2 text-neutral-400'>▾</span>
                </button>

                {open && !disabled && (
                    <div className='absolute z-50 mt-1 w-full rounded-xl border border-white/10 bg-black shadow-lg max-h-72 overflow-hidden'>
                        {searchable && (
                            <div className='p-2 border-b border-white/10'>
                                <input
                                    autoFocus
                                    disabled={disabled}
                                    type="text"
                                    className='w-full bg-transparent text-white text-sm px-2 py-1 rounded outline-none border border-white/10 focus:border-white/40'
                                    placeholder='Rechercher...'
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                />
                                {allowAdd && query && filteredOptions.length === 0 && (
                                    <button
                                        type="button"
                                        onClick={handleAddOption}
                                        className="w-full px-3 py-2 text-left text-sm text-green hover:bg-white/10"
                                    >
                                        Ajouter « {query} » à la liste
                                    </button>
                                )}
                            </div>
                        )}

                        <ul className='max-h-60 overflow-y-auto text-sm'>
                            {filteredOptions.length === 0 && !allowAdd && (
                                <li className='px-3 py-2 text-neutral-400'>Aucun résultat</li>
                            )}
                            {filteredOptions.map(opt => (
                                <li
                                    key={opt.value}
                                    onClick={() => {
                                        if (disabled) return;
                                        handleFormSelect(opt.value);
                                    }}
                                    className={`px-3 py-2 flex items-center justify-between ${disabled ? "text-gray-500 cursor-not-allowed" : "cursor-pointer hover:bg-white/10 text-white"}
                                    ${isFormSelected(opt.value) ? "bg-white/5" : ""}`}
                                >
                                    <span>{opt.label}</span>
                                    {multiple && isFormSelected(opt.value) && <span className='text-green-400'>✓</span>}
                                </li>
                            ))}
                        </ul>

                        {multiple && !disabled && Array.isArray(fieldValue) && fieldValue.length > 0 && (
                            <div className='p-2 border-t border-white/10'>
                                <button
                                    type='button'
                                    onClick={clearAll}
                                    className='text-xs text-red-400 hover:text-red-300'
                                >
                                    Tout désélectionner
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <input
                    type="hidden"
                    value={Array.isArray(fieldValue) ? JSON.stringify(fieldValue) : fieldValue || ""}
                />
            </div>

            {!disabled && displayErrorMessage && (
                <p className='text-red-500 text-sm mt-1'>{displayErrorMessage}</p>
            )}
            {useFormik && id && !displayErrorMessage && (
                <ErrorMessage name={id} render={(errorMessage) => (
                    <p className='text-red-500 text-sm mt-1'> {errorMessage}</p>
                )} />
            )}
        </div >
    );
};

export default FormSelect;