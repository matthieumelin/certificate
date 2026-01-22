import type { ObjectDocumentType } from "@/types/object";

export interface UploadedFile {
    id: string;
    file: File | null;
    name: string;
    size: number;
}

export interface Document {
    type: ObjectDocumentType | '';
    paths: string[]; 
}