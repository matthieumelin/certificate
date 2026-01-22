import Loading from '@/components/UI/Loading';
import { useApi } from '@/hooks/useApi';
import routes from '@/utils/routes';
import { useEffect, useState, type FC } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PaymentPage: FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { request } = useApi();

    const [isVerifying, setIsVerifying] = useState(true);
    const [paymentVerified, setPaymentVerified] = useState(false);

    useEffect(() => {
        const verifyPayment = async () => {
            const sessionId = searchParams.get('session_id');

            if (!sessionId) {
                console.error('❌ Pas de session_id');
                toast.error('Session invalide');
                setIsVerifying(false);
                return;
            }

            try {
                const response = await request('/verify-payment', {
                    method: 'POST',
                    body: { sessionId },
                });

                if (response.success) {
                    console.log('✅ Paiement vérifié', response);
                    setPaymentVerified(true);
                } else {
                    console.warn('⚠️ Paiement non confirmé', response.message);
                    setPaymentVerified(false);
                    toast.error(response.message || 'Paiement non confirmé');
                }
            } catch (error) {
                console.error('Erreur vérification paiement:', error);
                setPaymentVerified(false);
                toast.error('Erreur lors de la vérification du paiement');
            } finally {
                setIsVerifying(false);
            }
        };

        verifyPayment();
    }, [searchParams]);

    useEffect(() => {
        if (!isVerifying) {
            const timeout = setTimeout(() => {
                navigate(routes.Dashboard.Certificates.Main);
            }, paymentVerified ? 2000 : 4000);
            return () => clearTimeout(timeout);
        }
    }, [isVerifying, paymentVerified, navigate]);

    if (isVerifying) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Loading />
                <p className="text-white mt-4">Vérification du paiement...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-5">
            {paymentVerified ? (
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-4">✅</div>
                    <h1 className="text-white text-3xl font-bold mb-2">
                        Paiement confirmé !
                    </h1>
                    <p className="text-gray-300 mb-4">
                        Le certificat a été créé avec succès. Un email avec vos informations
                        de connexion a été envoyé si nécessaire.
                    </p>
                    <p className="text-neutral-400 text-sm">
                        Redirection automatique dans quelques secondes...
                    </p>
                </div>
            ) : (
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-4">❌</div>
                    <h1 className="text-white text-3xl font-bold mb-2">
                        Paiement non confirmé
                    </h1>
                    <p className="text-gray-300 mb-4">
                        Une erreur s'est produite lors de la vérification du paiement.
                    </p>
                    <p className="text-neutral-400 text-sm">
                        Redirection automatique dans quelques secondes...
                    </p>
                </div>
            )}
        </div>
    );
};

export default PaymentPage;
