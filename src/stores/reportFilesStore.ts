import { create } from "zustand";

interface ReportFileEntry {
  fieldName: string;
  files: File[];
  existingPaths: string[];
}

interface ReportFilesStore {
  fileEntries: ReportFileEntry[];
  deletedPaths: string[];
  initializedFields: Set<string>;
  setFiles: (
    fieldName: string,
    files: File[],
    existingPaths?: string[],
  ) => void;
  removeFile: (fieldName: string, index: number) => void;
  addDeletedPath: (path: string) => void;
  markInitialized: (fieldName: string) => void;
  clearAll: () => void;
  getFiles: (fieldName: string) => File[];
  getExistingPaths: (fieldName: string) => string[];
  isInitialized: (fieldName: string) => boolean;
}

export const useReportFilesStore = create<ReportFilesStore>((set, get) => ({
  fileEntries: [],
  deletedPaths: [],
  initializedFields: new Set<string>(),

  setFiles: (fieldName, files, existingPaths = []) =>
    set((state) => {
      const existing = state.fileEntries.filter(
        (e) => e.fieldName !== fieldName,
      );
      return {
        fileEntries: [...existing, { fieldName, files, existingPaths }],
      };
    }),

  removeFile: (fieldName, index) =>
    set((state) => ({
      fileEntries: state.fileEntries.map((e) =>
        e.fieldName === fieldName
          ? { ...e, files: e.files.filter((_, i) => i !== index) }
          : e,
      ),
    })),

  addDeletedPath: (path) =>
    set((state) => ({
      deletedPaths: [...state.deletedPaths, path],
    })),

  markInitialized: (fieldName) =>
    set((state) => ({
      initializedFields: new Set([...state.initializedFields, fieldName]),
    })),

  clearAll: () =>
    set({ fileEntries: [], deletedPaths: [], initializedFields: new Set() }),

  getFiles: (fieldName) =>
    get().fileEntries.find((e) => e.fieldName === fieldName)?.files || [],

  getExistingPaths: (fieldName) =>
    get().fileEntries.find((e) => e.fieldName === fieldName)?.existingPaths ||
    [],

  isInitialized: (fieldName) => get().initializedFields.has(fieldName),
}));
