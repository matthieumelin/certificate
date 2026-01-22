export const normalizeFileName = (fileName: string): string => {
  return fileName.split(".")[0].replace(/\s+/g, "_");
};
