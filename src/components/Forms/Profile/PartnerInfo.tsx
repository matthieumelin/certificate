import { type FC } from 'react';
import { Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import FormGroup from '@/components/UI/Form/Group';
import Label from '@/components/UI/Form/Label';
import Input from '@/components/UI/Form/Input';
import Select from '@/components/UI/Form/Select';
import { Button } from '@/components/UI/Button';
import { usePartnerInfos } from '@/hooks/useSupabase';
import useAuth from '@/contexts/AuthContext';
import type { DaySchedule } from '@/types/user.d';
import countries from '@/data/countries';
import partnerInfoSchema from '@/validations/profile/partnerInfo.schema';

interface FormValues {
    address: string;
    postal_code: string;
    city: string;
    country: string;
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
    const { partnerInfo, isLoading, upsertPartnerInfo } = usePartnerInfos(true, { userId: userProfile?.id });

    const defaultSchedule: DaySchedule = {
        morning_start: '',
        morning_end: '',
        afternoon_start: '',
        afternoon_end: ''
    };

    const initialFormValues: FormValues = {
        address: partnerInfo?.address || '',
        postal_code: partnerInfo?.postal_code || '',
        city: partnerInfo?.city || '',
        country: partnerInfo?.country || '',
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

        try {
            await upsertPartnerInfo(userProfile.id, {
                address: values.address,
                postal_code: values.postal_code,
                city: values.city,
                country: values.country,
                show_hours: values.show_hours,
                hours: values.hours,
                by_appointment: values.by_appointment,
            });

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
            validationSchema={partnerInfoSchema}
            onSubmit={handleSubmit}>
            {({ values, errors, isSubmitting, setFieldValue }) => (
                <Form className='space-y-6'>
                    <div className='space-y-4'>
                        <h3 className='text-white font-semibold'>Adresse du point de contrôle</h3>

                        <FormGroup>
                            <Label htmlFor='address' label='Adresse' required />
                            <Input
                                id='address'
                                name='address'
                                type='text'
                                placeholder="123 Rue de la Paix"
                            />
                        </FormGroup>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <FormGroup>
                                <Label htmlFor='postal_code' label='Code postal' required />
                                <Input
                                    id='postal_code'
                                    name='postal_code'
                                    type='text'
                                    placeholder="75001"
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label htmlFor='city' label='Ville' required />
                                <Input
                                    id='city'
                                    name='city'
                                    type='text'
                                    placeholder="Paris"
                                />
                            </FormGroup>
                        </div>

                        <FormGroup>
                            <Label htmlFor='country' label='Pays' required />
                            <Select
                                value={values.country}
                                error={errors.country}
                                id='country'
                                options={countries.map((country) => (
                                    {
                                        label: country.name,
                                        value: country.code,
                                    }
                                ))}
                                onChange={(value) => setFieldValue('country', value)} />
                        </FormGroup>
                    </div>

                    <div className='border-t border-white/10 pt-6'>
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
                            <div className='space-y-4 p-4 bg-white/5 rounded-lg border border-white/10 mt-4'>
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

                        <FormGroup className='mt-4'>
                            <Input
                                type='checkbox'
                                id='by_appointment'
                                name='by_appointment'
                                label='Uniquement sur rendez-vous'
                                checked={values.by_appointment}
                                onChange={() => setFieldValue('by_appointment', !values.by_appointment)}
                            />
                        </FormGroup>
                    </div>

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