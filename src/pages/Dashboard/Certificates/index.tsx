import CertificateCard from '@/components/Dashboard/Cards/Certificate';
import CertificateStatCard from '@/components/Dashboard/Cards/Certificate/Stat';
import { Button } from '@/components/UI/Button';
import Loading from '@/components/UI/Loading';
import Modal from '@/components/UI/Modal';
import useAuth from '@/contexts/AuthContext'
import { useCertificateDrafts, useCustomerCertificates } from '@/hooks/useSupabase';
import { CertificateStatus } from '@/types/certificate.d';
import routes from '@/utils/routes';
import { useState, type FC } from 'react';
import { Navigate } from 'react-router-dom';

const CertificatesPage: FC = () => {
    const { user, isLoadingUser } = useAuth();
    const { certificateDrafts } = useCertificateDrafts(true, { customerEmail: user?.email });
    const { certificates, isLoading: isLoadingCertificates } = useCustomerCertificates(true, { customerId: user?.id });

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);


    if (isLoadingUser || isLoadingCertificates) {
        return <Loading />
    }

    if (!user) {
        return <Navigate to={routes.Login} replace />
    }

    const handleShowCreateModal = () => {
        setIsModalOpen(true);
    }

    const handleCloseCreateModal = async () => {
        setIsModalOpen(false);
    }

    // const renderModalContent = () => {
    //     switch (draft.current_step) {
    //         case .CustomerInfos:
    //             return <PartnerCertificationCustomerInfosModal />;
    //         case PartnerCertificateStep.ObjectInfos:
    //             return (
    //                 <PartnerCertificationObjectInfosModal
    //                     objectTypes={objectTypes}
    //                     objectBrands={objectBrands}
    //                     objectModels={objectModels}
    //                     objectReferences={objectReferences}
    //                 />
    //             );
    //         case PartnerCertificateStep.Service:
    //             return <PartnerCertificationServiceModal certificateTypes={certificateTypes} />;
    //         case PartnerCertificateStep.Payment:
    //             return (
    //                 <PartnerCertificationPaymentModal
    //                     certificateTypes={certificateTypes}
    //                     paymentMethods={paymentMethods}
    //                     setIsModalOpen={setIsModalOpen}
    //                     setIsConfirmPaymentModalOpen={setIsConfirmPaymentModalOpen}
    //                     onSuccess={handleRefreshData}
    //                 />
    //             );
    //         default:
    //             return null;
    //     }
    // };

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
                    <Button className='lg:w-max bg-emerald-600 hover:bg-emerald-500 text-white py-3 px-6 rounded-xl font-bold uppercase transition-all' onClick={handleShowCreateModal}>
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

{/* 
            {isModalOpen && (
                <Modal
                    title="Créer un certificat"
                    content={renderModalContent()}
                    onClose={handleCloseCreateModal}
                />
            )} */}
        </div>
    )
}

export default CertificatesPage