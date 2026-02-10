import Alert from "@/components/UI/Alert";
import { normalizeFileName } from "@/helpers/file";
import { useStorage } from "@/hooks/useSupabase";
import { useCallback, useEffect, useRef, useState, type FC } from "react";

interface FileUploadProps {
    bucketName?: string;
    uploadPath?: string;
    value: string[];
    onChange: (file: File | null) => void;
    maxFiles?: number;
    maxSizeMB?: number;
    acceptedFileTypes?: string[];
    className?: string;
    error?: string | string[];
    skipUpload?: boolean;
    existingPreview?: string | null;
}

const FileUpload: FC<FileUploadProps> = ({
    bucketName,
    uploadPath,
    value = [],
    onChange,
    maxFiles = 1,
    maxSizeMB = 10,
    acceptedFileTypes = [],
    className = "",
    error: externalError,
    skipUpload = false,
    existingPreview = null,
}) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [internalError, setInternalError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { uploadFile, getSignedUrl } = useStorage();

    const errorMessage = Array.isArray(externalError) ? externalError[0] : externalError;
    const displayError = errorMessage || internalError;

    useEffect(() => {
        if (existingPreview) {
            setPreviewUrl(existingPreview);
        }
    }, [existingPreview]);

    useEffect(() => {
        if (skipUpload || existingPreview) return;

        const loadPreview = async () => {
            if (value.length > 0 && value[0].startsWith('http')) {
                setPreviewUrl(value[0]);
            } else if (value.length > 0 && bucketName) {
                try {
                    const url = await getSignedUrl(bucketName, value[0], 3600);
                    if (url) setPreviewUrl(url);
                } catch (err) {
                    console.error('Erreur chargement preview:', err);
                }
            }
        };

        loadPreview();
    }, [value, bucketName, skipUpload, existingPreview]);

    const validateFile = (file: File): boolean => {
        if (file.size > maxSizeMB * 1024 * 1024) {
            setInternalError(`Le fichier dépasse ${maxSizeMB}MB`);
            return false;
        }

        if (acceptedFileTypes.length) {
            const ext = '.' + file.name.split('.').pop()?.toLowerCase();
            if (!acceptedFileTypes.some(t => t === ext || t === file.type)) {
                setInternalError(`Type non accepté: ${file.name}`);
                return false;
            }
        }

        return true;
    };

    const handleFile = useCallback(
        async (file: File | null) => {
            if (!file) {
                onChange(null);
                setPreviewUrl(null);
                return;
            }

            setInternalError(null);

            if (!validateFile(file)) return;

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);

            if (skipUpload) {
                onChange(file);
            } else {
                if (!bucketName || !uploadPath) {
                    setInternalError('Configuration upload manquante');
                    return;
                }

                setIsUploading(true);
                try {
                    const fileName = normalizeFileName(file.name);
                    const path = `${uploadPath}/${Date.now()}_${fileName}`;
                    const result = await uploadFile(bucketName, path, file);
                    onChange(result.path as any); // Type à ajuster selon votre besoin
                } catch (err) {
                    setInternalError(err instanceof Error ? err.message : 'Erreur upload');
                    console.error('Upload error:', err);
                } finally {
                    setIsUploading(false);
                }
            }
        },
        [onChange, skipUpload, bucketName, uploadPath, uploadFile, maxSizeMB, acceptedFileTypes]
    );

    const removeFile = () => {
        onChange(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const stop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <div className={`w-full ${className ?? ''}`}>
            {!previewUrl ? (
                <div
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    onDragEnter={() => !isUploading && setIsDragging(true)}
                    onDragLeave={() => setIsDragging(false)}
                    onDragOver={stop}
                    onDrop={e => {
                        stop(e);
                        setIsDragging(false);
                        const file = e.dataTransfer.files[0];
                        if (file) handleFile(file);
                    }}
                    className={`
                        border-2 border-dashed rounded-lg p-8 text-center transition
                        ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        ${isDragging ? 'border-green' : displayError ? 'border-red-500' : 'border-white/10 hover:border-green'}
                    `}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={acceptedFileTypes.join(',')}
                        className="hidden"
                        onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) handleFile(file);
                        }}
                        disabled={isUploading}
                    />

                    <svg
                        className="mx-auto h-12 w-12 text-neutral-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                    >
                        <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>

                    <p className="mt-4 text-sm text-gray">
                        {isUploading ? (
                            <span className="text-green">Upload en cours...</span>
                        ) : (
                            <>
                                <span className="font-semibold text-green">Cliquez pour télécharger</span>
                                {' '}ou glissez-déposez
                            </>
                        )}
                    </p>

                    <p className="mt-2 text-xs text-gray">
                        {acceptedFileTypes.length ? acceptedFileTypes.join(', ') : 'Tous formats'}
                        {' '}(max {maxSizeMB}MB par fichier)
                    </p>
                </div>
            ) : (
                <div className="relative border border-white/10 rounded-lg overflow-hidden bg-white/5 p-4">
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-48 object-contain"
                    />
                    <button
                        type="button"
                        onClick={removeFile}
                        disabled={isUploading}
                        className="absolute top-2 right-2 bg-red-500 text-white text-sm px-3 py-1.5 rounded hover:bg-red-600 transition disabled:opacity-50"
                    >
                        Supprimer
                    </button>
                </div>
            )}

            {displayError && (
                <Alert className='mt-4' message={displayError} type='error' />
            )}
        </div>
    );
};

export default FileUpload;