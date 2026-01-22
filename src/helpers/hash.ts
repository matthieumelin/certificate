import type { ObjectType } from "@/types/object";

export const genCertificateId = (
  objectType: ObjectType,
  brand: string
): string => {
  const objectTypeChar = objectType.name.charAt(0).toUpperCase();
  const hash = generateHash();

  const firstWord = brand
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/\s+/)[0];

  const brandClean = firstWord.replace(/[^A-Za-z]/g, "").toUpperCase();

  let brandCode = "";

  if (brandClean.length >= 3) {
    brandCode = brandClean.slice(0, 3);
  } else if (brandClean.length === 2) {
    brandCode = brandClean + brandClean.charAt(1);
  } else if (brandClean.length === 1) {
    brandCode = brandClean.repeat(3);
  } else {
    brandCode = "XXX";
  }

  return `${objectTypeChar}-${hash}-${brandCode}`;
};

export const generateHash = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random1 = Math.random().toString(36).substring(2, 5).toUpperCase();
  const random2 = Math.random().toString(36).substring(2, 5).toUpperCase();

  const combined = (timestamp + random1 + random2).replace(/[^A-Z0-9]/g, "");
  return combined.substring(0, 6).padEnd(6, "0");
};
