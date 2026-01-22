import Timeline from '@/components/Dashboard/Timeline';
import Loading from '@/components/UI/Loading';
import { Button } from '@/components/UI/Button';
import useAuth from '@/contexts/AuthContext';
import { useCertificateInspections, useCertificates } from '@/hooks/useSupabase';
import routes from '@/utils/routes';
import { convertHistoryToTimeline } from '@/utils/timeline';
import { getCertificateStatusLabel } from '@/helpers/translations';
import { useEffect, useState, type FC, type ReactNode } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { LiaSearchPlusSolid } from "react-icons/lia";
import title from '@/utils/title';
import Modal from '@/components/UI/Modal';
import { FaArrowLeft } from 'react-icons/fa';

interface CertificateInfoProps {
    label: string;
    value: string | number;
}

interface CertificateInfoRowProps {
    children: ReactNode;
}

const CertificateInfo: FC<CertificateInfoProps> = ({ label, value }) => {
    return (
        <div className='p-4 bg-emerald-900/10 rounded-xl border border-emerald-900/30'>
            <div className='text-emerald-400/60 text-xs uppercase font-bold mb-2'>{label}</div>
            <div className='text-white font-medium'>{value}</div>
        </div>
    )
}

const CertificateInfoRow: FC<CertificateInfoRowProps> = ({ children }) => {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {children}
        </div>
    )
}

const CertificateDetailsPage: FC = () => {
    const { id } = useParams<{ id: string }>();

    const { user, isLoadingUser } = useAuth();
    const { getCertificateById } = useCertificates(false);
    const { getCertificateInspection, getCertificateInspectionPhotoSignedUrl } = useCertificateInspections();

    const [certificate, setCertificate] = useState<any>(); // TODO: change any by interface
    const [objectPhotoModal, setObjectPhotoModal] = useState<boolean>(false);

    if (!id) {
        return <Navigate to={routes.NotFound} />
    }

    useEffect(() => {
        const loadCertificate = async () => {
            try {
                const certificateData = await getCertificateById(id);
                const certificateInspectionData = await getCertificateInspection(id);

                let signedCertificationInspectionPhoto = null;

                if (certificateInspectionData && certificateInspectionData.photos) {
                    const photos = certificateInspectionData.photos;
                    const certificateInspectionPhoto = photos[0] ?? null;

                    if (certificateInspectionPhoto) {
                        signedCertificationInspectionPhoto = await getCertificateInspectionPhotoSignedUrl(certificateInspectionPhoto);
                    }
                }

                const loadedCertificateData = {
                    ...certificateData,
                    object: {
                        ...certificateData.object,
                        photo_url: signedCertificationInspectionPhoto,
                    }
                };

                setCertificate(loadedCertificateData);
            } catch (error) {
                console.error('Error loading certificate:', error);
            }
        }

        loadCertificate();
    }, [id]);

    if (isLoadingUser || !certificate) {
        return <Loading />
    }

    if (!user) {
        return <Navigate to={routes.Login} />
    }

    const timelimeItems = convertHistoryToTimeline([], []);

    return (
        <div>
            <title>{title(`Certificat #${id}`)}</title>

            <div className='p-5 lg:p-8'>
                <div className='flex items-center gap-4 mb-8'>
                    <button
                        type='button'
                        onClick={() => window.history.back()}
                        className='w-10 h-10 flex items-center justify-center rounded-xl bg-black/40 border border-emerald-900/30 hover:border-emerald-500/50 transition-all text-white'
                    >
                        <FaArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className='text-white text-3xl font-light mb-1'>
                            Certificat <span className='text-emerald-500 font-bold'>#{id}</span>
                        </h1>
                        <p className='text-neutral-400 italic'>Détails et informations du certificat</p>
                    </div>
                </div>

                <div className='space-y-8'>
                    <div className='bg-black/40 backdrop-blur-sm border border-emerald-900/30 rounded-2xl p-6'>
                        <div className='flex flex-col lg:flex-row gap-6'>
                            {certificate.object.photo_url && (
                                <div
                                    onClick={() => setObjectPhotoModal(true)}
                                    className='group relative cursor-pointer border border-emerald-900/30 rounded-xl p-3 hover:border-emerald-500/50 transition-all lg:w-48 shrink-0'
                                >
                                    <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center'>
                                        <LiaSearchPlusSolid className='text-4xl text-emerald-400' />
                                    </div>
                                    <img
                                        className='rounded-lg w-full h-full object-cover'
                                        src={certificate.object.photo_url}
                                        alt={`${certificate.object.brand} ${certificate.object.model} ${certificate.object.reference}`}
                                    />
                                </div>
                            )}

                            <div className='flex-1'>
                                <h2 className='text-2xl text-white font-bold mb-4'>
                                    {certificate.object.brand} {certificate.object.model} {certificate.object.reference}
                                </h2>
                                <div className='space-y-2'>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-emerald-400/60 text-sm uppercase font-bold'>Numéro :</span>
                                        <span className='text-white font-medium'>#{id}</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-emerald-400/60 text-sm uppercase font-bold'>Type :</span>
                                        <span className='text-white font-medium'>{certificate.certificate_type.name || 'N/A'}</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-emerald-400/60 text-sm uppercase font-bold'>Statut :</span>
                                        <span className='text-white font-medium'>{getCertificateStatusLabel(certificate.status || 'N/A')}</span>
                                        {!certificate?.verification_status && (
                                            <span className='border border-red-500 text-red-500 rounded-full px-3 py-1 text-xs font-bold uppercase'>
                                                Non certifié
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='bg-black/40 backdrop-blur-sm border border-emerald-900/30 rounded-2xl p-6'>
                        <h3 className='text-xl text-white font-light mb-6'>
                            <span className='text-emerald-500 font-bold'>Identification</span> de l'objet
                        </h3>
                        <div className='space-y-4'>
                            <CertificateInfo label="Type d'objet" value={certificate.object.object_type.label || "N/A"} />
                            <CertificateInfoRow>
                                <CertificateInfo label="Marque" value={certificate.object.brand || 'N/A'} />
                                <CertificateInfo label="Modèle" value={certificate.object.model || 'N/A'} />
                                <CertificateInfo label="Référence" value={certificate.object.reference || "N/A"} />
                                <CertificateInfo label="Surnom" value={certificate.object.nick_name || "N/A"} />
                            </CertificateInfoRow>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <CertificateInfo label="Numéro de série" value={certificate.object.serial_number || "N/A"} />
                                <CertificateInfo label="Année de fabrication" value={certificate.object.manufacture || "N/A"} />
                            </div>
                        </div>
                    </div>

                    {certificate.customer && (
                        <div className='bg-black/40 backdrop-blur-sm border border-emerald-900/30 rounded-2xl p-6'>
                            <h3 className='text-xl text-white font-light mb-6'>
                                <span className='text-emerald-500 font-bold'>Propriétaire</span> actuel
                            </h3>
                            <div className='space-y-4'>
                                <CertificateInfoRow>
                                    <CertificateInfo label="Prénom" value={certificate.customer.first_name || "N/A"} />
                                    <CertificateInfo label="Nom" value={certificate.customer.last_name || "N/A"} />
                                    <CertificateInfo label="Téléphone" value={certificate.customer.phone || "N/A"} />
                                    <CertificateInfo label="Email" value={certificate.customer.email || "N/A"} />
                                </CertificateInfoRow>
                                <CertificateInfoRow>
                                    <CertificateInfo label="Adresse" value={certificate.customer.address || "N/A"} />
                                    <CertificateInfo label="Ville" value={certificate.customer.city || "N/A"} />
                                    <CertificateInfo label="Pays" value={certificate.customer.country || "N/A"} />
                                    <CertificateInfo label="Code postal" value={certificate.customer.postal_code || "N/A"} />
                                </CertificateInfoRow>
                                <CertificateInfoRow>
                                    <CertificateInfo label="Société" value={certificate.customer.society || "N/A"} />
                                    <CertificateInfo label="Numéro de TVA" value={certificate.customer.vat_number || "N/A"} />
                                </CertificateInfoRow>
                            </div>
                        </div>
                    )}

                    <div className='bg-black/40 backdrop-blur-sm border border-emerald-900/30 rounded-2xl p-6'>
                        <div className='flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-6'>
                            <h3 className='text-xl text-white font-light'>
                                <span className='text-emerald-500 font-bold'>Historique</span> de l'objet
                            </h3>
                            {/* <Button className='bg-emerald-600 hover:bg-emerald-500 text-white py-3 px-6 rounded-xl font-bold uppercase transition-all'>
                                Ajouter un historique
                            </Button> */}
                        </div>
                        {certificate.object.history ? (
                            <div className='space-y-6'>
                                <Timeline items={timelimeItems} />
                                <Button className='bg-emerald-600 hover:bg-emerald-500 text-white py-3 px-6 rounded-xl font-bold uppercase transition-all'>
                                    Voir l'historique complet
                                </Button>
                            </div>
                        ) : (
                            <div className='text-center py-12'>
                                <div className='text-6xl mb-4'>📋</div>
                                <p className='text-neutral-400 italic'>L'objet associé au certificat ne possède aucun historique.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {objectPhotoModal && (
                <Modal
                    title="Photo de l'objet"
                    content={(
                        <div className='p-4'>
                            <img
                                src={certificate.object.photo_url}
                                className='max-w-full mx-auto rounded-xl'
                                alt="Object"
                            />
                        </div>
                    )}
                    onClose={() => setObjectPhotoModal(false)}
                />
            )}
        </div>
    )
}

export default CertificateDetailsPage