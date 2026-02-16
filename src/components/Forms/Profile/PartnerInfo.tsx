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
import { PartnerInfoAddressType, type DaySchedule } from '@/types/user.d';
import countries from '@/data/countries';
import partnerInfoSchema from '@/validations/profile/partnerInfo.schema';
import { getPartnerInfoAddressTypeLabel } from '@/helpers/translations';

interface FormValues {
    address: string;
    postal_code: string;
    city: string;
    country: string;
    address_type: PartnerInfoAddressType;
    delivery_same_as_main: boolean;
    hide_delivery_address: boolean;
    delivery_address: string;
    delivery_postal_code: string;
    delivery_city: string;
    delivery_country: string;
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
    const { partnerInfos, isLoading, upsertPartnerInfo } = usePartnerInfos(true, { userId: userProfile?.id });

    const defaultSchedule: DaySchedule = {
        morning_start: '',
        morning_end: '',
        afternoon_start: '',
        afternoon_end: ''
    };

    if (isLoading) {
        return <div className="text-white">Chargement...</div>;
    }

    const partnerInfo = partnerInfos[0] || null;

    const initialFormValues: FormValues = {
        address: partnerInfo?.address || '',
        postal_code: partnerInfo?.postal_code || '',
        city: partnerInfo?.city || '',
        country: partnerInfo?.country || '',
        address_type: partnerInfo?.address_type || '',
        delivery_same_as_main: partnerInfo?.delivery_same_as_main ?? false,
        hide_delivery_address: partnerInfo?.hide_delivery_address ?? false,
        delivery_address: partnerInfo?.delivery_address || '',
        delivery_postal_code: partnerInfo?.delivery_postal_code || '',
        delivery_city: partnerInfo?.delivery_city || '',
        delivery_country: partnerInfo?.delivery_country || '',
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
                address_type: values.address_type,
                delivery_same_as_main: values.delivery_same_as_main,
                hide_delivery_address: values.hide_delivery_address,
                delivery_address: values.delivery_address,
                delivery_postal_code: values.delivery_postal_code,
                delivery_city: values.delivery_city,
                delivery_country: values.delivery_country,
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

    return (
        <Formik
            initialValues={initialFormValues}
            validationSchema={partnerInfoSchema}
            enableReinitialize={true}
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
                                options={countries.map((country) => ({
                                    label: country.name,
                                    value: country.code,
                                }))}
                                onChange={(value) => setFieldValue('country', value)}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor='address_type' label='Type' required />
                            <Select
                                searchable={false}
                                value={values.address_type}
                                error={errors.address_type}
                                id='address_type'
                                options={Object.values(PartnerInfoAddressType).map((addressType) => ({
                                    label: getPartnerInfoAddressTypeLabel(addressType),
                                    value: addressType,
                                }))}
                                onChange={(value) => setFieldValue('address_type', value)}
                            />
                        </FormGroup>
                    </div>

                    <div className='space-y-4 border-t border-white/10 pt-6'>
                        <h3 className='text-white font-semibold'>Adresse de livraison</h3>

                        <div className='space-y-3'>
                            <FormGroup>
                                <Input
                                    type='checkbox'
                                    id='delivery_same_as_main'
                                    name='delivery_same_as_main'
                                    label="L'adresse de livraison est identique à l'adresse du point de contrôle"
                                    checked={values.delivery_same_as_main}
                                    onChange={(e) => {
                                        const isChecked = (e.target as HTMLInputElement).checked;
                                        setFieldValue('delivery_same_as_main', isChecked);

                                        if (isChecked) {
                                            setFieldValue('delivery_address', values.address);
                                            setFieldValue('delivery_postal_code', values.postal_code);
                                            setFieldValue('delivery_city', values.city);
                                            setFieldValue('delivery_country', values.country);
                                            setFieldValue('hide_delivery_address', false);
                                        }
                                    }}
                                />
                            </FormGroup>

                            <FormGroup>
                                <Input
                                    type='checkbox'
                                    id='hide_delivery_address'
                                    name='hide_delivery_address'
                                    label="Masquer l'adresse de livraison, contacter le client à chaque certificat"
                                    checked={values.hide_delivery_address}
                                    onChange={(e) => {
                                        const isChecked = (e.target as HTMLInputElement).checked;
                                        setFieldValue('hide_delivery_address', isChecked);

                                        if (isChecked) {
                                            setFieldValue('delivery_same_as_main', false);
                                        }
                                    }}
                                />
                            </FormGroup>
                        </div>

                        {!values.delivery_same_as_main && !values.hide_delivery_address && (
                            <div className='space-y-4 p-4 bg-white/5 rounded-lg border border-white/10'>
                                <FormGroup>
                                    <Label htmlFor='delivery_address' label='Adresse' required />
                                    <Input
                                        id='delivery_address'
                                        name='delivery_address'
                                        type='text'
                                        placeholder="123 Rue de la Paix"
                                    />
                                </FormGroup>

                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <FormGroup>
                                        <Label htmlFor='delivery_postal_code' label='Code postal' required />
                                        <Input
                                            id='delivery_postal_code'
                                            name='delivery_postal_code'
                                            type='text'
                                            placeholder="75001"
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label htmlFor='delivery_city' label='Ville' required />
                                        <Input
                                            id='delivery_city'
                                            name='delivery_city'
                                            type='text'
                                            placeholder="Paris"
                                        />
                                    </FormGroup>
                                </div>

                                <FormGroup>
                                    <Label htmlFor='delivery_country' label='Pays' required />
                                    <Select
                                        value={values.delivery_country}
                                        error={errors.delivery_country}
                                        id='delivery_country'
                                        options={countries.map((country) => ({
                                            label: country.name,
                                            value: country.code,
                                        }))}
                                        onChange={(value) => setFieldValue('delivery_country', value)}
                                    />
                                </FormGroup>
                            </div>
                        )}

                        {values.delivery_same_as_main && (
                            <div className='p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg'>
                                <p className='text-blue-400 text-sm'>
                                    ℹ️ L'adresse de livraison sera la même que l'adresse du point de contrôle
                                </p>
                            </div>
                        )}

                        {values.hide_delivery_address && (
                            <div className='p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg'>
                                <p className='text-orange-400 text-sm'>
                                    ⚠️ Vous devrez contacter chaque client pour convenir d'une adresse de livraison
                                </p>
                            </div>
                        )}
                    </div>

                    <div className='border-t border-white/10 pt-6'>
                        <FormGroup>
                            <Input
                                type='checkbox'
                                id='show_hours'
                                name='show_hours'
                                label="Afficher les horaires d'ouverture aux clients"
                                checked={values.show_hours}
                                onChange={(e) => setFieldValue('show_hours', (e.target as HTMLInputElement).checked)}
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
                                onChange={(e) => setFieldValue('by_appointment', (e.target as HTMLInputElement).checked)}
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