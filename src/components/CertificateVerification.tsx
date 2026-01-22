import { useState, type FC } from 'react';
import { useCertificateVerification } from '@/hooks/useSupabase';
import { FaCheckCircle, FaTimesCircle, FaClock, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import { CertificateStatus } from '@/types/certificate.d';
import { formatDate } from '@/helpers/date';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface VerificationResult {
    exists: boolean;
    status?: CertificateStatus;
    certificate_id?: string;
    created_at?: string;
    certificate_type?: string;
    object_type?: string;
    brand?: string;
    model?: string;
    reference?: string;
    message?: string;
}

const validationSchema = Yup.object({
    certificateId: Yup.string()
        .required('Le numéro de certificat est requis')
        .trim()
});

const CertificateVerification: FC = () => {
    const [result, setResult] = useState<VerificationResult | null>(null);
    const { verifyCertificate, isLoading } = useCertificateVerification();

    const formik = useFormik({
        initialValues: {
            certificateId: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const data = await verifyCertificate(values.certificateId);
                setResult(data);
            } catch (error) {
                console.error('Erreur de vérification:', error);
            }
        }
    });

    const handleClearInput = () => {
        formik.setFieldValue('certificateId', '');
        setResult(null);
    };

    const handleCloseResult = () => {
        setResult(null);
    };

    const getStatusInfo = (status?: CertificateStatus) => {
        switch (status) {
            case CertificateStatus.Completed:
                return {
                    icon: <FaCheckCircle className="text-emerald-500 text-4xl" />,
                    title: 'Certificat Authentique',
                    description: 'Ce certificat est valide et complet',
                    bgColor: 'bg-emerald-900/20',
                    borderColor: 'border-emerald-500/50',
                };
            case CertificateStatus.InspectionCompleted:
            case CertificateStatus.PendingCertification:
                return {
                    icon: <FaClock className="text-yellow-500 text-4xl" />,
                    title: 'Certificat en Cours',
                    description: 'Ce certificat est en cours de traitement',
                    bgColor: 'bg-yellow-900/20',
                    borderColor: 'border-yellow-500/50',
                };
            case CertificateStatus.Cancelled:
                return {
                    icon: <FaTimesCircle className="text-red-500 text-4xl" />,
                    title: 'Certificat Annulé',
                    description: 'Ce certificat a été annulé',
                    bgColor: 'bg-red-900/20',
                    borderColor: 'border-red-500/50',
                };
            case CertificateStatus.PendingPayment:
            case CertificateStatus.PaymentConfirmed:
                return {
                    icon: <FaExclamationTriangle className="text-orange-500 text-4xl" />,
                    title: 'Paiement en Attente',
                    description: 'Le paiement de ce certificat est en cours de traitement',
                    bgColor: 'bg-orange-900/20',
                    borderColor: 'border-orange-500/50',
                };
            default:
                return {
                    icon: <FaExclamationTriangle className="text-neutral-500 text-4xl" />,
                    title: 'Statut Inconnu',
                    description: 'Le statut de ce certificat est inconnu',
                    bgColor: 'bg-neutral-900/20',
                    borderColor: 'border-neutral-500/50',
                };
        }
    };

    const getStatusLabel = (status?: CertificateStatus) => {
        switch (status) {
            case CertificateStatus.Completed:
                return { label: 'Complété', color: 'text-emerald-400' };
            case CertificateStatus.InspectionCompleted:
                return { label: 'Inspection terminée', color: 'text-yellow-400' };
            case CertificateStatus.PendingCertification:
                return { label: 'En attente de certification', color: 'text-yellow-400' };
            case CertificateStatus.Cancelled:
                return { label: 'Annulé', color: 'text-red-400' };
            case CertificateStatus.PendingPayment:
                return { label: 'Paiement en attente', color: 'text-orange-400' };
            case CertificateStatus.PaymentConfirmed:
                return { label: 'Paiement confirmé', color: 'text-orange-400' };
            default:
                return { label: 'Inconnu', color: 'text-neutral-400' };
        }
    };

    return (
        <div className="bg-linear-to-br from-emerald-900/20 to-[#0a1410] border border-emerald-500/30 rounded-[60px] p-12 md:p-24 text-center relative overflow-hidden group">
            <div className="absolute -left-24 -top-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>

            <div className="relative z-10">
                <div className="flex justify-center mb-10 text-emerald-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                </div>

                <h2 className="text-3xl md:text-5xl font-light text-white mb-6">Vérifier l'authenticité</h2>
                <p className="text-neutral-400 mb-12 italic text-lg">Vérifiez l'ID du certificat avant tout achat.</p>

                <form onSubmit={formik.handleSubmit} className="w-full max-w-xl mx-auto flex flex-col sm:flex-row gap-4 mb-12">
                    <div className="relative grow">
                        <input
                            type="text"
                            name="certificateId"
                            value={formik.values.certificateId}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Entrez le numéro du certificat..."
                            className="w-full bg-[#050a08]/80 border border-emerald-900/50 rounded-2xl px-8 py-5 pr-12 text-white focus:outline-none focus:border-emerald-500 transition-all font-medium"
                            disabled={isLoading}
                        />
                        {formik.values.certificateId && (
                            <button
                                type="button"
                                onClick={handleClearInput}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                                disabled={isLoading}
                            >
                                <FaTimes size={18} />
                            </button>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || !formik.values.certificateId.trim()}
                        className="bg-emerald-600 text-white px-8 py-5 rounded-2xl font-bold uppercase hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Vérification...
                            </>
                        ) : (
                            <>
                                Vérifier
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14" />
                                    <path d="m12 5 7 7-7 7" />
                                </svg>
                            </>
                        )}
                    </button>
                </form>

                {result && (
                    <div className="max-w-2xl mx-auto mb-8">
                        {result.exists ? (
                            (() => {
                                const statusInfo = getStatusInfo(result.status);
                                const statusLabel = getStatusLabel(result.status);

                                return (
                                    <div className={`rounded-3xl p-8 border-2 ${statusInfo.bgColor} ${statusInfo.borderColor} relative`}>
                                        <button
                                            onClick={handleCloseResult}
                                            className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
                                        >
                                            <FaTimes size={24} />
                                        </button>

                                        <div className="flex items-center gap-4 mb-6">
                                            {statusInfo.icon}
                                            <div className="text-left">
                                                <h3 className="text-2xl font-bold text-white">
                                                    {statusInfo.title}
                                                </h3>
                                                <p className="text-neutral-400 text-sm">
                                                    ID: {result.certificate_id}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-4 bg-black/30 rounded-2xl p-3 md:p-6">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="text-left">
                                                    <p className="text-emerald-400/60 text-xs uppercase font-bold mb-1">Statut</p>
                                                    <p className={`font-bold ${statusLabel.color}`}>{statusLabel.label}</p>
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-emerald-400/60 text-xs uppercase font-bold mb-1">Type de certificat</p>
                                                    <p className="text-white font-medium">{result.certificate_type || 'N/A'}</p>
                                                </div>
                                            </div>

                                            <div className="text-left">
                                                <p className="text-emerald-400/60 text-xs uppercase font-bold mb-1">Date de création</p>
                                                <p className="text-white font-medium">
                                                    {result.created_at ? formatDate(result.created_at) : 'N/A'}
                                                </p>
                                            </div>

                                            <div className="border-t border-emerald-900/30 pt-4 text-left">
                                                <p className="text-emerald-400/60 text-xs uppercase font-bold mb-3">Informations de l'objet</p>
                                                <div className="space-y-2">
                                                    <div className="flex flex-col md:flex-row justify-between">
                                                        <span className="text-neutral-400">Type:</span>
                                                        <span className="text-white font-medium">{result.object_type || 'N/A'}</span>
                                                    </div>
                                                    {result.brand && (
                                                        <div className="flex flex-col md:flex-row justify-between">
                                                            <span className="text-neutral-400">Marque:</span>
                                                            <span className="text-white font-medium">{result.brand}</span>
                                                        </div>
                                                    )}
                                                    {result.model && (
                                                        <div className="flex flex-col md:flex-row justify-between">
                                                            <span className="text-neutral-400">Modèle:</span>
                                                            <span className="text-white font-medium">{result.model}</span>
                                                        </div>
                                                    )}
                                                    {result.reference && (
                                                        <div className="flex flex-col md:flex-row justify-between">
                                                            <span className="text-neutral-400">Référence:</span>
                                                            <span className="text-white font-medium">{result.reference}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-neutral-400 text-sm italic mt-4 text-left">
                                            {statusInfo.description}
                                        </p>
                                    </div>
                                );
                            })()
                        ) : (
                            <div className="bg-red-900/20 border-2 border-red-500/50 rounded-3xl p-8 relative">
                                <button
                                    onClick={handleCloseResult}
                                    className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
                                >
                                    <FaTimes size={24} />
                                </button>

                                <div className="flex items-center gap-4">
                                    <FaTimesCircle className="text-red-500 text-4xl" />
                                    <div className="text-left">
                                        <h3 className="text-2xl font-bold text-white">Certificat Introuvable</h3>
                                        <p className="text-neutral-400 mt-2">
                                            Aucun certificat ne correspond à cet identifiant. Veuillez vérifier le numéro saisi.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <a href="#" className="inline-block mt-12 text-emerald-400 border-b border-emerald-400/20 pb-1 uppercase font-black hover:border-emerald-400 transition-all">
                    Accéder à la page de recherche complète
                </a>
            </div>
        </div>
    );
};

export default CertificateVerification;