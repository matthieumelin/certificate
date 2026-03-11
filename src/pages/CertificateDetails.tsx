import Timeline from '@/components/Dashboard/Timeline';
import Loading from '@/components/UI/Loading';
import { Button } from '@/components/UI/Button';
import useAuth from '@/contexts/AuthContext';
import { useCertificates } from '@/hooks/useSupabase';
import routes from '@/utils/routes';
import { convertHistoryToTimeline } from '@/utils/timeline';
import { useEffect, useState, type FC, type ReactNode } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { LiaSearchPlusSolid } from "react-icons/lia";
import title from '@/utils/title';
import Modal from '@/components/UI/Modal';
import { appName } from '@/main';
import * as Yup from "yup";
import type { Certificate } from '@/types/certificate.d';
import { Form, Formik, type FormikHelpers } from 'formik';
import Input from '@/components/UI/Form/Input';
import FormGroup from '@/components/UI/Form/Group';
import Label from '@/components/UI/Form/Label';
import { BsFillFileLockFill } from 'react-icons/bs';

interface CertificateInfoProps {
    label: string;
    value: string | number | ReactNode;
}

interface CertificateInfoRowProps {
    children: ReactNode;
}

interface PinFormValues {
    pin: string;
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

const PinSchema = Yup.object({
    pin: Yup.string()
        .min(3, "Le code pin doit contenir au moins 3 caractères")
        .max(4, "Le code pin doit contenir au maximum 4 caractères")
        .required("Le code pin est requis")
});

const maskSerialNumber = (serialNumber: string): string => {
    if (!serialNumber || serialNumber === 'N/A') return serialNumber;
    if (serialNumber.length <= 4) return serialNumber;
    const first = serialNumber.slice(0, 2);
    const last = serialNumber.slice(-2);
    const masked = 'X'.repeat(serialNumber.length - 4);
    return `${first}${masked}${last}`;
};

const CertificateDetailsPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { user
    } = useAuth();
    const { unlockCertificateWithPin, getPublicCertificate } = useCertificates();

    const [certificate, setCertificate] = useState<Certificate>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [objectPhotoModal, setObjectPhotoModal] = useState<boolean>(false);
    const [pinModal, setPinModal] = useState<boolean>(false);
    const [unlockedFields, setUnlockedFields] = useState<any>({}); // TODO: change any by interface

    if (!id) {
        return <Navigate to={routes.NotFound} />
    }

    const handleUnlock = async (values: PinFormValues, helpers: FormikHelpers<PinFormValues>) => {
        try {
            const data = await unlockCertificateWithPin(id, values.pin);
            setUnlockedFields(data);
            setPinModal(false);
            helpers.resetForm();
        } catch {
            helpers.setFieldError("pin", "Code pin invalide");
        } finally {
            helpers.setSubmitting(false);
        }
    }

    useEffect(() => {
        const loadCertificate = async () => {
            try {
                setIsLoading(true);
                const data = await getPublicCertificate(id);

                if (!data) {
                    navigate(routes.NotFound);
                    return;
                }

                setCertificate(data);
            } catch (error) {
                console.error('Error loading certificate:', error);
            } finally {
                setIsLoading(false);
            }
        }

        loadCertificate();
    }, [id]);


    if (isLoading || !certificate) {
        return <Loading />
    }

    const isOwner = user && user.id === certificate.customer_id;

    const serialNumberValue = certificate.object?.serial_number
        ? isOwner
            ? certificate.object.serial_number
            : maskSerialNumber(certificate.object.serial_number)
        : 'N/A';

    const timelimeItems = convertHistoryToTimeline([], []);

    const isUnlocked = 'customer' in unlockedFields;

    const getField = (maskedValue: unknown, unlockedValue?: unknown): ReactNode => {
        if (isUnlocked) {
            return (unlockedValue !== null && unlockedValue !== undefined && unlockedValue !== '')
                ? unlockedValue as string
                : 'N/A';
        }
        if (isOwner) {
            return (maskedValue !== null && maskedValue !== undefined && maskedValue !== '')
                ? maskedValue as string
                : 'N/A';
        }
        if (maskedValue === null) {
            return (
                <button type="button" onClick={() => setPinModal(true)}
                    className='text-emerald-500 text-xs font-bold hover:text-emerald-400 transition-colors'>
                    Afficher
                </button>
            );
        }
        return 'N/A';
    };

    return (
        <div>
            <title>{title(`Certificat #${id}`)}</title>

            <div className='p-5 lg:p-8'>
                <Link to={routes.Home}>
                    <img className='max-w-16' src="/logo.png" alt={appName} />
                </Link>

                <div className='my-8'>
                    <h1 className='text-white text-3xl font-light mb-1'>
                        Certificat <span className='text-emerald-500 font-bold'>#{id}</span>
                    </h1>
                    <p className='text-neutral-400 italic'>Détails et informations du certificat</p>
                </div>

                <div className='space-y-8'>
                    <div className='bg-black/40 backdrop-blur-sm border border-emerald-900/30 rounded-2xl p-6'>
                        <div className='flex flex-col lg:flex-row gap-6'>
                            {certificate.object?.object_photos && (
                                <div
                                    onClick={() => setObjectPhotoModal(true)}
                                    className='group relative cursor-pointer border border-emerald-900/30 rounded-xl p-3 hover:border-emerald-500/50 transition-all lg:w-48 h-40 shrink-0'
                                >
                                    <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center'>
                                        <LiaSearchPlusSolid className='text-4xl text-emerald-400' />
                                    </div>
                                    <img
                                        className='rounded-lg w-full h-full object-cover'
                                        src={certificate.object?.photo_url}
                                        alt={`${certificate.object?.brand} ${certificate.object?.model} ${certificate.object?.reference}`}
                                    />
                                </div>
                            )}

                            <div className='flex-1'>
                                <h2 className='text-2xl text-white font-bold mb-4'>
                                    {certificate.object?.brand} {certificate.object?.model} {certificate.object?.reference}
                                </h2>
                                <div className='space-y-2'>
                                    {/* <div className='flex items-center gap-2'>
                                        <span className='text-emerald-400/60 text-sm uppercase font-bold'>Numéro :</span>
                                        <span className='text-white font-medium'>#{id}</span>
                                    </div> */}
                                    <div className='flex items-center gap-2'>
                                        <span className='text-emerald-400/60 text-sm uppercase font-bold'>Type :</span>
                                        <span className='text-white font-medium'>{certificate.type?.name || 'N/A'}</span>
                                    </div>
                                    {/* <div className='flex items-center gap-2'>
                                        <span className='text-emerald-400/60 text-sm uppercase font-bold'>Statut :</span>
                                        <span className='text-white font-medium'>{getCertificateStatusLabel(certificate.status || 'N/A')}</span>
                                        {certificate.type?.verification_status && (
                                            <span className={`${certificate.type?.verification_status === CertificateTypeVerificationStatus.Registered ||
                                                certificate.type?.verification_status === CertificateTypeVerificationStatus.Verified ? "text-red-500 border-red-500" : "text-emerald-500 border-emerald-500"} border rounded-full px-3 py-1 text-xs font-bold uppercase`}>
                                                {getCertificateTypeVerificationStatus(certificate.type?.verification_status)}
                                            </span>
                                        )}
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='bg-black/40 backdrop-blur-sm border border-emerald-900/30 rounded-2xl p-6'>
                        <h3 className='text-xl text-white font-light mb-6'>
                            <span className='text-emerald-500 font-bold'>Identification</span> de l'objet
                        </h3>
                        <div className='space-y-4'>
                            <CertificateInfo label="Type d'objet" value={certificate.object?.object_type?.label || "N/A"} />
                            <CertificateInfoRow>
                                <CertificateInfo label="Marque" value={certificate.object?.brand || 'N/A'} />
                                <CertificateInfo label="Modèle" value={certificate.object?.model || 'N/A'} />
                                <CertificateInfo label="Référence" value={certificate.object?.reference || "N/A"} />
                                <CertificateInfo label="Surnom" value={certificate.object?.surname || "N/A"} />
                            </CertificateInfoRow>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='p-4 bg-emerald-900/10 rounded-xl border border-emerald-900/30'>
                                    <div className='text-emerald-400/60 text-xs uppercase font-bold mb-2'>Numéro de série</div>
                                    <div className='flex items-center gap-2'>
                                        <span className={`font-medium tracking-wider ${!isOwner && !unlockedFields?.object?.serial_number && certificate.object?.serial_number ? 'text-neutral-400' : 'text-white'}`}>
                                            {unlockedFields?.object?.serial_number ?? serialNumberValue}
                                        </span>
                                        {!isOwner && !unlockedFields?.object?.serial_number && certificate.object?.serial_number && certificate.object.serial_number !== 'N/A' && (
                                            <button
                                                type="button"
                                                onClick={() => setPinModal(true)}
                                                className='text-emerald-500 text-xs font-bold hover:text-emerald-400 transition-colors'
                                            >
                                                Afficher
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <CertificateInfo label="Année de fabrication" value={certificate.object?.year_manufacture || "N/A"} />
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
                                    <CertificateInfo label="Prénom" value={certificate.customer?.first_name || "N/A"} />
                                    <CertificateInfo label="Nom" value={getField(certificate.customer?.last_name, unlockedFields?.customer?.last_name)} />
                                    <CertificateInfo label="Téléphone" value={getField(certificate.customer?.phone, unlockedFields?.customer?.phone)} />
                                    <CertificateInfo label="Email" value={getField(certificate.customer?.email, unlockedFields?.customer?.email)} />
                                </CertificateInfoRow>
                                <CertificateInfoRow>
                                    <CertificateInfo label="Adresse" value={getField(certificate.customer?.address, unlockedFields?.customer?.address)} />
                                    <CertificateInfo label="Ville" value={getField(certificate.customer?.city, unlockedFields?.customer?.city)} />
                                    <CertificateInfo label="Pays" value={getField(certificate.customer?.country, unlockedFields?.customer?.country)} />
                                    <CertificateInfo label="Code postal" value={getField(certificate.customer?.postal_code, unlockedFields?.customer?.postal_code)} />
                                </CertificateInfoRow>
                                <CertificateInfoRow>
                                    <CertificateInfo label="Société" value={getField(certificate.customer?.society, unlockedFields?.customer?.society)} />
                                    <CertificateInfo label="Numéro de TVA" value={getField(certificate.customer?.vat_number, unlockedFields?.customer?.vat_number)} />
                                </CertificateInfoRow>
                            </div>
                        </div>
                    )}
                    <div className='bg-black/40 backdrop-blur-sm border border-emerald-900/30 rounded-2xl p-6'>
                        <div className='flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-6'>
                            <h3 className='text-xl text-white font-light'>
                                <span className='text-emerald-500 font-bold'>Historique</span> de l'objet
                            </h3>
                        </div>
                        {certificate.history ? (
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
                            {certificate.object?.photo_url ? (
                                <img
                                    src={certificate.object?.photo_url}
                                    className='max-w-full max-h-[600px] mx-auto rounded-xl'
                                    alt="Object"
                                />
                            ) : <p className='text-neutral-400 italic'>Photo indisponible</p>}
                        </div>
                    )}
                    onClose={() => setObjectPhotoModal(false)}
                />
            )}

            {pinModal && (
                <Modal
                    title={(
                        <div className='flex items-center gap-2'>
                            <BsFillFileLockFill size={32} className='text-emerald-500' />
                            Veuillez entrer votre code pin
                        </div>
                    )}
                    content={(
                        <div>
                            <p className='text-neutral-400 italic'>Votre code pin lié à ce certificat vous a été transmis par mail ou indiqué au dos de votre carte physique</p>
                            <Formik
                                initialValues={{ pin: "" }}
                                validationSchema={PinSchema}
                                onSubmit={handleUnlock}>
                                {({ isSubmitting, values, setFieldValue }) => (
                                    <Form className='mt-4'>
                                        <div className='space-y-4'>
                                            <FormGroup>
                                                <Label htmlFor='pin' label='Code pin' required />
                                                <Input
                                                    id="pin"
                                                    name="pin"
                                                    type='text'
                                                    value={values.pin}
                                                    onChange={(e) => setFieldValue("pin", e.target.value.toUpperCase())}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Button
                                                    type='submit'
                                                    disabled={isSubmitting || !values.pin}>
                                                    {isSubmitting ? "Vérification..." : "Confirmer"}
                                                </Button>
                                            </FormGroup>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    )}
                    onClose={() => setPinModal(false)} />
            )}
        </div>
    )
}

export default CertificateDetailsPage