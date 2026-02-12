import { type FC } from 'react';
import { Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import FormGroup from '@/components/UI/Form/Group';
import Label from '@/components/UI/Form/Label';
import Input from '@/components/UI/Form/Input';
import { Button } from '@/components/UI/Button';
import { usePartnerInfos } from '@/hooks/useSupabase';
import useAuth from '@/contexts/AuthContext';
import type { DaySchedule } from '@/types/user.d';

interface FormValues {
    show_hours: boolean;
    hours: {
        monday: DaySchedule;
        tuesday: DaySchedule;
        wednesday: DaySchedule;
        thursday: DaySchedule;
        friday: DaySchedule;
        saturday: DaySchedule;
        sunday: DaySchedule;
    };
    by_appointment: boolean;
}

const ProfilePartnerInfoForm: FC = () => {
    const { userProfile } = useAuth();
    const { partnerInfo, isLoading, upsertPartnerInfo, mutate } = usePartnerInfos(true, { userId: userProfile?.id });

    const defaultSchedule: DaySchedule = {
        morning_start: '',
        morning_end: '',
        afternoon_start: '',
        afternoon_end: ''
    };

    const initialFormValues: FormValues = {
        show_hours: partnerInfo?.show_hours ?? true,
        hours: partnerInfo?.hours || {
            monday: defaultSchedule,
            tuesday: defaultSchedule,
            wednesday: defaultSchedule,
            thursday: defaultSchedule,
            friday: defaultSchedule,
            saturday: defaultSchedule,
            sunday: defaultSchedule,
        },
        by_appointment: partnerInfo?.by_appointment ?? false,
    };

    const handleSubmit = async (values: FormValues) => {
        if (!userProfile?.id) return;

        console.log('📤 Envoi des données:', values);

        try {
            const result = await upsertPartnerInfo(userProfile.id, {
                show_hours: values.show_hours,
                hours: values.hours,
                by_appointment: values.by_appointment,
            });

            console.log('✅ Données sauvegardées:', result);

            toast.success('Informations mises à jour avec succès');
        } catch (error) {
            console.error('Erreur mise à jour:', error);
            toast.error('Erreur lors de la mise à jour');
        }
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
        return <div className="text-white">Chargement...</div>;
    }

    return (
        <Formik
            initialValues={initialFormValues}
            enableReinitialize={true}
            onSubmit={handleSubmit}>
            {({ values, isSubmitting, setFieldValue }) => (
                <Form className='space-y-6'>
                    <FormGroup>
                        <Input
                            type='checkbox'
                            id='show_hours'
                            name='show_hours'
                            label="Afficher les horaires d'ouverture aux clients"
                            checked={values.show_hours}
                            onChange={() => setFieldValue('show_hours', !values.show_hours)}
                        />
                    </FormGroup>

                    {values.show_hours && (
                        <div className='space-y-4 p-4 bg-white/5 rounded-lg border border-white/10'>
                            <h3 className='text-white font-semibold'>Heures d'ouverture</h3>

                            {days.map((day) => (
                                <div key={day.key} className='space-y-2'>
                                    <Label htmlFor={`hours.${day.key}.morning_start`} label={day.label} />
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        <div className='flex items-center gap-2'>
                                            <Input
                                                type='time'
                                                name={`hours.${day.key}.morning_start`}
                                                placeholder="08:30"
                                                className='flex-1'
                                            />
                                            <span className='text-gray'>-</span>
                                            <Input
                                                type='time'
                                                name={`hours.${day.key}.morning_end`}
                                                placeholder="12:30"
                                                className='flex-1'
                                            />
                                        </div>

                                        <div className='flex items-center gap-2'>
                                            <Input
                                                type='time'
                                                name={`hours.${day.key}.afternoon_start`}
                                                placeholder="13:30"
                                                className='flex-1'
                                            />
                                            <span className='text-gray'>-</span>
                                            <Input
                                                type='time'
                                                name={`hours.${day.key}.afternoon_end`}
                                                placeholder="16:30"
                                                className='flex-1'
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <FormGroup>
                        <Input
                            type='checkbox'
                            id='by_appointment'
                            name='by_appointment'
                            label='Uniquement sur rendez-vous'
                            checked={values.by_appointment}
                            onChange={() => setFieldValue('by_appointment', !values.by_appointment)}
                        />
                    </FormGroup>

                    <Button
                        type='submit'
                        disabled={isSubmitting}
                        className='w-full'>
                        {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default ProfilePartnerInfoForm;