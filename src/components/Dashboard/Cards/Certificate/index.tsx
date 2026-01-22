import { useState, useEffect, type FC, type MouseEvent } from 'react';
import { toast } from 'react-toastify';
import { useCertificateStore } from '@/stores/certificateStore';
import { useCertificateReportStore } from '@/stores/certificateReportStore';
import { useNavigate } from 'react-router-dom';
import routes from '@/utils/routes';
import { Button } from '@/components/UI/Button';
import Modal from '@/components/UI/Modal';
import { CertificateInspectionResult, CertificateStatus, CertificateVerificationStatus, PartnerCertificateStep, type Certificate, type CertificateDraft, type CertificateInspection, type CertificateType } from '@/types/certificate.d';
import { useCertificateDrafts, useCertificateInspections, useCertificates } from '@/hooks/useSupabase';
import { UserProfileRole } from '@/types/user.d';
import Alert from '@/components/UI/Alert';
import { getUserProfileRoleLabel } from '@/helpers/translations';
import { useApi } from '@/hooks/useApi';

interface CertificateCardProps {
    draft?: CertificateDraft;
    certificateTypes?: CertificateType[];
    certificate?: Certificate;
    variant?: 'partner' | 'customer';
    onResendPaymentLink?: () => void;
    setIsModalOpen: (value: boolean) => void;
    setIsInspectionModalOpen: (value: boolean) => void;
    onStartReport?: () => void;
    onDeleteSuccess?: () => void;
}

interface StatusConfig {
    bg: string;
    text: string;
    label: string;
    icon?: string;
}

const CertificateCard: FC<CertificateCardProps> = ({
    draft,
    certificateTypes,
    certificate,
    variant = 'partner',
    onResendPaymentLink,
    setIsModalOpen,
    setIsInspectionModalOpen,
    onStartReport,
    onDeleteSuccess,
}) => {
    const navigate = useNavigate();

    const { request } = useApi();

    const { clearDraft, setDraft } = useCertificateStore();
    const { setSelectedCertificate } = useCertificateReportStore();

    const { deleteCertificateDraft, getCertificateDraftById } = useCertificateDrafts(false);
    const { deleteCertificate } = useCertificates(false);
    const { getCertificateInspection } = useCertificateInspections();

    const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
    const [certificateInspection, setCertificateInspection] = useState<CertificateInspection | null>(null);

    const isDraft = !!draft;
    const item = draft || certificate;

    const customerData =
        variant === 'partner'
            ? isDraft
                ? draft.customer_data
                : certificate?.customer
            : null;

    const handleStartInspection = () => {
        setIsInspectionModalOpen(true);
        if (certificate) setSelectedCertificate(certificate);
    }

    const handleViewCertificate = () => {
        navigate(routes.Dashboard.Certificates.Details.replace(':id', `${certificate?.id}`))
    }

    const handleDownloadCertificate = () => {

    }

    const handleRetryPayment = async () => {
    }

    const handleResumeDraft = async () => {
        if (!draft) {
            toast.error("Erreur lors de la récupération des données du brouillon");
            return;
        }

        try {
            const { data, error } = await getCertificateDraftById(draft.id);

            if (error || !data) {
                toast.error("Erreur lors du chargement du brouillon");
                return;
            }

            const currentStep = data.current_step || PartnerCertificateStep.CustomerInfos;

            setDraft({
                ...data,
                current_step: currentStep,
            });

            setIsModalOpen(true);
        } catch (error) {
            console.error("Erreur chargement draft:", error);
            toast.error("Erreur lors du chargement du brouillon");
        }
    }

    const handleDeleteDraft = async (draftId: string) => {
        try {
            const response = await request('/cancel-checkout-session', {
                method: 'POST',
                body: {
                    draftId
                }
            })

            if (response.success) {
                const isDraftDeleted = await deleteCertificateDraft(draftId);

                if (isDraftDeleted) {
                    if (draft?.id === draftId) {
                        clearDraft();
                    }

                    onDeleteSuccess?.();
                    toast.success("Brouillon supprimé");
                }
            }
        } catch (error) {
            console.error("Erreur suppression draft:", error);
            toast.error("Erreur lors de la suppression");
        }
    }

    const handleDeleteCertificate = async (id: string) => {
        try {
            const isCertificateDeleted = await deleteCertificate(id);

            if (isCertificateDeleted) {
                toast.success("Certificat supprimé");
            }
        } catch (error) {
            console.error("Erreur suppression certificat:", error);
            toast.error("Erreur lors de la suppression");
        }
    }

    if (!item) return null;

    const handleDeleteClick = (event: MouseEvent) => {
        event.stopPropagation();
        setShowDeleteConfirm(true);
    }

    const handleConfirmDelete = () => {
        if (isDraft && draft.id) {
            handleDeleteDraft(draft.id);
        } else if (certificate) {
            handleDeleteCertificate(certificate.id);
        }

        setShowDeleteConfirm(false);
    }

    const getInspectionStatusBadge = (status?: CertificateInspectionResult) => {
        if (!status) return null;

        const statusConfig = {
            [CertificateInspectionResult.AuthenticItem]: {
                bg: 'bg-emerald-600',
                text: 'text-white',
                label: 'Object authentique',
            },
            [CertificateInspectionResult.InauthenticItem]: {
                bg: 'bg-red-500',
                text: 'text-white',
                label: 'Object inauthentique',
            },
        };

        const config: StatusConfig = statusConfig[status];
        if (!config) {
            return (
                <span className="bg-neutral-600 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase w-fit">
                    Statut inconnu
                </span>
            );
        }

        return (
            <span className={`${config.bg} ${config.text} px-3 py-1.5 rounded-full text-xs font-bold uppercase flex items-center gap-1.5 w-fit`}>
                <span>{config.icon}</span>
                <span>{config.label}</span>
            </span>
        );
    }

    const getStatusBadge = (status?: CertificateStatus) => {
        if (isDraft) {
            const paymentLinkSent = draft?.payment_link_sent;

            return (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-neutral-600 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase flex items-center gap-1.5 w-fit">
                        <span>📝</span>
                        <span>Brouillon</span>
                    </span>
                    {paymentLinkSent && (
                        <span className="bg-yellow-500 text-black px-3 py-1.5 rounded-full text-xs font-bold uppercase flex items-center gap-1.5 w-fit">
                            <span>⏳</span>
                            <span>Paiement en attente</span>
                        </span>
                    )}
                </div>
            );
        }

        if (!status) return null;

        const statusConfig = {
            [CertificateStatus.PendingCertification]: {
                bg: 'bg-orange-500',
                text: 'text-white',
                label: 'En attente de certification',
                icon: '⏳'
            },
            [CertificateStatus.PendingPayment]: {
                bg: 'bg-yellow-500',
                text: 'text-black',
                label: 'En attente de paiement',
                icon: '⏳'
            },
            [CertificateStatus.PaymentConfirmed]: {
                bg: 'bg-emerald-600',
                text: 'text-white',
                label: 'Paiement confirmé',
                icon: '💳'
            },
            [CertificateStatus.InspectionCompleted]: {
                bg: 'bg-emerald-600',
                text: 'text-white',
                label: 'Inspection complétée',
                icon: '🔍'
            },
            [CertificateStatus.Completed]: {
                bg: 'bg-emerald-600',
                text: 'text-white',
                label: 'Complété',
                icon: '✅'
            },
            [CertificateStatus.Cancelled]: {
                bg: 'bg-red-500',
                text: 'text-white',
                label: 'Annulé',
                icon: '❌'
            },
        };

        const config: StatusConfig = statusConfig[status];
        if (!config) {
            return (
                <span className="bg-neutral-600 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase w-fit">
                    Statut inconnu
                </span>
            );
        }

        return (
            <span className={`${config.bg} ${config.text} px-3 py-1.5 rounded-full text-xs font-bold uppercase flex items-center gap-1.5 w-fit`}>
                <span>{config.icon}</span>
                <span>{config.label}</span>
            </span>
        );
    };

    const getVerificationBadge = (verificationStatus?: CertificateVerificationStatus) => {
        if (!verificationStatus) return null;

        const verificationConfig = {
            [CertificateVerificationStatus.Registered]: {
                icon: '📋',
                label: 'Enregistré',
                color: 'text-neutral-400'
            },
            [CertificateVerificationStatus.Authenticated]: {
                icon: '✅',
                label: 'Authentifié',
                color: 'text-blue-400'
            },
            [CertificateVerificationStatus.Certified]: {
                icon: '🏆',
                label: 'Certifié',
                color: 'text-emerald-400'
            },
        };

        const config = verificationConfig[verificationStatus];
        return (
            <span className={`${config.color} text-sm font-bold flex items-center gap-1.5`}>
                <span>{config.icon}</span>
                <span>{config.label}</span>
            </span>
        );
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: "numeric"
        });
    };

    useEffect(() => {
        if (!certificate) return;

        const fetchCertificateInspection = async () => {
            const fetchedCertificateInspection = await getCertificateInspection(certificate.id);
            if (fetchedCertificateInspection) {
                setCertificateInspection(fetchedCertificateInspection);
            }
        }
        fetchCertificateInspection();
    }, [certificate])

    const canDelete = isDraft ||
        (certificate?.status === CertificateStatus.PendingPayment);

    const certificateType = certificateTypes?.find((ct: CertificateType) => item.certificate_type_id === ct.id);

    const isPartner = variant === 'partner';
    const isCustomer = variant === 'customer';

    return (
        <div className="h-full">
            <div className="h-full rounded-2xl bg-black/40 backdrop-blur-sm border border-emerald-900/30 hover:border-emerald-500/50 transition-all flex flex-col">
                <div className='p-6 shrink-0'>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            {!isDraft && certificate?.verification_status && (
                                <div className="text-right">
                                    {getVerificationBadge(certificate.verification_status)}
                                </div>
                            )}
                            <h3 className="text-white font-bold text-lg">
                                {isDraft ? `Brouillon #${item.id}` : `Certificat #${item.id}`}
                            </h3>
                        </div>
                        {isPartner && canDelete && (
                            <button
                                onClick={handleDeleteClick}
                                className="text-neutral-400 hover:text-red-400 transition-colors"
                                title="Supprimer"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <div className='flex flex-wrap gap-2'>
                        {getStatusBadge(certificate?.status)}
                        {getInspectionStatusBadge(certificateInspection?.result)}
                    </div>

                    {isPartner && customerData && (
                        <div className='mt-6 p-4 bg-emerald-900/10 rounded-xl border border-emerald-900/30'>
                            <h3 className='text-emerald-400/60 text-xs uppercase font-bold mb-2'>Informations du client</h3>
                            <ul className='space-y-1'>
                                <li className="text-white font-medium">
                                    {customerData.first_name} {customerData.last_name}
                                </li>
                                <li className="text-neutral-400 text-sm">
                                    {customerData.email}
                                </li>
                                <li className="text-neutral-400 text-sm">
                                    {customerData.society || "Aucune société"}
                                </li>
                                <li className="text-neutral-400 text-sm">
                                    {customerData.vat_number || "Aucun numéro de TVA"}
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                <div className='p-6 border-t border-emerald-900/30 grow flex flex-col'>
                    <div className='grow space-y-4'>
                        <div className='grid grid-cols-2 gap-4'>
                            {certificateType && (
                                <div className='flex flex-col'>
                                    <span className="text-xs text-emerald-400/60 uppercase font-bold mb-1">Type de certificat</span>
                                    <span className="text-sm text-white font-medium">{certificateType?.name}</span>
                                </div>
                            )}
                            {item.created_at && (
                                <div className='flex flex-col'>
                                    <span className="text-xs text-emerald-400/60 uppercase font-bold mb-1">Créé le</span>
                                    <span className="text-sm text-white font-medium">{formatDate(item.created_at)}</span>
                                </div>
                            )}
                            {item.updated_at && (
                                <div className='flex flex-col'>
                                    <span className="text-xs text-emerald-400/60 uppercase font-bold mb-1">Mis à jour le</span>
                                    <span className="text-sm text-white font-medium">{formatDate(item.updated_at)}</span>
                                </div>
                            )}
                        </div>
                        {certificate?.creator?.role === UserProfileRole.Partner && (
                            <p className='text-sm text-neutral-400'>
                                Créé par : <span className='text-emerald-400 font-medium'>{getUserProfileRoleLabel(certificate.creator?.role)}</span>
                            </p>
                        )}
                    </div>

                    <div className="mt-4 shrink-0">
                        {isPartner && (
                            <>
                                {isDraft && !draft?.payment_link_sent && (
                                    <Button
                                        onClick={handleResumeDraft}
                                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold uppercase transition-all"
                                    >
                                        Reprendre
                                    </Button>
                                )}

                                {isDraft && draft?.payment_link_sent && (
                                    <div className='space-y-2'>
                                        {onResendPaymentLink && draft?.stripe_session_id && (
                                            <Button
                                                onClick={onResendPaymentLink}
                                                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold uppercase transition-all"
                                            >
                                                📧 Renvoyer le lien
                                            </Button>
                                        )}
                                        <Button
                                            onClick={handleResumeDraft}
                                            className="w-full bg-black/40 border border-emerald-900/30 hover:border-emerald-500/50 text-white py-3 rounded-xl font-bold uppercase transition-all"
                                        >
                                            ✏️ Modifier
                                        </Button>
                                    </div>
                                )}

                                {certificate?.status === CertificateStatus.PendingPayment && (
                                    <Button
                                        onClick={handleRetryPayment}
                                        className="w-full bg-yellow-600 hover:bg-yellow-500 text-white py-3 rounded-xl font-bold uppercase transition-all"
                                    >
                                        Finaliser le paiement
                                    </Button>
                                )}

                                {certificate?.status === CertificateStatus.PendingCertification && (
                                    <Button
                                        onClick={onStartReport}
                                        className="w-full bg-yellow-600 hover:bg-yellow-500 text-white py-3 rounded-xl font-bold uppercase transition-all"
                                    >
                                        Finaliser la certification
                                    </Button>
                                )}

                                {certificate?.status === CertificateStatus.InspectionCompleted &&
                                    certificateInspection?.result === CertificateInspectionResult.AuthenticItem && (
                                        <Button
                                            onClick={onStartReport}
                                            className='w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold uppercase transition-all'>
                                            Démarrer la certification
                                        </Button>
                                    )}

                                {certificate?.status === CertificateStatus.PaymentConfirmed && (
                                    <Button
                                        onClick={handleStartInspection}
                                        className='w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold uppercase transition-all'>
                                        Démarrer l'inspection
                                    </Button>
                                )}
                            </>
                        )}

                        {isCustomer && (
                            <>
                                {certificate?.status === CertificateStatus.Completed && (
                                    <div className='grid md:grid-cols-2 gap-3'>
                                        <Button
                                            onClick={handleViewCertificate}
                                            className="w-full bg-black/40 border border-emerald-900/30 hover:border-emerald-500/50 text-white py-3 rounded-xl font-bold uppercase transition-all"
                                        >
                                            Voir
                                        </Button>
                                        <Button
                                            onClick={handleDownloadCertificate}
                                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold uppercase transition-all"
                                        >
                                            Télécharger
                                        </Button>
                                    </div>
                                )}

                                {certificate?.status !== CertificateStatus.Completed && (
                                    <Alert type='info' message='Ce certificat est en cours de traitement par le partenaire.' />
                                )}
                            </>
                        )}

                        {certificate?.status === CertificateStatus.Completed && isPartner && (
                            <div className='grid md:grid-cols-2 gap-3'>
                                <Button
                                    onClick={handleViewCertificate}
                                    className="w-full bg-black/40 border border-emerald-900/30 hover:border-emerald-500/50 text-white py-3 rounded-xl font-bold uppercase transition-all"
                                >
                                    Voir
                                </Button>
                                <Button
                                    onClick={handleDownloadCertificate}
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold uppercase transition-all"
                                >
                                    Télécharger
                                </Button>
                            </div>
                        )}

                        {certificate?.status === CertificateStatus.Cancelled && (
                            <div className="text-center text-neutral-400 text-sm py-2 italic">
                                Certificat annulé
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showDeleteConfirm && (
                <Modal
                    title={isDraft ? 'Supprimer le brouillon ?' : 'Supprimer le certificat ?'}
                    description={`Cette action est irréversible. ${isDraft ? 'Le brouillon' : 'Le certificat'} #${item.id} sera définitivement supprimé.`}
                    onClose={() => setShowDeleteConfirm(false)}
                    content={(
                        <div className='flex flex-col lg:flex-row gap-4'>
                            <Button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="bg-black/40 border border-emerald-900/30 hover:border-emerald-500/50 text-white py-3 rounded-xl font-bold uppercase transition-all">
                                Annuler
                            </Button>
                            <Button
                                onClick={handleConfirmDelete}
                                className="bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-bold uppercase transition-all">
                                Supprimer
                            </Button>
                        </div>
                    )}
                />
            )}
        </div>
    );
};

export default CertificateCard;