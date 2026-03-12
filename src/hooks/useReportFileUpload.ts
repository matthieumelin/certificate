import { useEffect, useMemo, useState } from "react";
import { useReportFilesStore } from "@/stores/reportFilesStore";
import { useStorage } from "@/hooks/useSupabase";
import { useCertificateReportFormStore } from "@/stores/certificateReportFormStore";

export const useReportFileUpload = (fieldName: string) => {
  const {
    setFiles,
    getFiles,
    getExistingPaths,
    addDeletedPath,
    markInitialized,
    isInitialized,
  } = useReportFilesStore();
  const { getSignedUrl } = useStorage();

  const formFieldValue = useCertificateReportFormStore(
    (state) => state.formData[fieldName as keyof typeof state.formData],
  );

  const pendingFiles = getFiles(fieldName);
  const existingPaths = getExistingPaths(fieldName);

  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const deletedPaths = useReportFilesStore.getState().deletedPaths;
    const pathsInFormData: string[] = Array.isArray(formFieldValue)
      ? (formFieldValue as string[]).filter(
          (v: string) =>
            v && !v.startsWith("__pending_") && !deletedPaths.includes(v),
        )
      : [];

    if (!isInitialized(fieldName)) {
      if (pathsInFormData.length > 0) {
        setFiles(fieldName, [], pathsInFormData);
      }
      markInitialized(fieldName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(formFieldValue)]);

  useEffect(() => {
    let cancelled = false;

    const loadPreviews = async () => {
      const deletedPaths = useReportFilesStore.getState().deletedPaths;
      const pathsToLoad = existingPaths.filter((p) => !deletedPaths.includes(p));

      if (!pathsToLoad.length) {
        if (!cancelled) setPreviews([]);
        return;
      }

      const urls = await Promise.all(
        pathsToLoad.map(async (path) => {
          if (!path) return null;
          try {
            return await getSignedUrl("object_attributes", path, 3600);
          } catch {
            return null;
          }
        }),
      );

      const filtered = urls.filter(Boolean) as string[];
      if (!cancelled) setPreviews(filtered);
    };

    loadPreviews();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(existingPaths)]);

  const value = useMemo(
    () => [...existingPaths, ...pendingFiles.map((_, i) => `__pending_${i}`)],
    [existingPaths, pendingFiles],
  );

  const onFilesChange = (files: File[]) => {
    setFiles(fieldName, [...pendingFiles, ...files], existingPaths);

    Promise.all(
      files.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          }),
      ),
    ).then((newPreviews) => {
      setPreviews((prev) => [...prev, ...newPreviews]);
    });
  };

  const onChange = async (path: string | null, index?: number) => {
    const currentExistingPaths = useReportFilesStore.getState().getExistingPaths(fieldName);
    const currentPendingFiles = useReportFilesStore.getState().getFiles(fieldName);

    if (path === null && index === undefined) {
      currentExistingPaths.forEach((p) => addDeletedPath(p));
      setFiles(fieldName, [], []);
      setPreviews([]);
    } else if (index !== undefined) {
      if (index < currentExistingPaths.length) {
        const pathToDelete = currentExistingPaths[index];
        addDeletedPath(pathToDelete);
        setFiles(fieldName, currentPendingFiles, currentExistingPaths.filter((_, i) => i !== index));
      } else {
        const pendingIndex = index - currentExistingPaths.length;
        setFiles(fieldName, currentPendingFiles.filter((_, i) => i !== pendingIndex), currentExistingPaths);
      }
      setPreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  return { value, previews, onFilesChange, onChange };
};