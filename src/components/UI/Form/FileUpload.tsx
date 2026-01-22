import { useStorage } from '@/hooks/useSupabase';
import { normalizeFileName } from '@/helpers/file';
import React, { type FC, useState, useRef, useCallback, useEffect, useMemo } from 'react';

interface FileUploadProps {
    bucketName: string;
    uploadPath: string;
    value: string[];
    onChange: (paths: string[]) => void;
    maxFiles?: number;
    maxSizeMB?: number;
    acceptedFileTypes?: string[];
    multiple?: boolean;
    className?: string;
}

const FileUpload: FC<FileUploadProps> = ({
    bucketName,
    uploadPath,
    value = [],
    onChange,
    maxFiles = 5,
    maxSizeMB = 10,
    acceptedFileTypes = [],
    multiple = true,
    className,
}) => {
    const [fileUrls, setFileUrls] = useState<Map<string, string>>(new Map());
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { getSignedUrl, uploadFile, deleteFile } = useStorage();

    const acceptedTypes = useMemo(() => acceptedFileTypes.join(','), [acceptedFileTypes]);

    useEffect(() => {
        const loadUrls = async () => {
            if (!value.length) {
                setFileUrls(new Map());
                return;
            }

            setIsLoading(true);
            const newUrlMap = new Map<string, string>();

            for (const path of value) {
                try {
                    const url = await getSignedUrl(bucketName, path, 3600);
                    if (url) newUrlMap.set(path, url);
                } catch (err) {
                    console.error(`Erreur chargement ${path}:`, err);
                }
            }

            setFileUrls(newUrlMap);
            setIsLoading(false);
        };

        loadUrls();
    }, [value, bucketName]);

    const validateFiles = useCallback(
        (files: File[]): File[] => {
            const valid: File[] = [];

            for (const file of files) {
                if (file.size > maxSizeMB * 1024 * 1024) {
                    setError(`${file.name} dépasse ${maxSizeMB}MB`);
                    continue;
                }

                if (acceptedFileTypes.length) {
                    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
                    if (!acceptedFileTypes.some(t => t === ext || t === file.type)) {
                        setError(`Type non accepté: ${file.name}`);
                        continue;
                    }
                }

                valid.push(file);
            }

            if (value.length + valid.length > maxFiles) {
                setError(`Maximum ${maxFiles} fichiers`);
                return valid.slice(0, maxFiles - value.length);
            }

            return valid;
        },
        [acceptedFileTypes, maxFiles, maxSizeMB, value.length]
    );

    const handleFiles = useCallback(
        async (fileList: FileList | null) => {
            if (!fileList || isUploading) return;
            setError(null);

            const files = validateFiles(Array.from(fileList));
            if (!files.length) return;

            setIsUploading(true);
            const uploadedPaths: string[] = [];

            try {
                for (const file of files) {
                    const fileName = normalizeFileName(file.name);
                    const path = `${uploadPath}/${Date.now()}_${fileName}`;

                    const result = await uploadFile(bucketName, path, file);
                    uploadedPaths.push(result.path);
                }

                onChange([...value, ...uploadedPaths]);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erreur upload');
                console.error('Upload error:', err);
            } finally {
                setIsUploading(false);
            }
        },
        [validateFiles, value, onChange, uploadFile, bucketName, uploadPath, isUploading]
    );

    const removeFile = useCallback(
        async (path: string) => {
            setError(null);

            try {
                await deleteFile(bucketName, [path]);
                onChange(value.filter(p => p !== path));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erreur suppression');
                console.error('Delete error:', err);
            }
        },
        [value, onChange, deleteFile, bucketName]
    );

    const stop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <div className={`w-full ${className ?? ''}`}>
            <div
                onClick={() => !isUploading && fileInputRef.current?.click()}
                onDragEnter={() => !isUploading && setIsDragging(true)}
                onDragLeave={() => setIsDragging(false)}
                onDragOver={stop}
                onDrop={e => {
                    stop(e);
                    setIsDragging(false);
                    handleFiles(e.dataTransfer.files);
                }}
                className={`
                    border-2 border-dashed rounded-lg p-8 text-center transition
                    ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    ${isDragging ? 'border-green' : 'border-white/10 hover:border-green'}
                `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple={multiple}
                    accept={acceptedTypes}
                    className="hidden"
                    onChange={e => handleFiles(e.target.files)}
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

            {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {isLoading && (
                <div className="mt-4 text-center text-sm text-gray">
                    Chargement des fichiers...
                </div>
            )}

            {value.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-sm text-gray mb-3 font-semibold">
                        Fichiers ({value.length}/{maxFiles})
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {value.map((path) => {
                            const url = fileUrls.get(path);
                            const fileName = path.split('/').pop() || path;

                            return (
                                <div
                                    key={path}
                                    className="relative group border border-white/10 rounded-lg overflow-hidden bg-white/5"
                                >
                                    {url ? (
                                        <img
                                            src={url}
                                            alt={fileName}
                                            className="w-full h-32 object-contain cursor-pointer"
                                            onClick={() => setZoomImageUrl(url)}
                                        />
                                    ) : (
                                        <div className="w-full h-32 flex items-center justify-center bg-black/20">
                                            <svg
                                                className="h-10 w-10 text-gray animate-spin"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                        </div>
                                    )}

                                    <div className="p-2 text-xs text-white text-center truncate">
                                        {fileName}
                                    </div>

                                    <button
                                        onClick={e => {
                                            e.stopPropagation();
                                            removeFile(path);
                                        }}
                                        disabled={isUploading}
                                        className="absolute bottom-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition disabled:opacity-50"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {zoomImageUrl && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                    onClick={() => setZoomImageUrl(null)}
                >
                    <img
                        src={zoomImageUrl}
                        alt="Zoom"
                        className="max-w-[90vw] max-h-[90vh] object-contain"
                    />
                </div>
            )}
        </div>
    );
};

export default FileUpload;