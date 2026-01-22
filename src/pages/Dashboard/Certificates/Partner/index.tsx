import { useState, useMemo } from 'react';
import { LuSearch, LuFilter, LuX } from 'react-icons/lu';
import { Button } from '@/components/UI/Button';
import CertificateCard from '@/components/Dashboard/Cards/Certificate';
import CreateCertificateCard from '@/components/Dashboard/EmptyCertificates';
import {
    type Certificate,
    type CertificateDraft,
    CertificateStatus,
    PartnerCertificateStep
} from '@/types/certificate.d';
import {
    useCertificateDrafts,
    useCertificateTypes,
    usePaymentMethods,
    usePartnerCertificates,
    useObjectTypes,
    useObjectModels,
    useObjectBrands,
    useObjectReferences,
} from '@/hooks/useSupabase';
import useAuth from '@/contexts/AuthContext';
import PartnerCertificationCustomerInfosModal from '@/components/Dashboard/Modals/Certification/Partner/Infos/Customer';
import PartnerCertificationObjectInfosModal from '@/components/Dashboard/Modals/Certification/Partner/Infos/Object';
import PartnerCertificationServiceModal from '@/components/Dashboard/Modals/Certification/Partner/Service';
import PartnerCertificationPaymentModal from '@/components/Dashboard/Modals/Certification/Partner/Payment';
import PartnerCertificationInspectionModal from '@/components/Dashboard/Modals/Certification/Partner/Inspection';
import PartnerCertificationReportModal from '@/components/Dashboard/Modals/Certification/Partner/Report';
import ConfirmInStorePaymentModal from '@/components/Dashboard/Modals/Certification/Partner/Payment/ConfirmInStore';
import { useCertificateStore } from '@/stores/certificateStore';
import { useCertificateReportStore } from '@/stores/certificateReportStore';
import { useCertificateReportFormStore } from '@/stores/certificateReportFormStore';
import { UserProfileRole, type UserProfile } from '@/types/user.d';
import type { Object } from '@/types/object';
import Loading from '@/components/UI/Loading';
import { Navigate } from 'react-router-dom';
import routes from '@/utils/routes';
import title from '@/utils/title';
import Modal from '@/components/UI/Modal';

const PartnerCertificates = () => {
    const { user, isLoadingUser } = useAuth();
    const { certificateDrafts, mutate: mutateCertificateDrafts } = useCertificateDrafts();
    const { certificates: partnerCertificates, mutate: mutatePartnerCertificates } = usePartnerCertificates(user?.id);
    const { certificateTypes } = useCertificateTypes();
    const { objectTypes } = useObjectTypes();
    const { objectModels } = useObjectModels();
    const { objectBrands } = useObjectBrands();
    const { objectReferences } = useObjectReferences();
    const { paymentMethods } = usePaymentMethods();

    const { draft, clearDraft } = useCertificateStore();
    const { setSelectedCertificate } = useCertificateReportStore();
    const { resetFormData } = useCertificateReportFormStore();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isConfirmPaymentModalOpen, setIsConfirmPaymentModalOpen] = useState<boolean>(false);
    const [isInspectionModalOpen, setIsInspectionModalOpen] = useState<boolean>(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

    const [activeTab, setActiveTab] = useState<'all' | 'draft' | CertificateStatus>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [selectedCertificateType, setSelectedCertificateType] = useState<number | 'all'>('all');
    const [selectedObjectType, setSelectedObjectType] = useState<number | 'all'>('all');

    const userCertificateDrafts = certificateDrafts.filter(userCertificateDraft => userCertificateDraft.created_by === user?.id);

    const tabs = [
        { key: 'all' as const, label: 'Tous', icon: '📋', count: partnerCertificates.length + userCertificateDrafts.length },
        { key: 'draft' as const, label: 'Brouillons', icon: '📝', count: userCertificateDrafts.length },
        { key: CertificateStatus.PendingPayment, label: 'En attente', icon: '⏳', count: partnerCertificates.filter(c => c.status === CertificateStatus.PendingPayment).length },
        { key: CertificateStatus.PendingCertification, label: 'En attente de certification', icon: '⏳', count: partnerCertificates.filter(c => c.status === CertificateStatus.PendingCertification).length },
        { key: CertificateStatus.PaymentConfirmed, label: 'Payé', icon: '💳', count: partnerCertificates.filter(c => c.status === CertificateStatus.PaymentConfirmed).length },
        { key: CertificateStatus.InspectionCompleted, label: 'Inspecté', icon: '🔍', count: partnerCertificates.filter(c => c.status === CertificateStatus.InspectionCompleted).length },
        { key: CertificateStatus.Completed, label: 'Complétés', icon: '✅', count: partnerCertificates.filter(c => c.status === CertificateStatus.Completed).length },
        { key: CertificateStatus.Cancelled, label: 'Annulés', icon: '❌', count: partnerCertificates.filter(c => c.status === CertificateStatus.Cancelled).length },
    ];

    const enrichedItems = useMemo(() => {
        let items: Array<{
            type: 'draft' | 'certificate',
            data: CertificateDraft | Certificate,
            customerData?: Partial<UserProfile>,
            objectData?: Object
        }> = [];

        if (activeTab === 'all' || activeTab === 'draft') {
            if (activeTab === 'all' || activeTab === 'draft') {
                items.push(...userCertificateDrafts.map(draft => ({
                    type: 'draft' as const,
                    data: draft,
                    customerData: draft.customer_data
                })));
            }
        }

        const certs = activeTab === 'all'
            ? partnerCertificates
            : partnerCertificates.filter(c => c.status === activeTab);

        items.push(...certs.map(cert => ({
            type: 'certificate' as const,
            data: cert,
            customerData: cert.customer,
            objectData: cert.object
        })));

        return items;
    }, [partnerCertificates, userCertificateDrafts, activeTab]);

    const filteredItems = useMemo(() => {
        return enrichedItems.filter(item => {
            const data = item.data;
            const customerData = item.customerData;
            const objectData = item.objectData;

            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const customerName = `${customerData?.first_name || ''} ${customerData?.last_name || ''}`.toLowerCase();
                const customerEmail = customerData?.email?.toLowerCase() || '';
                const certificateId = data.id.toString();

                if (!customerName.includes(query) &&
                    !customerEmail.includes(query) &&
                    !certificateId.includes(query)) {
                    return false;
                }
            }

            if (selectedCertificateType !== 'all') {
                const typeId = item.type === 'draft'
                    ? (data as CertificateDraft).certificate_type_id
                    : (data as Certificate).certificate_type_id;

                if (typeId !== selectedCertificateType) return false;
            }

            if (selectedObjectType !== 'all') {
                const typeId = item.type === 'draft'
                    ? (data as CertificateDraft).object_type_id
                    : objectData?.type_id;

                if (typeId !== selectedObjectType) return false;
            }

            return true;
        });
    }, [enrichedItems, searchQuery, selectedCertificateType, selectedObjectType]);

    const handleShowCreateModal = () => {
        clearDraft();
        setIsModalOpen(true);
    };

    const handleStartReport = (certificate?: Certificate) => {
        setIsInspectionModalOpen(false);
        setIsReportModalOpen(true);
        if (certificate) setSelectedCertificate(certificate);
    };

    const handleCloseReportModal = () => {
        setIsReportModalOpen(false);
        resetFormData();
    };

    const handleCloseModal = async () => {
        setIsModalOpen(false);
        await Promise.all([
            mutateCertificateDrafts(),
            mutatePartnerCertificates()
        ]);
    }

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCertificateType('all');
        setSelectedObjectType('all');
    };

    const handleRefreshData = async () => {
        await Promise.all([
            mutateCertificateDrafts(),
            mutatePartnerCertificates()
        ]);
    }

    const renderModalContent = () => {
        switch (draft.current_step) {
            case PartnerCertificateStep.CustomerInfos:
                return <PartnerCertificationCustomerInfosModal />;
            case PartnerCertificateStep.ObjectInfos:
                return (
                    <PartnerCertificationObjectInfosModal
                        objectTypes={objectTypes}
                        objectBrands={objectBrands}
                        objectModels={objectModels}
                        objectReferences={objectReferences}
                    />
                );
            case PartnerCertificateStep.Service:
                return <PartnerCertificationServiceModal certificateTypes={certificateTypes} />;
            case PartnerCertificateStep.Payment:
                return (
                    <PartnerCertificationPaymentModal
                        certificateTypes={certificateTypes}
                        paymentMethods={paymentMethods}
                        setIsModalOpen={setIsModalOpen}
                        setIsConfirmPaymentModalOpen={setIsConfirmPaymentModalOpen}
                        onSuccess={handleRefreshData}
                    />
                );
            default:
                return null;
        }
    };

    const hasActiveFilters = searchQuery || selectedCertificateType !== 'all' || selectedObjectType !== 'all';
    const isEmpty = partnerCertificates.length === 0 && userCertificateDrafts.length === 0;

    if (isLoadingUser) {
        return <Loading />
    }

    if (!user) {
        return <Navigate to={routes.Login} replace />
    }
    if (user.role === UserProfileRole.User) {
        return <Navigate to={routes.Dashboard.Main} replace />
    }

    return (
        <div>
            <title>{title('Certificats')}</title>

            <div className="h-screen overflow-y-auto">
                <div className="p-5 lg:p-8">
                    <div className="mb-8">
                        <h1 className="text-white text-3xl lg:text-4xl font-light mb-2">
                            Gestion des <span className="text-emerald-500 font-bold">certificats</span>
                        </h1>
                        <p className="text-neutral-400 italic">Gérez et consultez tous vos certificats en un coup d'œil</p>
                    </div>

                    {isEmpty ? (
                        <div className="h-screen overflow-y-auto">
                            <CreateCertificateCard
                                title="Vous n'avez pas encore créé de certificats."
                                description='Cliquez sur "Créer une certification" pour commencer.'
                                onCreateCertificate={handleShowCreateModal}
                            />
                        </div>
                    ) : (
                        <>
                            <div className="bg-black/40 backdrop-blur-sm border border-emerald-900/30 rounded-2xl p-6 mb-6 space-y-4">
                                <div className="flex flex-col lg:flex-row gap-3">
                                    <div className="flex-1 relative">
                                        <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Rechercher par client, email ou ID..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-[#050a08]/80 border border-emerald-900/50 rounded-xl pl-12 pr-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                                        />
                                    </div>

                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className={`px-6 py-3 rounded-xl border transition-all flex items-center justify-center gap-2 font-bold uppercase text-sm ${hasActiveFilters
                                            ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400'
                                            : 'bg-black/40 border-emerald-900/30 text-neutral-400 hover:border-emerald-500/50'
                                            }`}
                                    >
                                        <LuFilter className="w-5 h-5" />
                                        Filtres
                                        {hasActiveFilters && (
                                            <span className="bg-emerald-500 text-white text-xs w-2 h-2 rounded-full"></span>
                                        )}
                                    </button>

                                    <Button className='lg:w-max bg-emerald-600 hover:bg-emerald-500 text-white py-3 px-6 rounded-xl font-bold uppercase transition-all' onClick={handleShowCreateModal}>
                                        Nouvelle certification
                                    </Button>
                                </div>

                                {showFilters && (
                                    <div className="pt-4 border-t border-emerald-900/30 space-y-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm text-emerald-400/60 uppercase font-bold mb-2">Type de certificat</label>
                                                <select
                                                    value={selectedCertificateType}
                                                    onChange={(e) => setSelectedCertificateType(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                                                    className="w-full bg-[#050a08]/80 border border-emerald-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                                >
                                                    <option value="all">Tous les certificats</option>
                                                    {certificateTypes.map(type => (
                                                        <option key={type.id} value={type.id}>{type.name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm text-emerald-400/60 uppercase font-bold mb-2">Type d'objet</label>
                                                <select
                                                    value={selectedObjectType}
                                                    onChange={(e) => setSelectedObjectType(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                                                    className="w-full bg-[#050a08]/80 border border-emerald-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                                >
                                                    <option value="all">Tous les types</option>
                                                    {objectTypes.map(type => (
                                                        <option key={type.id} value={type.id}>{type.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {hasActiveFilters && (
                                            <button
                                                onClick={clearFilters}
                                                className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-2 font-bold uppercase transition-colors"
                                            >
                                                <LuX className="w-4 h-4" />
                                                Réinitialiser les filtres
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`flex items-center gap-2 px-5 py-3 rounded-xl whitespace-nowrap transition-all font-bold uppercase text-sm ${activeTab === tab.key
                                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                                            : 'bg-black/40 border border-emerald-900/30 text-neutral-400 hover:border-emerald-500/50'
                                            }`}
                                    >
                                        <span>{tab.icon}</span>
                                        <span>{tab.label}</span>
                                        <span className={`text-xs px-2 py-1 rounded-full ${activeTab === tab.key ? 'bg-white/20' : 'bg-emerald-900/20'
                                            }`}>
                                            {tab.count}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {filteredItems.length === 0 ? (
                                <div className="bg-black/40 backdrop-blur-sm border border-emerald-900/30 rounded-2xl p-12 text-center">
                                    <div className="text-6xl mb-4">🔍</div>
                                    <h3 className="text-white text-xl font-light mb-2">
                                        Aucun <span className="text-emerald-500 font-bold">certificat</span> trouvé
                                    </h3>
                                    <p className="text-neutral-400 italic">
                                        {hasActiveFilters ? 'Essayez de modifier vos filtres' : 'Aucun résultat pour cette catégorie'}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="text-sm text-neutral-400 italic">
                                        {filteredItems.length} résultat{filteredItems.length > 1 ? 's' : ''}
                                    </div>

                                    <div className="flex flex-wrap gap-4">
                                        {filteredItems.map((item) => (
                                            <CertificateCard
                                                key={item.type === 'draft' ? `draft-${item.data.id}` : `cert-${item.data.id}`}
                                                draft={item.type === 'draft' ? (item.data as CertificateDraft) : undefined}
                                                certificate={item.type === 'certificate' ? (item.data as Certificate) : undefined}
                                                certificateTypes={certificateTypes}
                                                setIsModalOpen={setIsModalOpen}
                                                setIsInspectionModalOpen={setIsInspectionModalOpen}
                                                onStartReport={item.type === 'certificate' ? () => handleStartReport(item.data as Certificate) : undefined}
                                                onDeleteSuccess={handleRefreshData}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {isModalOpen && (
                    <Modal
                        title="Créer un certificat"
                        content={renderModalContent()}
                        onClose={handleCloseModal}
                    />
                )}

                {isConfirmPaymentModalOpen && (
                    <Modal
                        title="Confirmer le paiement"
                        content={
                            <ConfirmInStorePaymentModal
                                setIsModalOpen={setIsModalOpen}
                                setIsConfirmPaymentModalOpen={setIsConfirmPaymentModalOpen}
                                certificateTypes={certificateTypes}
                                onCancel={() => setIsConfirmPaymentModalOpen(false)}
                                onSuccess={handleRefreshData}
                            />
                        }
                        onClose={() => setIsConfirmPaymentModalOpen(false)}
                    />
                )}

                {isInspectionModalOpen && (
                    <Modal
                        title="Inspection visuelle"
                        content={
                            <PartnerCertificationInspectionModal
                                certificateTypes={certificateTypes}
                                objectBrands={objectBrands}
                                objectModels={objectModels}
                                objectReferences={objectReferences}
                                onStartReport={handleStartReport}
                                onSuccess={handleRefreshData}
                                onClose={() => setIsInspectionModalOpen(false)}
                            />
                        }
                        onClose={() => setIsInspectionModalOpen(false)}
                    />
                )}

                {isReportModalOpen && (
                    <PartnerCertificationReportModal
                        certificateTypes={certificateTypes}
                        objectTypes={objectTypes}
                        objectBrands={objectBrands}
                        objectModels={objectModels}
                        objectReferences={objectReferences}
                        onClose={handleCloseReportModal}
                        onSuccess={handleRefreshData}
                    />
                )}
            </div>
        </div>
    );
};

export default PartnerCertificates;