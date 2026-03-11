import { ErrorMessage, Field, useFormikContext } from 'formik';
import { useState, useRef, type FC } from 'react'
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useFieldError } from '@/hooks/useFieldError';
import Alert from '../Alert';

interface InputProps {
    type: 'text' | 'password' | 'email' | 'checkbox' | 'textarea' | 'number' | 'tel' | 'date' | 'time';
    name: string;
    id?: string;
    error?: string | undefined;
    placeholder?: string;
    label?: string;
    rows?: number;
    resize?: boolean;
    disabled?: boolean;
    value?: string | number;
    checked?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    useFormik?: boolean;
    className?: string;
    maxLength?: number;
}

interface DateInputProps {
    name: string;
    id: string;
    placeholder?: string;
    disabled?: boolean;
    className: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    useFormik?: boolean;
}

const DateInput: FC<DateInputProps> = ({
    name,
    id,
    placeholder = 'JJ/MM/AAAA',
    disabled,
    className,
    value,
    onChange,
    useFormik = true,
}) => {
    const formik = useFormik ? useFormikContext<Record<string, string>>() : null;

    const toDisplay = (internal: string): string => {
        if (!internal) return '';
        if (/^\d{4}-\d{2}-\d{2}$/.test(internal)) {
            const [y, m, d] = internal.split('-');
            return `${d}/${m}/${y}`;
        }
        return internal;
    };

    const toInternal = (display: string): string => {
        const cleaned = display.replace(/\D/g, '');
        if (cleaned.length === 8) {
            return `${cleaned.slice(4)}-${cleaned.slice(2, 4)}-${cleaned.slice(0, 2)}`;
        }
        return '';
    };

    const initialInternal = useFormik
        ? (formik?.values?.[name] ?? '')
        : (typeof value === 'string' ? value : '');

    const [displayValue, setDisplayValue] = useState<string>(toDisplay(initialInternal));
    const prevLengthRef = useRef<number>(displayValue.length);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const digits = raw.replace(/\D/g, '').slice(0, 8);
        const len = digits.length;

        let formatted = digits;
        if (len > 4) {
            formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
        } else if (len > 2) {
            formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
        }

        prevLengthRef.current = formatted.length;
        setDisplayValue(formatted);

        const internalValue = toInternal(formatted);

        if (useFormik && formik) {
            formik.setFieldValue(name, internalValue || formatted);
        } else if (onChange) {
            const syntheticEvent = {
                ...e,
                target: { ...e.target, name, value: internalValue || formatted },
            } as React.ChangeEvent<HTMLInputElement>;
            onChange(syntheticEvent);
        }
    };

    return (
        <input
            type="text"
            inputMode="numeric"
            id={id}
            name={name}
            disabled={disabled}
            placeholder={placeholder}
            value={displayValue}
            onChange={handleChange}
            className={className}
            maxLength={10}
            autoComplete="off"
        />
    );
};

const Input: FC<InputProps> = ({
    type,
    name,
    id,
    placeholder,
    error,
    label,
    rows = 4,
    resize = true,
    disabled,
    value,
    checked,
    onChange,
    useFormik = true,
    className = '',
    maxLength,
}) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const { hasError, errorMessage } = useFieldError(name);

    const showError = error || hasError;
    const displayErrorMessage = error || errorMessage;

    const handleTogglePassword = () => {
        if (disabled) return;
        setShowPassword(!showPassword);
    }

    const baseClasses =
        "duration-200 outline-none border rounded-xl px-4 py-3 bg-[#050a08]/80 placeholder:text-neutral-500 font-medium";

    const disabledClasses =
        "bg-emerald-900/5 text-neutral-600 border-emerald-900/10 cursor-not-allowed";

    const getErrorClasses = () => {
        if (showError) {
            return "border-red-500 focus-within:border-red-400 bg-red-900/10";
        }
        return "border-emerald-900/30 focus-within:border-emerald-500";
    };

    const classNames = `${baseClasses} ${getErrorClasses()} ${className}`;
    const inputId = id || name;

    if (useFormik) {
        return (
            <>
                {type === "textarea" ? (
                    <Field
                        as="textarea"
                        rows={rows}
                        disabled={disabled}
                        className={`
                           min-h-28 w-full
                           ${classNames}
                           ${resize ? "resize-y" : "resize-none"}
                           ${disabled ? disabledClasses : "text-white"}
                       `}
                        id={inputId}
                        name={name}
                        placeholder={placeholder}
                        {...(onChange ? { onChange } : {})}
                    />
                ) : type === "checkbox" ? (
                    <div className="flex items-center gap-3">
                        <Field
                            type="checkbox"
                            id={inputId}
                            name={name}
                            disabled={disabled}
                            checked={checked}
                            onChange={onChange}
                            className={`
                                accent-emerald-600 rounded border-2
                                ${disabled
                                    ? "border-emerald-900/10 bg-emerald-900/5 cursor-not-allowed"
                                    : "border-emerald-900/30 bg-[#050a08]/80 cursor-pointer hover:border-emerald-500"
                                }
                            `}
                        />
                        {label && (
                            <label
                                htmlFor={inputId}
                                className={`
                                    select-none font-medium
                                    ${disabled ? "text-neutral-600 cursor-not-allowed" : "text-white cursor-pointer"}
                                `}
                            >
                                {label}
                            </label>
                        )}
                    </div>
                ) : type === "password" ? (
                    <div
                        className={`
                            group flex
                            ${classNames}
                            ${disabled ? disabledClasses : "text-white"}
                        `}
                    >
                        <Field
                            disabled={disabled}
                            className="outline-none w-full bg-transparent"
                            type={showPassword ? "text" : type}
                            id={inputId}
                            name={name}
                            placeholder={placeholder}
                            {...(onChange ? { onChange } : {})}
                        />
                        <button
                            type="button"
                            disabled={disabled}
                            className={`
                                text-neutral-400
                                ${disabled ? "cursor-not-allowed text-neutral-600" : "group-focus-within:text-emerald-400"}
                            `}
                            onClick={handleTogglePassword}
                        >
                            {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                        </button>
                    </div>
                ) : type === "date" ? (
                    <DateInput
                        name={name}
                        id={inputId}
                        placeholder={placeholder}
                        disabled={disabled}
                        className={`w-full ${classNames} ${disabled ? disabledClasses : "text-white"}`}
                        useFormik={true}
                    />
                ) : (
                    <Field
                        min={type === 'number' ? 0 : undefined}
                        disabled={disabled}
                        className={`
                            w-full
                            ${classNames}
                            ${disabled ? disabledClasses : "text-white"}
                        `}
                        type={type}
                        id={inputId}
                        name={name}
                        placeholder={placeholder}
                        maxLength={maxLength}
                        {...(onChange ? { onChange } : {})}
                    />
                )}
                {!disabled && displayErrorMessage && (
                    <Alert message={displayErrorMessage} type='error' />
                )}
                {!disabled && !displayErrorMessage && (
                    <ErrorMessage name={name} render={(errorMessage) => (
                        <Alert message={errorMessage} type='error' />
                    )} />
                )}
            </>
        );
    }

    return (
        <>
            {type === "textarea" ? (
                <textarea
                    rows={rows}
                    disabled={disabled}
                    className={`min-h-28 w-full ${classNames} ${resize ? "resize-y" : "resize-none"} ${disabled ? disabledClasses : "text-white"}`}
                    id={inputId}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
            ) : type === "checkbox" ? (
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id={inputId}
                        name={name}
                        disabled={disabled}
                        checked={checked !== undefined ? checked : !!value}
                        onChange={onChange}
                        className={`accent-emerald-600 rounded border-2 ${disabled ? "border-emerald-900/10 bg-emerald-900/5 cursor-not-allowed" : "border-emerald-900/30 bg-[#050a08]/80 cursor-pointer hover:border-emerald-500"}`}
                    />
                    {label && (
                        <label htmlFor={inputId} className={`select-none font-medium ${disabled ? "text-neutral-600 cursor-not-allowed" : "text-white cursor-pointer"}`}>
                            {label}
                        </label>
                    )}
                </div>
            ) : type === "password" ? (
                <div className={`group flex ${classNames} ${disabled ? disabledClasses : "text-white"}`}>
                    <input
                        disabled={disabled}
                        className="outline-none w-full bg-transparent"
                        type={showPassword ? "text" : type}
                        id={inputId}
                        name={name}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                    />
                    <button
                        type="button"
                        disabled={disabled}
                        className={`text-neutral-400 ${disabled ? "cursor-not-allowed text-neutral-600" : "group-focus-within:text-emerald-400"}`}
                        onClick={handleTogglePassword}
                    >
                        {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                    </button>
                </div>
            ) : type === "date" ? (
                <DateInput
                    name={name}
                    id={inputId}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`w-full ${classNames} ${disabled ? disabledClasses : "text-white"}`}
                    value={typeof value === 'string' ? value : ''}
                    onChange={onChange as ((e: React.ChangeEvent<HTMLInputElement>) => void) | undefined}
                    useFormik={false}
                />
            ) : (
                <input
                    min={type === 'number' ? 0 : undefined}
                    disabled={disabled}
                    className={`w-full ${classNames} ${disabled ? disabledClasses : "text-white"}`}
                    type={type}
                    id={inputId}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    maxLength={maxLength}
                    onChange={onChange}
                />
            )}
            {!disabled && displayErrorMessage && (
                <Alert message={displayErrorMessage} type='error' />
            )}
        </>
    );
}

export default Input