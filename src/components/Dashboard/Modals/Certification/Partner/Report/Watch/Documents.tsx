import FileUpload from '@/components/UI/Form/FileUpload';
import Label from '@/components/UI/Form/Label';
import { useCertificateReportForm } from '@/hooks/useCertificateReportForm';
import { useObjectDocuments } from '@/hooks/useSupabase';
import { useCertificateReportFormStore } from '@/stores/certificateReportFormStore';
import { useCertificateReportStore } from '@/stores/certificateReportStore';
import type { CertificateType } from '@/types/certificate.d';
import { ObjectDocumentType, type ObjectDocument } from '@/types/object.d';
import { Form, Formik, FieldArray } from 'formik';
import { useEffect, useState, type FC } from 'react';
import { FiDownload } from 'react-icons/fi';
import { LuX, LuPlus, LuFileText, LuImage, LuFile, LuTrash2, LuEye } from 'react-icons/lu';
import { toast } from 'react-toastify';

interface DocumentItem {
    type: ObjectDocumentType | '';
    paths: string[];
}

interface FormValues {
    documents: DocumentItem[];
}

interface PartnerCertificationReportDocumentsModalProps {
    certificateTypes: CertificateType[];
}

const PartnerCertificationReportDocumentsModal: FC<PartnerCertificationReportDocumentsModalProps> = ({ certificateTypes }) => {
    const { selectedCertificate } = useCertificateReportStore();
    const { formData } = useCertificateReportFormStore();
    const { deleteObjectDocument, downloadObjectDocument, getObjectDocumentsByObjectId, getObjectDocumentSignedUrl } = useObjectDocuments();

    const [objectDocuments, setObjectDocuments] = useState<ObjectDocument[]>([]);

    const documentTypes = [
        { value: ObjectDocumentType.WarrantyCard, label: 'Carte de garantie' },
        { value: ObjectDocumentType.OriginInvoice, label: "Facture d'origine" },
        { value: ObjectDocumentType.BuyingInvoice, label: "Facture d'achat" },
        { value: ObjectDocumentType.SellingInvoice, label: "Facture de vente" },
        { value: ObjectDocumentType.OtherInvoice, label: "Autre facture" },
        { value: ObjectDocumentType.RepairDocuments, label: "Document(s) d'intervention" },
        { value: ObjectDocumentType.InsuranceDocuments, label: "Document(s) d'assurance" },
        { value: ObjectDocumentType.OtherDocument, label: 'Autre document' },
    ];

    const initialValues: FormValues = {
        documents: formData.documents || [{ type: '', paths: [] }],
    };

    const handleViewObjectDocument = async (document: ObjectDocument) => {
        const signedUrl = await getObjectDocumentSignedUrl(document);
        if (signedUrl) {
            window.open(signedUrl, '_blank');
        }
    }

    const handleDownloadObjectDocument = async (document: ObjectDocument) => {
        await downloadObjectDocument(document);
    }

    const handleDeleteObjectDocument = async (document: ObjectDocument) => {
        const deletedObjectDocument = await deleteObjectDocument(document.id, document.file_path);
        if (deletedObjectDocument) {
            setObjectDocuments(prevDocs => prevDocs.filter(doc => doc.id !== document.id));
            toast.success(`Le document "${document.file_name}" a été supprimé avec succès.`);
        }
    }

    const getFileIcon = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
            return <LuImage className="w-5 h-5 text-blue-400" />;
        }
        if (extension === 'pdf') {
            return <LuFileText className="w-5 h-5 text-red-400" />;
        }
        return <LuFile className="w-5 h-5 text-neutral-400" />;
    };

    const getTypeLabelByValue = (value: string) => {
        return documentTypes.find(type => type.value === value)?.label || value;
    };

    useEffect(() => {
        const loadObjectDocuments = async () => {
            if (selectedCertificate?.object_id) {
                const fetchDocuments = await getObjectDocumentsByObjectId(selectedCertificate.object_id);
                setObjectDocuments(fetchDocuments);
            }
        };
        loadObjectDocuments();
    }, [])

    const certificateType = certificateTypes.find((certificateType: CertificateType) => certificateType.id === selectedCertificate?.certificate_type_id);
    const certificateTypeExcludedFormFields = certificateType?.excluded_report_form_fields ? certificateType?.excluded_report_form_fields.filter((excludedFormField: string) => excludedFormField.startsWith("documents")) : []

    return (
        <div>
            <div>
                {objectDocuments && objectDocuments.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-white text-xl font-semibold mb-4">Documents associés à l'objet</h2>
                        <div className="space-y-2">
                            {objectDocuments.map((doc, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 bg-neutral-800/50 border border-neutral-700 rounded-lg p-3"
                                >
                                    {getFileIcon(doc.file_name)}
                                    <div className="flex justify-between w-full items-center">
                                        <div>
                                            <p className="text-white text-sm font-medium truncate">
                                                {doc.file_name}
                                            </p>
                                            <p className="text-neutral-400 text-xs truncate">
                                                {getTypeLabelByValue(doc.type)}
                                            </p>
                                        </div>

                                        <div className='flex items-center gap-1'>
                                            <button type="button"
                                                onClick={() => handleViewObjectDocument(doc)}>
                                                <LuEye className="w-5 h-5 text-gray hover:text-white duration-200" />
                                            </button>
                                            <button type="button"
                                                onClick={() => handleDownloadObjectDocument(doc)}>
                                                <FiDownload className="w-5 h-5 text-gray hover:text-white duration-200" />
                                            </button>
                                            <button type="button"
                                                onClick={() => handleDeleteObjectDocument(doc)}>
                                                <LuTrash2 className="w-5 h-5 text-gray hover:text-white duration-200" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Nouveaux documents à ajouter */}
            <div className="space-y-4">
                <h2 className="text-white text-xl font-semibold">Ajouter des documents</h2>
                <Formik
                    initialValues={initialValues}
                    onSubmit={() => { }}>
                    {({ values, setFieldValue }) => {
                        useCertificateReportForm(values);
                        return (
                            <Form>
                                {!certificateTypeExcludedFormFields?.includes("documents") && (
                                    <FieldArray name="documents">
                                        {({ push, remove }) => (
                                            <div className="space-y-6">
                                                {values.documents.some(doc => doc.paths.length > 0) && (
                                                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                                                        <h3 className="text-white text-sm font-medium mb-3">
                                                            Fichiers en attente de sauvegarde ({values.documents.reduce((acc, doc) => acc + doc.paths.length, 0)})
                                                        </h3>
                                                        <div className="space-y-2">
                                                            {values.documents.map((doc, docIndex) => {
                                                                if (doc.paths.length === 0) return null;
                                                                return doc.paths.map((path, pathIndex) => {
                                                                    const fileName = path.split('/').pop() || path;
                                                                    return (
                                                                        <div
                                                                            key={`${docIndex}-${pathIndex}`}
                                                                            className="flex items-center gap-3 bg-neutral-800/50 border border-neutral-700 rounded-lg p-3"
                                                                        >
                                                                            {getFileIcon(fileName)}
                                                                            <div className="flex-1 min-w-0">
                                                                                <p className="text-white text-sm font-medium truncate">
                                                                                    {fileName}
                                                                                </p>
                                                                                <div className="flex items-center gap-2 mt-1">
                                                                                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                                                                                        {getTypeLabelByValue(doc.type)}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                });
                                                            })}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Formulaire d'ajout de documents */}
                                                <div className="space-y-3">
                                                    {values.documents.map((doc, index) => (
                                                        <div
                                                            key={index}
                                                            className="bg-neutral-900 border border-neutral-800 rounded-lg p-4"
                                                        >
                                                            <div className="flex flex-col gap-4">
                                                                <div className="flex flex-col gap-4">
                                                                    <Label
                                                                        htmlFor={`documents.${index}.type`}
                                                                        label="Type de document"
                                                                        required
                                                                    />
                                                                    <select
                                                                        id={`documents.${index}.type`}
                                                                        value={doc.type}
                                                                        onChange={(e) => setFieldValue(`documents.${index}.type`, e.target.value)}
                                                                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                    >
                                                                        <option value="">Sélectionner un type</option>
                                                                        {documentTypes.map((type) => (
                                                                            <option key={type.value} value={type.value}>
                                                                                {type.label}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                </div>

                                                                {doc.type && (
                                                                    <FileUpload
                                                                        bucketName="object_attributes"
                                                                        uploadPath={`objects/${selectedCertificate?.object_id}/documents/${doc.type}`}
                                                                        value={doc.paths}
                                                                        onChange={(paths) => setFieldValue(`documents.${index}.paths`, paths)}
                                                                        maxSizeMB={5}
                                                                        acceptedFileTypes={[".pdf", ".png", ".jpg", ".docx"]}
                                                                    />
                                                                )}

                                                                <button
                                                                    type="button"
                                                                    onClick={() => remove(index)}
                                                                    className="px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-2"
                                                                >
                                                                    <LuX className="w-4 h-4" />
                                                                    Retirer
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => push({ type: '', paths: [] })}
                                                    className="w-full px-4 py-3 rounded-lg border-2 border-dashed border-neutral-700 text-neutral-400 hover:border-green hover:text-green transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <LuPlus className="w-5 h-5" />
                                                    Ajouter un autre document
                                                </button>
                                            </div>
                                        )}
                                    </FieldArray>
                                )}
                            </Form>
                        )
                    }}
                </Formik>
            </div>
        </div>
    );
};

export default PartnerCertificationReportDocumentsModal;