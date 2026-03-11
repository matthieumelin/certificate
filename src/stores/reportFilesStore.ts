import { create } from 'zustand';

interface ReportFileEntry {
    fieldName: string;
    files: File[];
    existingPaths: string[];
}

interface ReportFilesStore {
    fileEntries: ReportFileEntry[];
    setFiles: (fieldName: string, files: File[], existingPaths?: string[]) => void;
    removeFile: (fieldName: string, index: number) => void;
    clearAll: () => void;
    getFiles: (fieldName: string) => File[];
    getExistingPaths: (fieldName: string) => string[];
}

export const useReportFilesStore = create<ReportFilesStore>((set, get) => ({
    fileEntries: [],

    setFiles: (fieldName, files, existingPaths = []) => set(state => {
        const existing = state.fileEntries.filter(e => e.fieldName !== fieldName);
        return { fileEntries: [...existing, { fieldName, files, existingPaths }] };
    }),

    removeFile: (fieldName, index) => set(state => ({
        fileEntries: state.fileEntries.map(e =>
            e.fieldName === fieldName
                ? { ...e, files: e.files.filter((_, i) => i !== index) }
                : e
        )
    })),

    clearAll: () => set({ fileEntries: [] }),

    getFiles: (fieldName) => {
        return get().fileEntries.find(e => e.fieldName === fieldName)?.files || [];
    },

    getExistingPaths: (fieldName) => {
        return get().fileEntries.find(e => e.fieldName === fieldName)?.existingPaths || [];
    },
}));