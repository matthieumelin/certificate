import Alert from "@/components/UI/Alert";
import { useFieldError } from "@/hooks/useFieldError";
import { useRef, useState, type FC } from "react";

interface FileUploadProps {
    previews?: string[];
    onFilesChange?: (files: File[]) => void;
    onRemove?: (index?: number) => void;
    maxFiles?: number;
    maxSizeMB?: number;
    acceptedFileTypes?: string[];
    className?: string;
    error?: string | string[];
    fieldName?: string;
    isUploading?: boolean;
}

const FileUpload: FC<FileUploadProps> = ({
    previews = [],
    onFilesChange,
    onRemove,
    maxFiles = 1,
    maxSizeMB,
    acceptedFileTypes = [],
    className = "",
    error: externalError,
    fieldName,
    isUploading = false,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isMultiple = maxFiles > 1;
    const { errorMessage: storeError } = useFieldError(fieldName ?? "");
    const displayError = Array.isArray(externalError) ? externalError[0] : externalError || storeError;

    const stop = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };

    const handleFiles = (files: File[]) => {
        if (!onFilesChange) return;
        let filtered = files;
        if (maxSizeMB) {
            filtered = files.filter(f => {
                if (f.size > maxSizeMB * 1024 * 1024) return false;
                return true;
            });
        }
        const remaining = maxFiles - previews.length;
        onFilesChange(filtered.slice(0, remaining));
    };

    const canAddMore = previews.length < maxFiles;

    return (
        <div className={`w-full space-y-3 ${className}`}>
            {isMultiple && previews.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {previews.map((preview, index) => (
                        <div key={index} className="relative border border-white/10 rounded-lg overflow-hidden bg-white/5 aspect-square w-24">
                            <img src={preview} alt={`Photo ${index + 1}`} className="w-full h-full object-contain" />
                            <button
                                type="button"
                                onClick={() => onRemove?.(index)}
                                disabled={isUploading}
                                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 transition disabled:opacity-50">
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {!isMultiple && previews.length > 0 && (
                <div className="relative border border-white/10 rounded-lg overflow-hidden bg-white/5 p-4">
                    <img src={previews[0]} alt="Preview" className="w-full h-48 object-contain" />
                    <button
                        type="button"
                        onClick={() => onRemove?.()}
                        disabled={isUploading}
                        className="absolute top-2 right-2 bg-red-500 text-white text-sm px-3 py-1.5 rounded hover:bg-red-600 transition disabled:opacity-50">
                        Supprimer
                    </button>
                </div>
            )}

            {canAddMore && (
                <div
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    onDragEnter={() => !isUploading && setIsDragging(true)}
                    onDragLeave={() => setIsDragging(false)}
                    onDragOver={stop}
                    onDrop={(e) => { stop(e); setIsDragging(false); handleFiles(Array.from(e.dataTransfer.files)); }}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition cursor-pointer
                        ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
                        ${isDragging ? "border-green" : displayError ? "border-red-500" : "border-white/10 hover:border-green"}`}>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={acceptedFileTypes.join(",")}
                        multiple={isMultiple}
                        className="hidden"
                        onChange={(e) => { handleFiles(Array.from(e.target.files || [])); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                        disabled={isUploading}
                    />
                    <svg className="mx-auto h-12 w-12 text-neutral-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-4 text-sm text-gray">
                        {isUploading ? <span className="text-green">Upload en cours...</span> : (
                            <><span className="font-semibold text-green">Cliquez pour télécharger</span> ou glissez-déposez</>
                        )}
                    </p>
                    <p className="mt-2 text-xs text-gray">
                        {acceptedFileTypes.length ? acceptedFileTypes.join(", ") : "Tous formats"}
                        {maxSizeMB && ` • max ${maxSizeMB}MB`}
                        {isMultiple && ` • ${previews.length}/${maxFiles} fichiers`}
                    </p>
                </div>
            )}

            {displayError && <Alert className="mt-4" message={displayError} type="error" />}
        </div>
    );
};

export default FileUpload;