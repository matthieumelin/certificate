import {
  useCertificateReportFormStore,
  type FormState,
} from "@/stores/certificateReportFormStore";
import { useStorage } from "@/hooks/useSupabase";
import { useCallback, useEffect, useState } from "react";

export const useReportFileUpload = (fieldName: keyof FormState) => {
  const {
    formData,
    addPendingFile,
    removePendingFile,
    removeExistingPath,
    pendingFiles,
  } = useCertificateReportFormStore();
  const { getSignedUrl } = useStorage();

  const existingPaths = (formData[fieldName] as string[]) ?? [];
  const entry = pendingFiles.find((e) => e.fieldName === fieldName);
  const pendingFilesList = entry?.files ?? [];

  const [existingPreviews, setExistingPreviews] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const urls = await Promise.all(
        existingPaths.map((path) =>
          getSignedUrl("object_attributes", path, 3600),
        ),
      );
      if (!cancelled) {
        setExistingPreviews(urls.filter(Boolean) as string[]);
      }
    };
    if (existingPaths.length > 0) {
      load();
    } else {
      setExistingPreviews([]);
    }
    return () => {
      cancelled = true;
    };
  }, [existingPaths.join(",")]);

  const pendingPreviews = pendingFilesList.map((f) => URL.createObjectURL(f));

  const previews = [...existingPreviews, ...pendingPreviews];

  const handleFiles = useCallback(
    (files: File[]) => {
      files.forEach((file) =>
        addPendingFile(fieldName as string, file, existingPaths),
      );
    },
    [fieldName, existingPaths.join(",")],
  );

  const removeFile = useCallback(
    (index?: number) => {
      if (index === undefined) return;
      const existingCount = existingPaths.length;
      if (index < existingCount) {
        removeExistingPath(fieldName as string, existingPaths[index]);
      } else {
        const pendingIndex = index - existingCount;
        removePendingFile(fieldName as string, pendingFilesList[pendingIndex]);
      }
    },
    [fieldName, existingPaths, pendingFilesList],
  );

  return { previews, handleFiles, removeFile, isUploading: false };
};
