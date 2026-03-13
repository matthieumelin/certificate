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
    deletedPaths,
  } = useCertificateReportFormStore();
  const { getSignedUrl } = useStorage();

  const existingPaths = (formData[fieldName] as string[]) ?? [];
  const entry = pendingFiles.find((e) => e.fieldName === fieldName);
  const pendingFilesList = entry?.files ?? [];

  const activePaths = existingPaths.filter((p) => !deletedPaths.includes(p));

  const [existingPreviews, setExistingPreviews] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!activePaths.length) {
        setExistingPreviews([]);
        return;
      }
      const urls = await Promise.all(
        activePaths.map((path) =>
          getSignedUrl("object_attributes", path, 3600).catch(() => null),
        ),
      );
      if (!cancelled) {
        setExistingPreviews(urls.filter(Boolean) as string[]);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [activePaths.join(",")]);

  const pendingPreviews = pendingFilesList.map((f) => URL.createObjectURL(f));
  const previews = [...existingPreviews, ...pendingPreviews];

  const handleFiles = useCallback(
    (files: File[]) => {
      files.forEach((file) =>
        addPendingFile(fieldName as string, file, activePaths),
      );
    },
    [fieldName, activePaths.join(",")],
  );

  const removeFile = useCallback(
    (index?: number) => {
      if (index === undefined) return;
      const existingCount = activePaths.length;
      if (index < existingCount) {
        removeExistingPath(fieldName as string, activePaths[index]);
      } else {
        const pendingIndex = index - existingCount;
        removePendingFile(fieldName as string, pendingFilesList[pendingIndex]);
      }
    },
    [fieldName, activePaths, pendingFilesList],
  );

  return { previews, handleFiles, removeFile, isUploading: false };
};
