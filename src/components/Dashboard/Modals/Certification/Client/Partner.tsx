import { type FC, useState, useEffect } from 'react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { FiClock } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { ClientCertificateStep } from '@/types/certificate.d';
import Steps from '@/components/Dashboard/Steps';
import { Button } from '@/components/UI/Button';
import { useClientCertificateStore } from '@/stores/certification/clientCertificateStore';
import { usePartnerInfos } from '@/hooks/useSupabase';
import Map from '@/components/Map';
import type { PartnerInfo, DaySchedule } from '@/types/user.d';

const ClientCertificationPartnerModal: FC = () => {
    const { draft, setDraft } = useClientCertificateStore();
    const { partnerInfos: partners, isLoading } = usePartnerInfos(true, {
        fetchAll: true,
        includeProfile: true
    });

    console.log(partners)

    const [selectedPartner, setSelectedPartner] = useState<PartnerInfo | null>(null);
    const [showHours, setShowHours] = useState<boolean>(false);

    const steps = Object.values(ClientCertificateStep);

    useEffect(() => {
        if (draft.partner_id && partners.length > 0) {
            const partner = partners.find(p => p.user_id === draft.partner_id);
            if (partner) {
                setSelectedPartner(partner);
            }
        }
    }, [draft.partner_id, partners]);

    const handlePartnerSelect = (partner: PartnerInfo) => {
        setSelectedPartner(partner);
    };

    const handleSubmit = () => {
        if (!draft.id || !selectedPartner) {
            toast.error("Veuillez sélectionner un point de contrôle");
            return;
        }

        try {
            setDraft({
                partner_id: selectedPartner.user_id,
                current_step: ClientCertificateStep.Payment
            });
        } catch (error) {
            console.error("Erreur mise à jour draft:", error);
            toast.error("Erreur lors de la sauvegarde");
        }
    }

    const formatTimeSlot = (start: string, end: string) => {
        if (!start || !end) return null;
        return `${start} - ${end}`;
    };

    const getDaySchedule = (daySchedule: DaySchedule) => {
        const slots = [];
        
        const morning = formatTimeSlot(daySchedule.morning_start, daySchedule.morning_end);
        if (morning) slots.push(morning);
        
        const afternoon = formatTimeSlot(daySchedule.afternoon_start, daySchedule.afternoon_end);
        if (afternoon) slots.push(afternoon);
        
        return slots.length > 0 ? slots.join(' | ') : 'Fermé';
    };

    const days = [
        { key: 'monday', label: 'Lundi' },
        { key: 'tuesday', label: 'Mardi' },
        { key: 'wednesday', label: 'Mercredi' },
        { key: 'thursday', label: 'Jeudi' },
        { key: 'friday', label: 'Vendredi' },
        { key: 'saturday', label: 'Samedi' },
        { key: 'sunday', label: 'Dimanche' },
    ];

    if (isLoading) {
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
                <div className="flex flex-col items-center justify-center space-y-8">
                    <div>
                        <div className="text-white text-xl text-center">Aucun point de contrôle disponible</div>
                        <p className="text-gray text-center max-w-md">
                            Il n'y a actuellement aucun point de contrôle actif. Veuillez réessayer plus tard.
                        </p>
                    </div>
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
                            selectedPartnerId={selectedPartner?.user_id}
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
                                    {selectedPartner.profile?.society || `${selectedPartner.profile?.first_name} ${selectedPartner.profile?.last_name}`}
                                </span>
                            </div>
                            
                            <div>
                                <span className='text-emerald-400 text-sm font-medium block mb-1'>Adresse du point de contrôle</span>
                                <span className='text-white'>
                                    {selectedPartner.address}<br />
                                    {selectedPartner.postal_code} {selectedPartner.city}<br />
                                    {selectedPartner.country}
                                </span>
                            </div>

                            <div>
                                <span className='text-emerald-400 text-sm font-medium block mb-1'>Adresse de livraison</span>
                                {selectedPartner.hide_delivery_address ? (
                                    <div className='p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg'>
                                        <p className='text-orange-400 text-sm'>
                                            ⚠️ Le partenaire vous contactera pour convenir d'une adresse de livraison
                                        </p>
                                    </div>
                                ) : selectedPartner.delivery_same_as_main ? (
                                    <div className='p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg'>
                                        <p className='text-blue-400 text-sm'>
                                            ℹ️ Identique à l'adresse du point de contrôle
                                        </p>
                                    </div>
                                ) : (
                                    <span className='text-white'>
                                        {selectedPartner.delivery_address}<br />
                                        {selectedPartner.delivery_postal_code} {selectedPartner.delivery_city}<br />
                                        {selectedPartner.delivery_country}
                                    </span>
                                )}
                            </div>

                            {selectedPartner.show_hours && selectedPartner.hours && (
                                <div>
                                    <button
                                        onClick={() => setShowHours(!showHours)}
                                        className='w-full flex items-center justify-between text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors py-2'
                                    >
                                        <span className='flex items-center gap-2'>
                                            <FiClock className='w-4 h-4' />
                                            Horaires d'ouverture
                                        </span>
                                        <svg
                                            className={`w-4 h-4 transition-transform ${showHours ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {showHours && (
                                        <div className='mt-2 p-4 bg-white/5 rounded-lg border border-white/10 space-y-2'>
                                            {selectedPartner.by_appointment && (
                                                <div className='mb-3 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded'>
                                                    <p className='text-yellow-400 text-xs'>
                                                        📅 Uniquement sur rendez-vous
                                                    </p>
                                                </div>
                                            )}
                                            
                                            {days.map((day) => {
                                                const schedule = selectedPartner.hours[day.key as keyof typeof selectedPartner.hours];
                                                return (
                                                    <div key={day.key} className='flex justify-between items-center'>
                                                        <span className='text-gray text-sm font-medium'>{day.label}</span>
                                                        <span className='text-white text-sm'>
                                                            {getDaySchedule(schedule)}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {selectedPartner.profile?.phone && (
                                <div>
                                    <span className='text-emerald-400 text-sm font-medium block mb-1'>Téléphone</span>
                                    <a href={`tel:${selectedPartner.profile.phone}`} className='text-white hover:text-emerald-400 transition-colors'>
                                        {selectedPartner.profile.phone}
                                    </a>
                                </div>
                            )}
                            
                            {selectedPartner.profile?.email && (
                                <div>
                                    <span className='text-emerald-400 text-sm font-medium block mb-1'>Email</span>
                                    <a href={`mailto:${selectedPartner.profile.email}`} className='text-white hover:text-emerald-400 transition-colors'>
                                        {selectedPartner.profile.email}
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