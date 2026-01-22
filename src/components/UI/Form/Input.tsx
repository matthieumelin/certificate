import { ErrorMessage, Field } from 'formik';
import { useState, type FC } from 'react'
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useFieldError } from '@/hooks/useFieldError';

interface InputProps {
    type: 'text' | 'password' | 'email' | 'checkbox' | 'textarea' | 'number' | 'tel' | 'date';
    name: string;
    id: string;
    error?: string | undefined;
    placeholder?: string;
    label?: string;
    rows?: number;
    resize?: boolean;
    disabled?: boolean;
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    useFormik?: boolean;
}

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
    onChange,
    useFormik = true
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
        "duration-200 outline-none border rounded-xl px-4 py-3 bg-[#050a08]/80 placeholder:text-neutral-500 text-white font-medium";

    const disabledClasses =
        "bg-emerald-900/5 text-neutral-600 border-emerald-900/10 cursor-not-allowed";

    const getErrorClasses = () => {
        if (showError) {
            return "border-red-500 focus-within:border-red-400 bg-red-900/10";
        }
        return "border-emerald-900/30 focus-within:border-emerald-500";
    };

    const classNames = `${baseClasses} ${getErrorClasses()}`;

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
                       ${disabled ? disabledClasses : ""}
                   `}
                        id={id}
                        name={name}
                        placeholder={placeholder}
                    />
                ) : type === "checkbox" ? (
                    <div className="flex items-center gap-3">
                        <Field
                            type="checkbox"
                            id={id}
                            name={name}
                            disabled={disabled}
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
                                htmlFor={id}
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
                        ${disabled ? disabledClasses : ""}
                    `}
                    >
                        <Field
                            disabled={disabled}
                            className="outline-none w-full bg-transparent"
                            type={showPassword ? "text" : type}
                            id={id}
                            name={name}
                            placeholder={placeholder}
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
                ) : (
                    <Field
                        min={0}
                        disabled={disabled}
                        className={`
                            w-full
                            ${classNames}
                            ${disabled ? disabledClasses : "text-white"}
                        `}
                        type={type}
                        id={id}
                        name={name}
                        placeholder={placeholder}
                    />
                )}
                {!disabled && displayErrorMessage && (
                    <p className='text-red-400 text-sm mt-1 font-medium'>{displayErrorMessage}</p>
                )}
                {!disabled && !displayErrorMessage && (
                    <ErrorMessage name={name} render={(errorMessage) => (
                        <p className='text-red-400 text-sm mt-1 font-medium'>
                            <span>{errorMessage}</span>
                        </p>
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
                    className={`min-h-28 w-full ${classNames} ${resize ? "resize-y" : "resize-none"} ${disabled ? disabledClasses : ""}`}
                    id={id}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
            ) : type === "checkbox" ? (
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id={id}
                        name={name}
                        disabled={disabled}
                        checked={!!value}
                        onChange={onChange}
                        className={`accent-emerald-600 rounded border-2 ${disabled ? "border-emerald-900/10 bg-emerald-900/5 cursor-not-allowed" : "border-emerald-900/30 bg-[#050a08]/80 cursor-pointer hover:border-emerald-500"}`}
                    />
                    {label && (
                        <label htmlFor={id} className={`select-none font-medium ${disabled ? "text-neutral-600 cursor-not-allowed" : "text-white cursor-pointer"}`}>
                            {label}
                        </label>
                    )}
                </div>
            ) : type === "password" ? (
                <div className={`group flex ${classNames} ${disabled ? disabledClasses : ""}`}>
                    <input
                        disabled={disabled}
                        className="outline-none w-full bg-transparent"
                        type={showPassword ? "text" : type}
                        id={id}
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
            ) : (
                <input
                    min={0}
                    disabled={disabled}
                    className={`w-full ${classNames} ${disabled ? disabledClasses : "text-white"}`}
                    type={type}
                    id={id}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
            )}
            {!disabled && displayErrorMessage && (
                <p className='text-red-400 text-sm mt-1 font-medium'>{displayErrorMessage}</p>
            )}
        </>
    );
}

export default Input