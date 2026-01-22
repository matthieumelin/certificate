import { type FC, type ReactNode } from 'react'

interface FormRowProps {
    children: ReactNode;
    className?: string;
}

const FormRow: FC<FormRowProps> = ({ children, className = "" }) => {
    return (
        <div className={`flex flex-col lg:flex-row gap-4 ${className}`}>
            {children}
        </div>
    )
}

export default FormRow