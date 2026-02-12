import { type FC, useState, useEffect } from 'react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { toast } from 'react-toastify';
import { ClientCertificateStep } from '@/types/certificate.d';
import Steps from '@/components/Dashboard/Steps';
import { Button } from '@/components/UI/Button';
import { useClientCertificateStore } from '@/stores/certification/clientCertificateStore';
import { useProfiles } from '@/hooks/useSupabase';
import { UserProfileRole } from '@/types/user.d';
import Map from '@/components/Map';
import type { UserProfile } from '@/types/user.d';

interface ClientCertificationPartnerProps {
}

const ClientCertificationPartnerModal: FC<ClientCertificationPartnerProps> = ({ }) => {
    const { draft, setDraft } = useClientCertificateStore();
    const { userProfiles, isLoading: isLoadingProfiles } = useProfiles();
    const [selectedPartner, setSelectedPartner] = useState<UserProfile | null>(null);

    const steps = Object.values(ClientCertificateStep);

    const partners = userProfiles.filter(
        profile => profile.role === UserProfileRole.Partner && profile.is_active && !profile.is_deleted
    );

    useEffect(() => {
        if (draft.partner_id && partners.length > 0) {
            const partner = partners.find(p => p.id === draft.partner_id);
            if (partner) {
                setSelectedPartner(partner);
            }
        }
    }, [draft.partner_id, partners]);

    const handlePartnerSelect = (partner: UserProfile) => {
        setSelectedPartner(partner);
    };

    const handleSubmit = () => {
        if (!draft.id || !selectedPartner) {
            toast.error("Veuillez sélectionner un point de contrôle");
            return;
        }

        try {
            setDraft({
                partner_id: selectedPartner.id,
                current_step: ClientCertificateStep.Payment
            });
        } catch (error) {
            console.error("Erreur mise à jour draft:", error);
            toast.error("Erreur lors de la sauvegarde");
        }
    }

    if (isLoadingProfiles) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-white">Chargement des points de contrôle...</div>
            </div>
        );
    }

    if (partners.length === 0) {
        return (
            <div>
                <Steps mode='client' steps={steps} />
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="text-white text-xl">Aucun point de contrôle disponible</div>
                    <p className="text-gray text-center max-w-md">
                        Il n'y a actuellement aucun point de contrôle actif. Veuillez réessayer plus tard.
                    </p>
                    <Button
                        theme="secondary"
                        onClick={() => setDraft({ current_step: ClientCertificateStep.Service })}>
                        <IoIosArrowBack /> Retour
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Steps mode='client' steps={steps} />

            <div className='space-y-6'>
                <div>
                    <h2 className='text-white text-2xl font-semibold'>Choix du point de contrôle</h2>
                    <p className='mt-2 text-gray'>
                        Sélectionnez le point de contrôle où vous souhaitez faire certifier votre objet
                    </p>
                </div>

                <div className='rounded-xl overflow-hidden border border-emerald-900/30'>
                    <div className='h-[600px]'>
                        <Map
                            partners={partners}
                            center={{ lat: 46.603354, lng: 1.888334 }}
                            zoom={6}
                            onPartnerSelect={handlePartnerSelect}
                            selectedPartnerId={selectedPartner?.id}
                        />
                    </div>
                </div>

                {selectedPartner && (
                    <div className='p-6 bg-emerald-900/10 rounded-xl border border-emerald-900/30'>
                        <h3 className='text-white text-lg font-semibold mb-4'>
                            Point de contrôle sélectionné
                        </h3>
                        <div className='space-y-3'>
                            <div>
                                <span className='text-emerald-400 text-sm font-medium block mb-1'>Nom</span>
                                <span className='text-white text-lg'>
                                    {selectedPartner.society || `${selectedPartner.first_name} ${selectedPartner.last_name}`}
                                </span>
                            </div>
                            <div>
                                <span className='text-emerald-400 text-sm font-medium block mb-1'>Adresse</span>
                                <span className='text-white'>
                                    {selectedPartner.address}<br />
                                    {selectedPartner.postal_code} {selectedPartner.city}<br />
                                    {selectedPartner.country}
                                </span>
                            </div>
                            {selectedPartner.phone && (
                                <div>
                                    <span className='text-emerald-400 text-sm font-medium block mb-1'>Téléphone</span>
                                    <a href={`tel:${selectedPartner.phone}`} className='text-white hover:text-emerald-400 transition-colors'>
                                        {selectedPartner.phone}
                                    </a>
                                </div>
                            )}
                            {selectedPartner.email && (
                                <div>
                                    <span className='text-emerald-400 text-sm font-medium block mb-1'>Email</span>
                                    <a href={`mailto:${selectedPartner.email}`} className='text-white hover:text-emerald-400 transition-colors'>
                                        {selectedPartner.email}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className='flex justify-end gap-5'>
                    <Button
                        type="button"
                        theme="secondary"
                        className='lg:w-max'
                        onClick={() => setDraft({ current_step: ClientCertificateStep.Service })}>
                        <IoIosArrowBack /> Précédent
                    </Button>
                    <Button
                        type='button'
                        className='lg:w-max'
                        onClick={handleSubmit}
                        disabled={!selectedPartner}>
                        Suivant <IoIosArrowForward />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ClientCertificationPartnerModal