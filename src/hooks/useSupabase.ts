import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { UserProfile } from "@/types/user.d";
import {
  type CertificateType,
  type Certificate,
  type CertificateDraft,
  CertificateInspectionResult,
  type CertificateInspection,
} from "@/types/certificate.d";
import type { PaymentMethod } from "@/types/payment.d";
import {
  ObjectDocumentType,
  type Object,
  type ObjectAttributes,
  type ObjectBrand,
  type ObjectDocument,
  type ObjectHistory,
  type ObjectModel,
  type ObjectReference,
  type ObjectRepair,
  type ObjectType,
} from "@/types/object.d";

interface CertificateDraftFilters {
  customerEmail?: string;
  stripeSessionId?: string;
}

interface CustomerCertificateFilters {
  customerId?: string;
}

// Stats
export const useStats = () => {
  const [stats, setStats] = useState({
    totalCertifiedObjects: 0,
    totalPartners: 0,
    totalBrands: 0,
    totalReferences: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase.rpc("get_public_stats");

      if (error) throw error;

      setStats({
        totalCertifiedObjects: data.totalCertifiedObjects || 0,
        totalPartners: data.totalPartners || 0,
        totalBrands: data.totalBrands || 0,
        totalReferences: data.totalReferences || 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching stats:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    error,
    mutate: fetchStats,
  };
};

// User Profiles
export const useProfiles = (autoFetch: boolean = true) => {
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfiles = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("profiles").select("*");

      if (error) throw error;
      setUserProfiles(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occured");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // const fetchUserProfile = useCallback(async (userId: string) => {
  //   try {
  //     setIsLoading(true);
  //     const { data, error } = await supabase
  //       .from("profiles")
  //       .select("*")
  //       .eq("id", userId)
  //       .maybeSingle();

  //     if (error) throw error;

  //     setUserProfile(data);
  //     return data;
  //   } catch (error) {
  //     setError(error instanceof Error ? error.message : "An error occured");
  //     throw error;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, []);

  const isUserProfileExists = async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (error) {
        if (error.code === "PGRST116") return false;
        throw error;
      }

      return !!data;
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occured");
      throw error;
    }
  };

  const createUserProfile = async (dto: Partial<UserProfile>) => {
    try {
      const exists = await isUserProfileExists(dto.email!);
      if (exists) {
        throw new Error("Un utilisateur avec cet email existe déjà.");
      }

      const { data, error } = await supabase
        .from("profiles")
        .insert(dto)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occured");
      throw error;
    } finally {
      mutate();
    }
  };

  const updateUserProfile = async (
    userId: string,
    updates: Partial<UserProfile>,
  ) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occured");
      throw error;
    } finally {
      mutate();
    }
  };

  const deleteUserProfile = async (userId: string) => {
    try {
      const updatedUserProfile = await updateUserProfile(userId, {
        is_deleted: true,
      });

      if (updatedUserProfile) {
        const { error } = await supabase
          .from("profiles")
          .delete()
          .eq("id", userId);
        if (error) throw error;
      }

      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occured");
      throw error;
    } finally {
      mutate();
    }
  };

  const getUserProfileByEmail = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (error) {
        if (error.code === "PGRST116") return null;
        throw error;
      }

      return data;
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occured");
      throw error;
    }
  };

  const getUserProfileById = async (id: string): Promise<UserProfile> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;

      return data;
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occured");
      throw error;
    }
  };

  const mutate = () => {
    fetchUserProfiles();
  };

  useEffect(() => {
    if (autoFetch) {
      fetchUserProfiles();
    }
  }, [fetchUserProfiles]);

  return {
    userProfiles,
    isLoading,
    error,
    mutate,
    fetchUserProfiles,
    createUserProfile,
    updateUserProfile,
    deleteUserProfile,
    isUserProfileExists,
    getUserProfileByEmail,
    getUserProfileById,
  };
};

// Objects
export const useObjectBrands = () => {
  const [objectBrands, setObjectBrands] = useState<ObjectBrand[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchObjectBrands = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("object_brands").select("*");

      if (error) throw error;
      setObjectBrands(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchObjectBrands();
  }, [fetchObjectBrands]);

  return {
    objectBrands,
    isLoading,
    error,
  };
};

export const useObjectModels = () => {
  const [objectModels, setObjectModels] = useState<ObjectModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchObjectModels = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("object_models").select("*");

      if (error) throw error;
      setObjectModels(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchObjectModels();
  }, [fetchObjectModels]);

  return {
    objectModels,
    isLoading,
    error,
  };
};

export const useObjectReferences = () => {
  const [objectReferences, setObjectReferences] = useState<ObjectReference[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchObjectReferences = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("object_references")
        .select("*");

      if (error) throw error;
      setObjectReferences(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchObjectReferences();
  }, [fetchObjectReferences]);

  return {
    objectReferences,
    isLoading,
    error,
  };
};

export const useObjects = (autoFetch: boolean = true, ownerId?: string) => {
  const [objects, setObjects] = useState<Object[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchObjects = useCallback(async () => {
    if (!ownerId) {
      setObjects([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("objects")
        .select("*")
        .eq("owner_id", ownerId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setObjects(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [ownerId]);

  const createObject = async (dto: Partial<Object>) => {
    try {
      const { data, error } = await supabase
        .from("objects")
        .insert(dto)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw error;
    }
  };

  const updateObject = async (id: number, updates: Partial<Object>) => {
    try {
      const { data, error } = await supabase
        .from("objects")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw error;
    } finally {
      fetchObjects();
    }
  };

  const deleteObject = async (id: number) => {
    try {
      const { error } = await supabase.from("objects").delete().eq("id", id);

      if (error) throw error;
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw error;
    } finally {
      fetchObjects();
    }
  };

  const getObjectById = async (id: number): Promise<Object> => {
    try {
      const { data, error } = await supabase
        .from("objects")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occured");
      throw error;
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchObjects();
    }
  }, [fetchObjects]);

  return {
    objects,
    isLoading,
    error,
    mutate: fetchObjects,
    createObject,
    updateObject,
    deleteObject,
    getObjectById,
  };
};

export const useObjectHistory = (autoFetch: boolean = true) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const createObjectHistory = async (dto: Partial<ObjectHistory>) => {
    try {
      const { data, error } = await supabase
        .from("object_history")
        .insert(dto)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw error;
    }
  };

  const deleteObjectHistory = async (id: number) => {
    try {
      const { error } = await supabase
        .from("object_history")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw error;
    }
  };

  const getObjectHistoryById = async (id: number): Promise<ObjectHistory> => {
    try {
      const { data, error } = await supabase
        .from("object_history")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occured");
      throw error;
    }
  };

  const getObjectHistoryByObjectId = async (
    id: number,
  ): Promise<ObjectHistory[]> => {
    try {
      const { data, error } = await supabase
        .from("object_history")
        .select("*")
        .eq("object_id", id);

      if (error) throw error;
      return data;
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occured");
      throw error;
    }
  };

  return {
    isLoading,
    error,
    createObjectHistory,
    deleteObjectHistory,
    getObjectHistoryById,
    getObjectHistoryByObjectId,
  };
};

export const useObjectRepairs = (autoFetch: boolean = true) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const createObjectRepair = async (dto: Partial<ObjectRepair>) => {
    try {
      const { data, error } = await supabase
        .from("object_repairs")
        .insert(dto)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw error;
    }
  };

  const deleteObjectRepair = async (id: number) => {
    try {
      const { error } = await supabase
        .from("object_repairs")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw error;
    }
  };

  const getObjectRepairsById = async (id: number): Promise<ObjectRepair> => {
    try {
      const { data, error } = await supabase
        .from("object_repairs")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occured");
      throw error;
    }
  };

  const getObjectRepairsByObjectId = async (
    id: number,
  ): Promise<ObjectRepair[]> => {
    try {
      const { data, error } = await supabase
        .from("object_repairs")
        .select("*")
        .eq("object_id", id);

      if (error) throw error;
      return data;
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occured");
      throw error;
    }
  };

  return {
    isLoading,
    error,
    createObjectRepair,
    deleteObjectRepair,
    getObjectRepairsById,
    getObjectRepairsByObjectId,
  };
};

export const useObjectTypes = () => {
  const [objectTypes, setObjectTypes] = useState<ObjectType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchObjectTypes = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("object_types").select("*");
      if (error) throw error;

      setObjectTypes(data || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occured");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const mutate = () => {
    fetchObjectTypes();
  };

  useEffect(() => {
    fetchObjectTypes();
  }, [fetchObjectTypes]);

  return {
    objectTypes,
    isLoading,
    error,
    mutate,
  };
};

export const useObjectAttributes = (autoFetch?: boolean, objectId?: number) => {
  const [objectAttributes, setObjectAttributes] = useState<ObjectAttributes>(
    {},
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { uploadFile, deleteFile } = useStorage();

  const fetchObjectAttributes = useCallback(async () => {
    if (!objectId) {
      setObjectAttributes({});
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("object_attributes")
        .select("attributes")
        .eq("object_id", objectId)
        .maybeSingle();

      if (error) throw error;
      setObjectAttributes(data?.attributes || {});
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [objectId]);

  const setAttributes = async (attributes: ObjectAttributes) => {
    if (!objectId) {
      throw new Error("objectId is required");
    }

    try {
      const { data, error } = await supabase
        .from("object_attributes")
        .upsert({
          object_id: objectId,
          attributes: attributes,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occured");
      throw err;
    }
  };

  const uploadAttributeFiles = async (key: string, files: File[]) => {
    const paths: string[] = [];

    for (const file of files) {
      const path = `objects/${objectId}/${Date.now()}_${file.name}`;
      const { path: storedPath } = await uploadFile(
        "object_attributes",
        path,
        file,
      );
      paths.push(storedPath);
    }

    await setAttributes({
      ...objectAttributes,
      [key]: [
        ...(Array.isArray(objectAttributes[key]) ? objectAttributes[key] : []),
        ...paths,
      ],
    });

    return paths;
  };

  const removeAttributeFile = async (key: string, path: string) => {
    if (!objectId) throw new Error("objectId is required");

    try {
      await deleteFile("object_attributes", [path]);

      const current = Array.isArray(objectAttributes[key])
        ? (objectAttributes[key] as string[])
        : [];

      const updated = current.filter((p) => p !== path);

      await setAttributes({
        ...objectAttributes,
        [key]: updated.length > 0 ? updated : null,
      });

      return true;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la suppression du fichier",
      );
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchObjectAttributes();
    }
  }, [fetchObjectAttributes]);

  return {
    objectAttributes,
    isLoading,
    error,
    mutate: fetchObjectAttributes,
    setAttributes,
    uploadAttributeFiles,
    removeAttributeFile,
  };
};

export const useObjectDocuments = (objectId?: number, autoFetch?: boolean) => {
  const { uploadFile, deleteFile, getSignedUrl } = useStorage();

  const [objectDocuments, setDocuments] = useState<ObjectDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchObjectDocuments = useCallback(async () => {
    if (!objectId) {
      setDocuments([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("object_documents")
        .select("*")
        .eq("object_id", objectId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [objectId]);

  const addObjectDocument = async (
    file: File,
    type: ObjectDocumentType,
    objectId?: number,
  ): Promise<ObjectDocument> => {
    try {
      const cleanFileName = file.name.replace(/\s+/g, "_");
      const path = `${objectId}/${Date.now()}_${cleanFileName}`;

      const uploadResult = await uploadFile("object_documents", path, file);

      const { data, error } = await supabase
        .from("object_documents")
        .insert({
          object_id: objectId!,
          type,
          file_name: file.name,
          file_path: uploadResult.path,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    }
  };

  const deleteObjectDocument = async (id: number, path: string) => {
    try {
      await deleteFile("object_documents", [path]);

      const { error } = await supabase
        .from("object_documents")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    }
  };

  const getObjectDocumentsByObjectId = async (
    objectId: number,
  ): Promise<ObjectDocument[]> => {
    try {
      const { data, error } = await supabase
        .from("object_documents")
        .select("*")
        .eq("object_id", objectId);

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    }
  };

  const getObjectDocumentSignedUrl = async (
    document: ObjectDocument,
  ): Promise<string> => {
    try {
      const signedUrl = await getSignedUrl(
        "object_documents",
        document.file_path,
      );
      return signedUrl;
    } catch (error) {
      console.error("Error getting signed URL:", error);
      throw error;
    }
  };

  const downloadObjectDocument = async (doc: ObjectDocument) => {
    try {
      const signedUrl = await getObjectDocumentSignedUrl(doc);
      if (signedUrl) {
        const response = await fetch(signedUrl);
        const data = await response.blob();
        const url = window.URL.createObjectURL(data);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", doc.file_name);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);

        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error downloading document:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchObjectDocuments();
    }
  }, [fetchObjectDocuments]);

  return {
    objectDocuments,
    isLoading,
    error,
    downloadObjectDocument,
    addObjectDocument,
    deleteObjectDocument,
    getObjectDocumentsByObjectId,
    getObjectDocumentSignedUrl,
  };
};

// Certificate Verification
export const useCertificateVerification = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const verifyCertificate = async (certificateId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc("verify_certificate", {
        certificate_id: certificateId.trim(),
      });

      if (error) throw error;

      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la vérification";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    verifyCertificate,
    isLoading,
    error,
  };
};

// Certificates
export const useCertificateTypes = () => {
  const [certificateTypes, setCertificateTypes] = useState<CertificateType[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCertificateTypes = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("certificate_types")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;

      setCertificateTypes(data || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occured");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getCertificateTypeById = async (
    id: number,
  ): Promise<CertificateType> => {
    try {
      const { data, error } = await supabase
        .from("certificate_types")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;

      return data;
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occured");
      throw error;
    }
  };

  const mutate = () => {
    fetchCertificateTypes();
  };

  useEffect(() => {
    fetchCertificateTypes();
  }, [fetchCertificateTypes]);

  return {
    getCertificateTypeById,
    certificateTypes,
    isLoading,
    error,
    mutate,
  };
};

export const useCertificatesBase = (
  filterField: string,
  filterValue?: string,
) => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCertificates = useCallback(async () => {
    if (!filterValue) {
      setCertificates([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .eq(filterField, filterValue)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  }, [filterField, filterValue]);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  return {
    certificates,
    isLoading,
    error,
    mutate: fetchCertificates,
  };
};

export const usePartnerCertificates = (userId?: string) => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCertificates = useCallback(async () => {
    if (!userId) {
      setCertificates([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("certificates")
        .select(
          `
          *,
          customer:profiles!customer_id(id, email, first_name, last_name, society, vat_number),
          creator:profiles!created_by(role),
          object:objects!object_id(*)
        `,
        )
        .eq("created_by", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setCertificates(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const updatePartnerCertificate = async (
    id: string,
    updates: Partial<Certificate>,
  ): Promise<Certificate> => {
    try {
      const { data, error } = await supabase
        .from("certificates")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select(
          `
          *,
          customer:profiles!customer_id(id, email, first_name, last_name, society, vat_number),
          creator:profiles!created_by(role),
          object:objects!object_id(id, type_id, owner_id)
        `,
        )
        .single();

      if (error) throw error;

      return data;
    } finally {
      fetchCertificates();
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  return {
    certificates,
    isLoading,
    error,
    mutate: fetchCertificates,
    updatePartnerCertificate,
  };
};

export const useCustomerCertificates = (
  autoFetch: boolean = true,
  filters?: CustomerCertificateFilters,
) => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCertificates = useCallback(async () => {
    if (!filters?.customerId) {
      setCertificates([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      let query = supabase
        .from("certificates")
        .select(
          `
          *,
        customer:profiles!customer_id(id, email, first_name, last_name, society, vat_number),
          creator:profiles!created_by(role),
          object:objects!object_id(id, type_id, owner_id)
        `,
        )
        .order("created_at", { ascending: false });

      if (filters) {
        if (filters.customerId) {
          query = query.eq("customer_id", filters.customerId);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      setCertificates(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  }, [filters?.customerId]);

  const updateCustomerCertificate = async (
    id: string,
    updates: Partial<Certificate>,
  ): Promise<Certificate> => {
    try {
      const { data, error } = await supabase
        .from("certificates")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select(
          `
          *,
          customer:profiles!customer_id(id, email, first_name, last_name, society, vat_number),
          creator:profiles!created_by(role),
          object:objects!object_id(id, type_id, owner_id)
        `,
        )
        .single();

      if (error) throw error;

      return data;
    } finally {
      fetchCertificates();
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchCertificates();
    }
  }, [fetchCertificates]);

  return {
    certificates,
    isLoading,
    error,
    mutate: fetchCertificates,
    updateCustomerCertificate,
  };
};

export const useCertificateInspections = () => {
  const { getSignedUrl } = useStorage();
  const [error, setError] = useState<string | null>(null);

  const getCertificateInspection = async (
    certificateId: string,
  ): Promise<CertificateInspection> => {
    try {
      const { data, error } = await supabase
        .from("certificate_inspections")
        .select("*")
        .eq("certificate_id", certificateId)
        .maybeSingle();

      if (error) throw error;

      return data;
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occured");
      throw error;
    }
  };

  const isCertificateInspectionExists = async (
    certificateId: string,
  ): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("certificate_inspections")
        .select("id")
        .eq("certificate_id", certificateId)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      return !!data;
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occured");
      return false;
    }
  };

  const createCertificateInspection = async (
    certificateId: string,
    inspectedBy: string,
    result: CertificateInspectionResult,
    suspectPoints: string[],
    comment: string,
    photoPaths: string[],
  ) => {
    try {
      const certificationInspectionExists =
        await isCertificateInspectionExists(certificateId);
      if (certificationInspectionExists) {
        throw new Error(
          `Une inspection de certificat existe déjà avec cette identifiant (#${certificateId}).`,
        );
      }

      const { data, error } = await supabase
        .from("certificate_inspections")
        .insert({
          certificate_id: certificateId,
          inspected_by: inspectedBy,
          suspect_points: suspectPoints,
          result,
          comment,
          photos: photoPaths,
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occured");
      throw error;
    }
  };

  const getCertificateInspectionPhotoSignedUrl = async (
    photoPath: string,
  ): Promise<string> => {
    try {
      const signedUrl = await getSignedUrl(
        "certificate_inspections",
        photoPath,
      );
      return signedUrl;
    } catch (error) {
      console.error("Error getting signed URL:", error);
      throw error;
    }
  };

  return {
    error,
    isCertificateInspectionExists,
    createCertificateInspection,
    getCertificateInspection,
    getCertificateInspectionPhotoSignedUrl,
  };
};

export const useCertificateDrafts = (
  autoFetch: boolean = true,
  filters?: CertificateDraftFilters,
) => {
  const [certificateDrafts, setCertificateDrafts] = useState<
    CertificateDraft[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCertificateDrafts = useCallback(async () => {
    try {
      setIsLoading(true);

      let query = supabase
        .from("certificate_drafts")
        .select("*")
        .order("created_at", { ascending: false });

      if (filters) {
        if (filters.customerEmail) {
          query = query.eq("customer_data->>email", filters.customerEmail);
        }
        if (filters.stripeSessionId) {
          query = query.eq("stripe_session_id", filters.stripeSessionId);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      setCertificateDrafts(data || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [filters?.customerEmail, filters?.stripeSessionId]);

  const createCertificateDraft = async (dto: Partial<CertificateDraft>) => {
    try {
      const { data, error } = await supabase
        .from("certificate_drafts")
        .insert(dto)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occured");
      throw error;
    }
  };

  const deleteCertificateDraft = async (id: string) => {
    try {
      const { error } = await supabase
        .from("certificate_drafts")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occured");
    }
  };

  const updateCertificateDraft = async (
    id: string,
    updates: Partial<CertificateDraft>,
  ): Promise<CertificateDraft> => {
    try {
      const { data, error } = await supabase
        .from("certificate_drafts")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occured");
      throw error;
    } finally {
      mutate();
    }
  };

  const getCertificateDraftById = async (
    id: string,
  ): Promise<{ data: CertificateDraft | null; error: string | null }> => {
    try {
      const { data, error } = await supabase
        .from("certificate_drafts")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occured");
      throw error;
    }
  };

  const mutate = () => {
    fetchCertificateDrafts();
  };

  useEffect(() => {
    if (autoFetch) {
      fetchCertificateDrafts();
    }
  }, [fetchCertificateDrafts]);

  return {
    certificateDrafts,
    isLoading,
    error,
    mutate,
    createCertificateDraft,
    updateCertificateDraft,
    deleteCertificateDraft,
    getCertificateDraftById,
  };
};

export const useCertificates = (autoFetch: boolean = true) => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCertificates = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getCertificateById = async (id: string): Promise<Certificate> => {
    try {
      const { data, error } = await supabase
        .from("certificates")
        .select(
          `
          *,
          customer:profiles!customer_id(email, first_name, last_name, society, vat_number),
          certificate_type:certificate_types!certificate_type_id(name, price, features, physical),
          object:objects!object_id(brand, model, reference, serial_number, owner_id, object_documents(id, file_name, file_path), object_type:object_types(label), object_attributes(attributes))
        `,
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occured");
      throw error;
    }
  };

  const createCertificate = async (
    dto: Partial<Certificate>,
  ): Promise<Certificate> => {
    try {
      const { data, error } = await supabase
        .from("certificates")
        .insert(dto)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occured");
      throw error;
    }
  };

  const deleteCertificate = async (id: string) => {
    try {
      const { error } = await supabase
        .from("certificates")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occured");
      throw error;
    } finally {
      mutate();
    }
  };

  const updateCertificate = async (
    id: string,
    updates: Partial<Certificate>,
  ): Promise<Certificate> => {
    try {
      const { data, error } = await supabase
        .from("certificates")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occured");
      throw error;
    } finally {
      mutate();
    }
  };

  const downloadCertificate = () => {};

  const mutate = () => {
    fetchCertificates();
  };

  useEffect(() => {
    if (autoFetch) {
      fetchCertificates();
    }
  }, [fetchCertificates]);

  return {
    certificates,
    isLoading,
    error,
    mutate,
    createCertificate,
    deleteCertificate,
    downloadCertificate,
    updateCertificate,
    getCertificateById,
  };
};

// Payment Methods
export const usePaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentMethods = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("payments_methods")
        .select("*");
      if (error) throw error;
      setPaymentMethods(data || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occured");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const mutate = () => {
    fetchPaymentMethods();
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, [fetchPaymentMethods]);

  return { paymentMethods, isLoading, error, mutate };
};

// Storage
export const useStorage = () => {
  const getPublicUrl = async (from: string, path: string) => {
    try {
      const { data } = await supabase.storage.from(from).getPublicUrl(path);
      if (!data || !data.publicUrl) throw new Error("Public url not found");
      return data.publicUrl;
    } catch (error) {
      console.error("Error getting public URL:", error);
      throw error;
    }
  };

  const getSignedUrl = async (
    from: string,
    path: string,
    expiresIn: number = 3600,
  ) => {
    try {
      const { data, error } = await supabase.storage
        .from(from)
        .createSignedUrl(path, expiresIn);

      if (error) throw error;
      if (!data || !data.signedUrl) throw new Error("Signed url not found");

      return data.signedUrl;
    } catch (error) {
      console.error("Error getting signed URL:", error);
      throw error;
    }
  };

  const uploadFile = async (from: string, path: string, file: File) => {
    try {
      const { data, error } = await supabase.storage
        .from(from)
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        if (error.message.includes("Bucket not found")) {
          throw new Error(
            `Le bucket "${from}" n'existe pas. Veuillez le créer dans le tableau de bord Supabase avant de télécharger des fichiers.`,
          );
        }

        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const updateFile = async (from: string, path: string, file: File) => {
    try {
      const { data, error } = await supabase.storage
        .from(from)
        .update(path, file, {
          upsert: true,
          cacheControl: "3600",
        });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating file:", error);
      throw error;
    }
  };

  const downloadFile = async (from: string, path: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage.from(from).download(path);
      if (error) throw error;
      if (data) {
        const url = window.URL.createObjectURL(data);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);

        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      throw error;
    }
  };

  const deleteFile = async (from: string, paths: string[]) => {
    try {
      const { data, error } = await supabase.storage.from(from).remove(paths);
      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  };

  return {
    getPublicUrl,
    getSignedUrl,
    uploadFile,
    deleteFile,
    updateFile,
    downloadFile,
  };
};
