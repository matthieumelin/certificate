import { useState, type FC } from 'react'
import { FaInfoCircle, FaCheckCircle } from 'react-icons/fa';
import { IoClose } from "react-icons/io5";
import { MdError } from "react-icons/md";

interface AlertProps {
    type: 'success' | 'error' | 'info';
    message: string;
    className?: string;
    canClose?: boolean;
}

const Alert: FC<AlertProps> = ({ type = 'info', message, className = "", canClose = false }) => {
    const [close, setClose] = useState<boolean>(false);

    const typeClasses = {
        success: "bg-emerald-900/20 border-emerald-500 text-emerald-400",
        error: "bg-red-900/20 border-red-500 text-red-400",
        info: "bg-blue-900/20 border-blue-500 text-blue-400",
    }

    return (
        <div className={`${typeClasses[type]} ${className} border rounded-xl p-4 flex justify-between items-center gap-3 ${close ? "hidden" : ""}`}>
            <div className='flex items-center gap-3'>
                {type === "info" ? <FaInfoCircle className='shrink-0' size={20} />
                    : type === "error" ? <MdError className='shrink-0' size={20} />
                        : type === "success" ? <FaCheckCircle className='shrink-0' size={20} />
                            : null
                }
                <p className='text-white text-sm font-medium'>{message}</p>
            </div>
            {canClose && (
                <button className='hover:opacity-70 transition-opacity' type='button' onClick={() => setClose(true)}>
                    <IoClose size={20} />
                </button>
            )}
        </div>
    )
}

export default Alert