import { useEffect, useState, type FC, type ReactNode } from 'react'
import PartnerCertificationReportAccessoriesModal from './Watch/Accessories';
import PartnerCertificationReportCaseModal from './Watch/Case';
import PartnerCertificationReportBraceletModal from './Watch/Bracelet';
import PartnerCertificationReportDialModal from './Watch/Dial';
import PartnerCertificationReportMovementModal from './Watch/Movement';
import PartnerCertificationReportCaseCrownModal from './Watch/Case/Crown';
import PartnerCertificationReportCaseBackModal from './Watch/Case/Back';
import PartnerCertificationReportCaseBezelModal from './Watch/Case/Bezel';
import PartnerCertificationReportCaseBezelInsertModal from './Watch/Case/Bezel/Insert';
import PartnerCertificationReportCaseGlassModal from './Watch/Case/Glass';
import PartnerCertificationReportBraceletClaspModal from './Watch/Bracelet/Clasp';
import PartnerCertificationReportBraceletEndLinksModal from './Watch/Bracelet/EndLinks';
import PartnerCertificationReportDialIndexModal from '@/components/Dashboard/Modals/Certification/Partner/Report/Watch/Dial/DIndex';
import PartnerCertificationReportDialHandsModal from '@/components/Dashboard/Modals/Certification/Partner/Report/Watch/Dial/Hands';
import PartnerCertificationReportValueModal from './Watch/Value';
import { IoStatsChart } from 'react-icons/io5';
import { TiLink } from "react-icons/ti";
import { GiBigGear } from "react-icons/gi";
import { BsTools } from "react-icons/bs";
import { FaComment, FaFile, FaX } from 'react-icons/fa6';
import { CiCircleInfo } from "react-icons/ci";
import { FiWatch, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { BiBox } from 'react-icons/bi';
import { MdManageHistory, MdOutlineWatchLater } from "react-icons/md";
import PartnerCertificationReportGeneralCommentModal from '@/components/Dashboard/Modals/Certification/Partner/Report/Watch/GeneralComment';
import PartnerCertificationReportGeneralModal from '@/components/Dashboard/Modals/Certification/Partner/Report/Watch/General';
import PartnerCertificationReportDocumentsModal from '@/components/Dashboard/Modals/Certification/Partner/Report/Watch/Documents';
import PartnerCertificationReportTechnicalRustCorrosionModal from '@/components/Dashboard/Modals/Certification/Partner/Report/Watch/Technical/RustCorrosion';
import PartnerCertificationReportTechnicalLubrificationModal from '@/components/Dashboard/Modals/Certification/Partner/Report/Watch/Technical/Lubrification';
import PartnerCertificationReportTechnicalJointsModal from '@/components/Dashboard/Modals/Certification/Partner/Report/Watch/Technical/Joints';
import PartnerCertificationReportTechnicalWeightModal from './Watch/Technical/Weight';
import PartnerCertificationReportTechnicalWaterproofingModal from './Watch/Technical/Waterproofing';
import { CertificateStatus, type CertificateType } from '@/types/certificate.d';
import PartnerCertificationReportTechnicalMovementModal from '@/components/Dashboard/Modals/Certification/Partner/Report/Watch/Technical/Movement';
import { FaHistory } from 'react-icons/fa';
import PartnerCertificationReportHistoryModal from '@/components/Dashboard/Modals/Certification/Partner/Report/Watch/History';
import PartnerCertificationReportRepairModal from '@/components/Dashboard/Modals/Certification/Partner/Report/Watch/Repair';
import { ObjectStatus, type ObjectBrand, type ObjectModel, type ObjectReference, type ObjectType } from '@/types/object.d';
import { useCertificateReportFormStore } from '@/stores/certificateReportFormStore';
import useValidateCertificateReport from '@/hooks/useValidateCertificateReport';
import { toast } from 'react-toastify';
import { supabase } from '@/lib/supabase';
import { useCertificates, useObjectAttributes, useStorage } from '@/hooks/useSupabase';
import { Button } from '@/components/UI/Button';
import { useCertificateStore } from '@/stores/certificateStore';

interface SubCategory {
    id: string;
    name: string;
}

interface Category {
    id: string;
    name: string;
    icon: ReactNode;
    subcategories?: SubCategory[];
}

interface PartnerCertificationReportModalProps {
    certificateTypes: CertificateType[],
    objectTypes: ObjectType[];
    objectBrands: ObjectBrand[];
    objectModels: ObjectModel[];
    objectReferences: ObjectReference[];
    onClose: () => void;
    onSuccess: () => void;
}

const PartnerCertificationReportModal: FC<PartnerCertificationReportModalProps> = ({ certificateTypes, objectTypes, objectBrands, objectModels, objectReferences, onClose, onSuccess, }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>("general");
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isSavingAndFinishing, setIsSavingAndFinishing] = useState<boolean>(false);

    const { selectedCertificate } = useCertificateStore();
    const { updateCertificate } = useCertificates(false);
    const { objectAttributes } = useObjectAttributes(true, selectedCertificate?.object_id);
    const { pendingFiles, deletedPaths, getAllFormData, resetFormData, clearPendingFiles, clearValidationErrors, hasErrors, loadInitialData, validationErrors } = useCertificateReportFormStore();
    const { validateReport } = useValidateCertificateReport(certificateTypes);
    const { uploadFile } = useStorage();

    useEffect(() => {
        loadInitialData(objectAttributes);
    }, [objectAttributes]);

    const categories: Category[] = [
        { id: "general", name: "Infos générales", icon: <CiCircleInfo size={18} /> },
        { id: "accessories", name: "Accessoires", icon: <BiBox size={18} /> },
        {
            id: "case", name: "Boitier", icon: <FiWatch size={18} />,
            subcategories: [
                { id: "case-main", name: "Boitier" },
                { id: "case-back", name: "Fond de boite" },
                { id: "case-crown", name: "Couronne" },
                { id: "case-bezel", name: "Lunette" },
                { id: "case-bezel-insert", name: "Insert de lunette" },
                { id: "case-glass", name: "Verre" }
            ]
        },
        {
            id: "bracelet", name: "Bracelet", icon: <TiLink size={18} />,
            subcategories: [
                { id: "bracelet-main", name: "Bracelet" },
                { id: "bracelet-clasp", name: "Fermoir" },
                { id: "bracelet-end-links", name: "Maillons de fin (end-links) / Cache Pompe" }
            ]
        },
        {
            id: "dial", name: "Cadran", icon: <MdOutlineWatchLater size={18} />,
            subcategories: [
                { id: "dial-main", name: "Cadran" },
                { id: "dial-index", name: "Index" },
                { id: "dial-hands", name: "Aiguilles" }
            ]
        },
        { id: "movement", name: "Mouvement", icon: <GiBigGear size={18} /> },
        {
            id: "technical", name: "Technique", icon: <BsTools size={18} />,
            subcategories: [
                { id: "technical-weight", name: "Poids" },
                { id: "technical-movement", name: "Performance du mouvement" },
                { id: "technical-waterproofing", name: "Étanchéité" },
                { id: "technical-joints", name: "Joints" },
                { id: "technical-lubrification", name: "Lubrification" },
                { id: "technical-rust-corrosion", name: "Rouille et corrosion" }
            ]
        },
        { id: "value", name: "Valeur", icon: <IoStatsChart size={18} /> },
        { id: "history", name: "Historique", icon: <FaHistory size={18} /> },
        { id: "repair", name: "Interventions", icon: <MdManageHistory size={18} /> },
        { id: "documents", name: "Documents", icon: <FaFile size={18} /> },
        { id: "general-comment", name: "Commentaire Général", icon: <FaComment size={18} /> },
    ];

    const categoryErrorMap: Record<string, boolean> = {
        general: validationErrors.some(e => e.section === 'general' && e.field.startsWith('general_object')),
        accessories: validationErrors.some(e => e.section === 'accessories'),
        'case-main': validationErrors.some(e => e.section === 'case'),
        'case-back': validationErrors.some(e => e.section === 'case_back'),
        'case-crown': validationErrors.some(e => e.section === 'case_crown'),
        'case-bezel': validationErrors.some(e => e.section === 'case_bezel'),
        'case-bezel-insert': validationErrors.some(e => e.section === 'case_bezel_insert'),
        'case-glass': validationErrors.some(e => e.section === 'case_glass'),
        'bracelet-main': validationErrors.some(e => e.section === 'bracelet'),
        'bracelet-clasp': validationErrors.some(e => e.section === 'bracelet_clasp'),
        'bracelet-end-links': validationErrors.some(e => e.section === 'bracelet_link'),
        'dial-main': validationErrors.some(e => e.section === 'dial'),
        'dial-index': validationErrors.some(e => e.section === 'dial_index'),
        'dial-hands': validationErrors.some(e => e.section === 'dial_hands'),
        movement: validationErrors.some(e => e.section === 'movement'),
        'technical-weight': validationErrors.some(e => e.section === 'technical_weight'),
        'technical-movement': validationErrors.some(e => e.section === 'technical_movement'),
        'technical-waterproofing': validationErrors.some(e => e.section === 'technical_waterproofing'),
        'technical-joints': validationErrors.some(e => e.section === 'technical_joint'),
        'technical-lubrification': validationErrors.some(e => e.section === 'technical_lubrification'),
        'technical-rust-corrosion': validationErrors.some(e => e.section === 'technical_rust_corrosion'),
        value: validationErrors.some(e => e.section === 'value'),
        history: validationErrors.some(e => e.section === 'history'),
        repair: validationErrors.some(e => e.section === 'repair'),
        documents: validationErrors.some(e => e.field === 'documents'),
        'general-comment': validationErrors.some(e => e.field === 'general_comment'),
    };

    const categoryHasErrors = (categoryId: string): boolean => {
        const category = categories.find(c => c.id === categoryId);
        if (!category) return false;
        if (category.subcategories) {
            return category.subcategories.some(sub => categoryErrorMap[sub.id]);
        }
        return categoryErrorMap[categoryId] ?? false;
    };

    const navigateToFirstError = () => {
        const orderedIds = categories.flatMap(c => c.subcategories ? c.subcategories.map(s => s.id) : [c.id]);
        const firstErrorId = orderedIds.find(id => categoryErrorMap[id]);
        if (!firstErrorId) return;

        const parentCategory = categories.find(c => c.subcategories?.some(s => s.id === firstErrorId));
        if (parentCategory) {
            setExpandedCategories(prev => new Set([...prev, parentCategory.id]));
        }
        setSelectedCategory(firstErrorId);
    };

    const toggleCategory = (categoryId: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId);
        } else {
            newExpanded.add(categoryId);
        }
        setExpandedCategories(newExpanded);
    };

    const handleCategoryClick = (categoryId: string, hasSubcategories: boolean) => {
        if (hasSubcategories) {
            toggleCategory(categoryId);
        } else {
            setSelectedCategory(categoryId);
        }
    };

    const renderContent = () => {
        switch (selectedCategory) {
            case "general": return <PartnerCertificationReportGeneralModal certificateTypes={certificateTypes} objectBrands={objectBrands} objectModels={objectModels} objectReferences={objectReferences} objectTypes={objectTypes} />;
            case "accessories": return <PartnerCertificationReportAccessoriesModal certificateTypes={certificateTypes} />;
            case "case-main": return <PartnerCertificationReportCaseModal certificateTypes={certificateTypes} />;
            case "case-back": return <PartnerCertificationReportCaseBackModal certificateTypes={certificateTypes} />;
            case "case-crown": return <PartnerCertificationReportCaseCrownModal certificateTypes={certificateTypes} />;
            case "case-bezel": return <PartnerCertificationReportCaseBezelModal certificateTypes={certificateTypes} />;
            case "case-bezel-insert": return <PartnerCertificationReportCaseBezelInsertModal certificateTypes={certificateTypes} />;
            case "case-glass": return <PartnerCertificationReportCaseGlassModal certificateTypes={certificateTypes} />;
            case "bracelet-main": return <PartnerCertificationReportBraceletModal certificateTypes={certificateTypes} />;
            case "bracelet-clasp": return <PartnerCertificationReportBraceletClaspModal certificateTypes={certificateTypes} />;
            case "bracelet-end-links": return <PartnerCertificationReportBraceletEndLinksModal certificateTypes={certificateTypes} />;
            case "dial-main": return <PartnerCertificationReportDialModal certificateTypes={certificateTypes} />;
            case "dial-index": return <PartnerCertificationReportDialIndexModal certificateTypes={certificateTypes} />;
            case "dial-hands": return <PartnerCertificationReportDialHandsModal certificateTypes={certificateTypes} />;
            case "movement": return <PartnerCertificationReportMovementModal certificateTypes={certificateTypes} />;
            case "technical-weight": return <PartnerCertificationReportTechnicalWeightModal certificateTypes={certificateTypes} />;
            case "technical-movement": return <PartnerCertificationReportTechnicalMovementModal certificateTypes={certificateTypes} />;
            case "technical-waterproofing": return <PartnerCertificationReportTechnicalWaterproofingModal certificateTypes={certificateTypes} />;
            case "technical-rust-corrosion": return <PartnerCertificationReportTechnicalRustCorrosionModal certificateTypes={certificateTypes} />;
            case "technical-joints": return <PartnerCertificationReportTechnicalJointsModal certificateTypes={certificateTypes} />;
            case "technical-lubrification": return <PartnerCertificationReportTechnicalLubrificationModal certificateTypes={certificateTypes} />;
            case "value": return <PartnerCertificationReportValueModal certificateTypes={certificateTypes} />;
            case "history": return <PartnerCertificationReportHistoryModal certificateTypes={certificateTypes} />;
            case "repair": return <PartnerCertificationReportRepairModal certificateTypes={certificateTypes} />;
            case "documents": return <PartnerCertificationReportDocumentsModal certificateTypes={certificateTypes} />;
            case "general-comment": return <PartnerCertificationReportGeneralCommentModal certificateTypes={certificateTypes} />;
            default: return null;
        }
    };

    const cleanAttributes = (data: Record<string, any>): Record<string, any> => {
        const cleaned: Record<string, any> = {};
        Object.entries(data).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '') return;
            if (Array.isArray(value)) { if (value.length > 0) cleaned[key] = value; return; }
            if (typeof value === 'object') {
                const hasValues = Object.values(value).some(v => v !== null && v !== undefined && v !== '');
                if (hasValues) cleaned[key] = value;
                return;
            }
            cleaned[key] = value;
        });
        return cleaned;
    };

    const saveReportData = async (markCompleted: boolean) => {
        const objectId = selectedCertificate?.object?.id!;

        if (deletedPaths.length > 0) {
            await supabase.storage.from('object_attributes').remove(deletedPaths);
        }

        const uploadedPaths: Record<string, string[]> = {};
        for (const entry of pendingFiles) {
            if (!entry.files.length) continue;
            uploadedPaths[entry.fieldName] = [];
            for (let i = 0; i < entry.files.length; i++) {
                const file = entry.files[i];
                const path = `${objectId}/${entry.fieldName}/${Date.now()}_${i}_${file.name}`;
                const result = await uploadFile('object_attributes', path, file);
                uploadedPaths[entry.fieldName].push(result.path);
            }
        }

        const formData = getAllFormData();
        const mergedFormData: Record<string, any> = { ...formData };
        for (const [field, paths] of Object.entries(uploadedPaths)) {
            if (paths.length) mergedFormData[field] = paths;
        }

        const { general_object_brand, general_object_model, general_object_reference, general_object_serial_number, general_object_year, general_object_surname, general_object_status, ...attributes } = mergedFormData;

        await supabase.from('objects').update({
            brand: general_object_brand || undefined,
            model: general_object_model || undefined,
            reference: general_object_reference || undefined,
            serial_number: general_object_serial_number || undefined,
            year_manufacture: general_object_year || undefined,
            surname: general_object_surname || undefined,
            status: general_object_status || ObjectStatus.Valid,
            updated_at: new Date()
        }).eq('id', objectId);

        const deletedImageFields = pendingFiles
            .filter(({ files, existingPaths }) => files.length === 0 && existingPaths.length === 0)
            .map(({ fieldName }) => fieldName);

        const cleanedAttributes = cleanAttributes(attributes);
        const cleanedWithUploads = { ...cleanedAttributes, ...uploadedPaths };

        const { data: existing } = await supabase.from('object_attributes').select('id, attributes').eq('object_id', objectId).maybeSingle();

        if (existing) {
            const finalAttributes = {
                ...(existing.attributes as Record<string, any> || {}),
                ...cleanedWithUploads,
                ...Object.fromEntries(deletedImageFields.map(f => [f, []]))
            };
            await supabase.from('object_attributes').update({ attributes: finalAttributes, updated_at: new Date() }).eq('object_id', objectId);
        } else {
            await supabase.from('object_attributes').insert({ object_id: objectId, attributes: cleanedWithUploads, updated_at: new Date() });
        }

        await updateCertificate(selectedCertificate?.id!, {
            status: markCompleted ? CertificateStatus.Completed : CertificateStatus.PendingCertification,
            completed_at: markCompleted ? new Date() : undefined,
            updated_at: new Date(),
        });

        clearPendingFiles();

        return {
            ...cleanedWithUploads,
            ...Object.fromEntries(deletedImageFields.map(f => [f, []]))
        };
    };

    const handleSave = async () => {
        if (!selectedCertificate) return;
        setIsSaving(true);
        try {
            const cleaned = await saveReportData(false);
            loadInitialData(cleaned);
            toast.success("Rapport sauvegardé avec succès");
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de la sauvegarde");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveAndFinish = async () => {
        if (!selectedCertificate) return;
        const { isValid } = await validateReport();
        if (!isValid) return;

        setIsSavingAndFinishing(true);
        try {
            const cleaned = await saveReportData(true);
            loadInitialData(cleaned);
            resetFormData();
            toast.success("Rapport sauvegardé et terminé avec succès");
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de la sauvegarde");
        } finally {
            setIsSavingAndFinishing(false);
        }
    };

    const handleCancel = () => {
        clearValidationErrors();
        resetFormData();
        onClose();
    };

    return (
        <div className='fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-5'>
            <div className='bg-[#0a0a0a] border border-white/10 rounded-xl w-full max-w-5xl relative h-[700px]'>
                <div className='absolute top-0 left-0 right-0 p-5 border-b border-white/10 bg-[#0a0a0a] rounded-t-xl z-10'>
                    <div className='flex items-center justify-between'>
                        <h1 className='text-white text-xl font-semibold'>Rapport de Certification</h1>
                        <button type="button" onClick={handleCancel} className='text-gray hover:text-white transition-colors duration-200 p-2 hover:bg-white/5 rounded-xl'>
                            <FaX size={14} />
                        </button>
                    </div>
                </div>

                <div className={`absolute left-0 right-0 flex transition-all ${hasErrors() ? 'top-[73px] bottom-[117px]' : 'top-[73px] bottom-[73px]'}`}>

                    <div className='w-64 border-r border-white/10 overflow-y-auto h-full shrink-0'>
                        <ul className='p-3 grid gap-0.5'>
                            {categories.map((category: Category) => (
                                <li key={category.id}>
                                    <div
                                        className={`cursor-pointer w-full flex items-center gap-2 rounded-lg transition-colors px-3 py-2 ${selectedCategory === category.id && !category.subcategories
                                            ? 'bg-green text-black'
                                            : 'text-white hover:bg-white/5'
                                            }`}
                                        onClick={() => handleCategoryClick(category.id, !!category.subcategories)}>

                                        <span className="shrink-0 opacity-70">{category.icon}</span>

                                        <span className="flex-1 text-sm text-left leading-tight">{category.name}</span>

                                        {hasErrors() && categoryHasErrors(category.id) && (
                                            <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-red-500" />
                                        )}
                                        {category.subcategories && (
                                            <span className="shrink-0 text-neutral-500">
                                                {expandedCategories.has(category.id)
                                                    ? <FiChevronDown size={14} />
                                                    : <FiChevronRight size={14} />}
                                            </span>
                                        )}
                                    </div>

                                    {category.subcategories && expandedCategories.has(category.id) && (
                                        <ul className='mt-0.5 mb-1'>
                                            {category.subcategories.map((subcategory: SubCategory) => (
                                                <li
                                                    key={subcategory.id}
                                                    className={`cursor-pointer rounded-lg transition-colors px-3 py-1.5 ml-5 flex items-center gap-2 ${selectedCategory === subcategory.id
                                                        ? 'bg-green text-black'
                                                        : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                                                        }`}
                                                    onClick={() => setSelectedCategory(subcategory.id)}>
                                                    <span className="flex-1 text-xs leading-tight">{subcategory.name}</span>
                                                    {hasErrors() && categoryErrorMap[subcategory.id] && (
                                                        <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-red-500" />
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className='flex-1 overflow-y-auto h-full'>
                        <div className='p-5'>
                            {renderContent()}
                        </div>
                    </div>
                </div>

                <div className='space-y-3 absolute bottom-0 left-0 right-0 p-5 border-t border-white/10 bg-[#0a0a0a] rounded-b-xl'>
                    {hasErrors() && (
                        <div className="flex items-center justify-between bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
                            <span className="text-red-400 text-sm">
                                {validationErrors.length} champ{validationErrors.length > 1 ? 's' : ''} requis manquant{validationErrors.length > 1 ? 's' : ''}
                            </span>
                            <button
                                type="button"
                                onClick={navigateToFirstError}
                                className="text-red-400 text-xs underline hover:text-red-300 transition-colors">
                                Aller à la première erreur
                            </button>
                        </div>
                    )}
                    <div className='flex flex-col lg:flex-row lg:justify-between gap-3 w-full'>
                        <Button onClick={handleCancel} disabled={isSaving} theme='secondary' className='lg:w-max'>
                            Annuler
                        </Button>
                        <div className='grid grid-cols-2 gap-3'>
                            <Button theme='secondary' onClick={handleSave} disabled={isSaving}>
                                {isSaving ? <><span className='animate-spin'>⏳</span><span>Enregistrement...</span></> : 'Enregistrer'}
                            </Button>
                            <Button theme='primary' onClick={handleSaveAndFinish} disabled={isSavingAndFinishing}>
                                {isSavingAndFinishing ? <><span className='animate-spin'>⏳</span><span>Enregistrement...</span></> : 'Confirmer la certification'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnerCertificationReportModal;