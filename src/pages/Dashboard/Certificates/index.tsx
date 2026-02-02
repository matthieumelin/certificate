import CertificateCard from '@/components/Dashboard/Cards/Certificate';
import CertificateStatCard from '@/components/Dashboard/Cards/Certificate/Stat';
import ClientCertificationCustomerInfosModal from '@/components/Dashboard/Modals/Certification/Client/Infos/Customer';
import ClientCertificationObjectInfosModal from '@/components/Dashboard/Modals/Certification/Client/Infos/Object';
import ClientCertificationPaymentModal from '@/components/Dashboard/Modals/Certification/Client/Payment';
import ClientCertificationServiceModal from '@/components/Dashboard/Modals/Certification/Client/Service';
import { Button } from '@/components/UI/Button';
import Loading from '@/components/UI/Loading';
import Modal from '@/components/UI/Modal';
import useAuth from '@/contexts/AuthContext'
import { useCertificateDrafts, useCertificateTypes, useCustomerCertificates, useObjectBrands, useObjectModels, useObjectReferences, useObjectTypes, usePaymentMethods } from '@/hooks/useSupabase';
import { useClientCertificateStore } from '@/stores/certification/clientCertificateStore';
import { CertificateStatus, ClientCertificateStep } from '@/types/certificate.d';
import routes from '@/utils/routes';
import { useState, type FC } from 'react';
import { Navigate } from 'react-router-dom';

const CertificatesPage: FC = () => {
    const { user, isLoadingUser } = useAuth();
    const { certificateDrafts } = useCertificateDrafts(true, { customerEmail: user?.email });
    const { certificates, isLoading: isLoadingCertificates } = useCustomerCertificates(true, { customerId: user?.id });
    const { certificateTypes } = useCertificateTypes();
    const { objectTypes } = useObjectTypes();
    const { objectModels } = useObjectModels();
    const { objectBrands } = useObjectBrands();
    const { objectReferences } = useObjectReferences();
    const { paymentMethods } = usePaymentMethods();

    const { draft, clearDraft } = useClientCertificateStore();

    const [isNewCertificationModalOpen, setIsNewCertificationModalOpen] = useState<boolean>(false);

    const handleShowNewCertificateModal = () => {
        clearDraft();
        setIsNewCertificationModalOpen(true);
    }

    const handleCloseNewCertificationModal = () => {
        setIsNewCertificationModalOpen(false);
    }

    const renderModalContent = () => {
        switch (draft.current_step) {
            case ClientCertificateStep.CustomerInfos:
                return <ClientCertificationCustomerInfosModal />;
            case ClientCertificateStep.ObjectInfos:
                return (
                    <ClientCertificationObjectInfosModal
                        objectTypes={objectTypes}
                        objectBrands={objectBrands}
                        objectModels={objectModels}
                        objectReferences={objectReferences}
                    />
                );
            case ClientCertificateStep.Service:
                return <ClientCertificationServiceModal certificateTypes={certificateTypes} />;
            case ClientCertificateStep.Payment:
                return (
                    <ClientCertificationPaymentModal
                        certificateTypes={certificateTypes}
                        paymentMethods={paymentMethods}
                        setIsModalOpen={setIsNewCertificationModalOpen}
                        setIsConfirmPaymentModalOpen={() => { }}
                        onSuccess={() => { }}
                    />
                );
            default:
                return null;
        }
    };

    if (isLoadingUser || isLoadingCertificates) {
        return <Loading />
    }

    if (!user) {
        return <Navigate to={routes.Login} replace />
    }

    const totalCertificates = certificates.length;
    const activeCertificates = certificates.filter(certificate => certificate.status === CertificateStatus.Completed);
    const pendingCertificates = certificates.filter(certificate => certificate.status === CertificateStatus.PendingCertification).length;
    const draftCertificates = certificateDrafts.length;

    return (
        <div>
            <div className='p-5 lg:p-8'>
                <div className='mb-8 lg:flex lg:items-center lg:justify-between space-y-4'>
                    <div>
                        <h1 className='text-white text-3xl lg:text-4xl font-light mb-2'>
                            Mes <span className='text-emerald-500 font-bold'>certificats</span>
                        </h1>
                        <p className='text-neutral-400 italic'>Gérez et consultez vos certificats en un coup d'œil</p>
                    </div>
                    <Button
                        onClick={handleShowNewCertificateModal}
                        className='lg:w-max bg-emerald-600 hover:bg-emerald-500 text-white py-3 px-6 rounded-xl font-bold uppercase transition-all'>
                        Nouvelle certification
                    </Button>
                </div>

                <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
                    <CertificateStatCard label='Total' value={totalCertificates} />
                    <CertificateStatCard label='Actifs' value={activeCertificates.length} />
                    <CertificateStatCard label='En vérification' value={pendingCertificates} />
                    <CertificateStatCard label='Brouillons' value={draftCertificates} />
                </div>

                {certificates && certificates.length > 0 ? (
                    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {certificates.map(certificate => (
                            <CertificateCard
                                key={certificate.id}
                                variant="customer"
                                certificate={certificate}
                                setIsModalOpen={() => { }}
                                setIsInspectionModalOpen={() => { }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-black/40 backdrop-blur-sm border border-emerald-900/30 rounded-2xl p-12 text-center">
                        <div className="text-6xl mb-4">📋</div>
                        <h3 className="text-white text-xl font-light mb-2">
                            Aucun <span className="text-emerald-500 font-bold">certificat</span>
                        </h3>
                        <p className="text-neutral-400 italic">Vos certificats apparaîtront ici une fois créés</p>
                    </div>
                )}
            </div>

            {isNewCertificationModalOpen && (
                <Modal
                    title="Nouvelle certification"
                    content={renderModalContent()}
                    onClose={handleCloseNewCertificationModal}
                />
            )}
        </div>
    )
}

export default CertificatesPage