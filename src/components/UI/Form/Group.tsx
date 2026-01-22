import { type FC, type ReactNode } from 'react'

interface FormGroupProps {
    children: ReactNode;
    className?: string;
}

const FormGroup: FC<FormGroupProps> = ({ children, className }) => {
    return (
        <div className={`flex flex-col gap-4 flex-1 w-full ${className}`}>
            {children}
        </div>
    )
}

export default FormGroup