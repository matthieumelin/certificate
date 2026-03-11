import { useReportFilesStore } from '@/stores/reportFilesStore';

export const useReportFileUpload = (fieldName: string) => {
    const { setFiles, getFiles, getExistingPaths, removeFile } = useReportFilesStore();

    const pendingFiles = getFiles(fieldName);
    const existingPaths = getExistingPaths(fieldName);

    const value = [
        ...existingPaths,
        ...pendingFiles.map((_, i) => `__pending_${i}`)
    ];

    const onFilesChange = (newFiles: File[]) => {
        setFiles(fieldName, [...pendingFiles, ...newFiles], existingPaths);
    };

    const onChange = (path: string | null) => {
        if (path === null) {
            setFiles(fieldName, [], []);
        }
    };

    return { value, onFilesChange, onChange };
};