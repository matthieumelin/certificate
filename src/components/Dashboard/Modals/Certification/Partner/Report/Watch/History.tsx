import { Button } from '@/components/UI/Button';
import DataTable from '@/components/DataTables';
import FormGroup from '@/components/UI/Form/Group';
import Input from '@/components/UI/Form/Input';
import Label from '@/components/UI/Form/Label';
import FormRow from '@/components/UI/Form/Row';
import Select from '@/components/UI/Form/Select';
import countries from '@/data/countries';
import { useCertificateReportForm } from '@/hooks/useCertificateReportForm';
import { useObjectHistory, useObjects } from '@/hooks/useSupabase';
import { useCertificateReportFormStore } from '@/stores/certificateReportFormStore';
import type { CertificateType } from '@/types/certificate.d';
import type { Country } from '@/types/country.d';
import { type ObjectHistory } from '@/types/object.d';
import { Form, Formik } from 'formik'
import { useEffect, type FC, useState } from 'react'
import { toast } from 'react-toastify';
import { useCertificateStore } from '@/stores/certificateStore';

interface FormValues {
    history_origin_country: string;
    history_purchase_country_seller: string;
    history_purchase_country_date: string;
    history_purchase_buying_price: number;
    history_actual_country: string;
}

interface ObjectHistoryAddFormValues {
    history_previous_place: string;
    history_seller: string;
    history_buying_date: string;
    history_buying_price: number;
}

interface ObjectHistoryAddFormErrors {
    history_previous_place?: string;
    history_seller?: string;
    history_buying_date?: string;
    history_buying_price?: string;
}

interface PartnerCertificationReportHistoryModalProps {
    certificateTypes: CertificateType[];
}

const PartnerCertificationReportHistoryModal: FC<PartnerCertificationReportHistoryModalProps> = ({ certificateTypes }) => {
    const { selectedCertificate } = useCertificateStore();
    const { formData } = useCertificateReportFormStore();

    const { getObjectById } = useObjects(false);
    const { createObjectHistory, getObjectHistoryByObjectId } = useObjectHistory(false);

    const [objectHistory, setObjectHistory] = useState<ObjectHistory[]>([]);
    const [isAddingObjectHistory, setIsAddingObjectHistory] = useState<boolean>(false);

    const [addObjectHistoryForm, setAddObjectHistoryForm] = useState<ObjectHistoryAddFormValues>({
        history_previous_place: '',
        history_seller: '',
        history_buying_date: '',
        history_buying_price: 0
    })
    const [objectHistoryAddFormErrors, setObjectHistoryAddFormErrors] = useState<ObjectHistoryAddFormErrors>({});

    const initialValues: FormValues = {
        history_origin_country: formData.history_origin_country || "",
        history_purchase_country_seller: formData.history_purchase_country_seller || "",
        history_purchase_country_date: formData.history_purchase_country_date || "",
        history_purchase_buying_price: formData.history_purchase_buying_price || 0,
        history_actual_country: formData.history_actual_country || "",
    }

    const validateObjectHistoryForm = (): boolean => {
        const errors: ObjectHistoryAddFormErrors = {};

        if (!addObjectHistoryForm.history_previous_place) {
            errors.history_previous_place = "Le lieu précédent est requis";
        }

        if (!addObjectHistoryForm.history_seller || addObjectHistoryForm.history_seller.trim() === '') {
            errors.history_seller = "Le vendeur est requis";
        }

        if (!addObjectHistoryForm.history_buying_date) {
            errors.history_buying_date = "La date d'achat est requise";
        }

        if (addObjectHistoryForm.history_buying_price <= 0) {
            errors.history_buying_price = "Le prix doit être supérieur à 0";
        }

        setObjectHistoryAddFormErrors(errors);

        return Object.keys(errors).length === 0;
    }

    const handleAddObjectHistory = async () => {
        setObjectHistoryAddFormErrors({});

        if (!validateObjectHistoryForm()) {
            return;
        }

        setIsAddingObjectHistory(true);

        try {
            const newObjectHistory = await createObjectHistory({
                object_id: selectedCertificate?.object_id!,
                previous_place: addObjectHistoryForm.history_previous_place,
                seller: addObjectHistoryForm.history_seller,
                buying_date: addObjectHistoryForm.history_buying_date,
                buying_price: addObjectHistoryForm.history_buying_price
            });

            if (newObjectHistory) {
                setObjectHistory(prev => [...prev, newObjectHistory])
                setAddObjectHistoryForm({
                    history_previous_place: "",
                    history_seller: "",
                    history_buying_date: "",
                    history_buying_price: 0
                });
                setObjectHistoryAddFormErrors({});
            }
        } catch (error) {
            console.error('Error adding object history:', error);
            toast.error("Erreur lors de l'ajout de l'historique de l'objet");
        } finally {
            setIsAddingObjectHistory(false);
        }
    }

    useEffect(() => {
        const loadObjectAndHistory = async () => {
            if (!selectedCertificate) return;

            const object = await getObjectById(selectedCertificate.object_id);
            if (object) {
                const objectHistory = await getObjectHistoryByObjectId(object.id);
                setObjectHistory(objectHistory || []);
            }
        }

        loadObjectAndHistory();
    }, [selectedCertificate])

    const certificateType = certificateTypes.find((certificateType: CertificateType) => certificateType.id === selectedCertificate?.certificate_type_id);
    const certificateTypeExcludedFormFields = certificateType?.excluded_report_form_fields ? certificateType?.excluded_report_form_fields.filter((excludedFormField: string) => excludedFormField.startsWith("history")) : []

    return (
        <div className="space-y-4">
            <h2 className="text-white text-xl font-semibold">Historique</h2>
            <Formik
                initialValues={initialValues}
                onSubmit={() => { }}>
                {({ errors, values, setFieldValue }) => {
                    useCertificateReportForm(values);
                    return (
                        <Form>
                            <div className='space-y-4'>
                                <div className='space-y-4'>
                                    <h2 className="text-white text-lg font-semibold">Origine</h2>
                                    {!certificateTypeExcludedFormFields?.includes("history_origin_country") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="history_origin_country"
                                                label="Lieu d'origine (boutique d'origine)" />
                                            <Select
                                                error={errors.history_origin_country}
                                                value={values.history_origin_country}
                                                onChange={value => setFieldValue('history_origin_country', value)}
                                                id="history_origin_country"
                                                options={countries.map((country: Country) => (
                                                    { label: country.name, value: country.code }
                                                ))} />
                                        </FormGroup>
                                    )}

                                    {!certificateTypeExcludedFormFields?.includes("history_purchase_country_seller") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="history_purchase_country_seller"
                                                label="Vendeur"  />
                                            <Input
                                                id='history_purchase_country_seller'
                                                name='history_purchase_country_seller'
                                                type='text'
                                                placeholder='Ex: Rolex Paris'
                                                error={errors.history_purchase_country_seller} />
                                        </FormGroup>
                                    )}

                                    {!certificateTypeExcludedFormFields?.includes("history_purchase_country_date") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="history_purchase_country_date"
                                                label="Date d'achat"  />
                                            <Input
                                                id='history_purchase_country_date'
                                                name='history_purchase_country_date'
                                                type='date'
                                                placeholder={new Date().toLocaleDateString()}
                                                error={errors.history_purchase_country_date} />
                                        </FormGroup>
                                    )}

                                    {!certificateTypeExcludedFormFields?.includes("history_purchase_buying_price") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="history_purchase_buying_price"
                                                label="Prix d'achat (€)" />
                                            <Input
                                                id='history_purchase_buying_price'
                                                name='history_purchase_buying_price'
                                                type='number'
                                                error={errors.history_purchase_buying_price} />
                                        </FormGroup>
                                    )}
                                </div>

                                {!certificateTypeExcludedFormFields?.includes("history_previous_places") && (
                                    <div className='space-y-4 border-t border-white/10 pt-8'>
                                        <h2 className="text-white text-lg font-semibold">Lieu(x) précédent(s)</h2>

                                        {objectHistory && objectHistory.length > 0 && (
                                            <DataTable
                                                key={objectHistory.length}
                                                keyField="id"
                                                columns={[
                                                    {
                                                        key: "previous_place", label: "Lieu précédent",
                                                        render: (value) => {
                                                            const country = countries.find(c => c.code === value);
                                                            return country?.name || value;
                                                        },
                                                    },
                                                    { key: "seller", label: "Vendeur" },
                                                    {
                                                        key: "buying_date", label: "Date d'achat", render: (value) => (
                                                            <span className='text-white font-medium'>
                                                                {new Date(value as number).toLocaleDateString('fr-FR', {
                                                                    day: '2-digit',
                                                                    month: '2-digit',
                                                                    year: 'numeric'
                                                                })}
                                                            </span>
                                                        )
                                                    },
                                                    { key: "buying_price", label: "Prix d'achat (€)", render: (value) => value ? `${value}€` : "-" },
                                                ]}
                                                data={objectHistory} />
                                        )}

                                        <div className='space-y-4'>
                                            <FormRow>
                                                <FormGroup>
                                                    <Label htmlFor='history_previous_place' label='Lieu précédent' />
                                                    <Select
                                                        useFormik={false}
                                                        error={objectHistoryAddFormErrors.history_previous_place}
                                                        value={addObjectHistoryForm.history_previous_place}
                                                        onChange={value => {
                                                            setAddObjectHistoryForm(prev => ({ ...prev, history_previous_place: value as string }));

                                                            if (objectHistoryAddFormErrors.history_previous_place) {
                                                                setObjectHistoryAddFormErrors(prev => ({ ...prev, history_previous_place: undefined }))
                                                            }
                                                        }}
                                                        id="history_previous_place"
                                                        options={countries.map((country: Country) => (
                                                            { label: country.name, value: country.code }
                                                        ))} />
                                                </FormGroup>

                                                <FormGroup>
                                                    <Label htmlFor='history_seller' label='Vendeur' />
                                                    <Input
                                                        useFormik={false}
                                                        value={addObjectHistoryForm.history_seller}
                                                        error={objectHistoryAddFormErrors.history_seller}
                                                        onChange={event => {
                                                            setAddObjectHistoryForm(prev => ({ ...prev, history_seller: event.target.value }));
                                                            if (objectHistoryAddFormErrors.history_seller) {
                                                                setObjectHistoryAddFormErrors(prev => ({ ...prev, history_seller: undefined }));
                                                            }
                                                        }}
                                                        type="text"
                                                        id='history_seller'
                                                        name='history_seller' />
                                                </FormGroup>

                                                <FormGroup>
                                                    <Label htmlFor='history_buying_date' label="Date d'achat" />
                                                    <Input
                                                        useFormik={false}
                                                        value={addObjectHistoryForm.history_buying_date}
                                                        error={objectHistoryAddFormErrors.history_buying_date}
                                                        onChange={event => {
                                                            setAddObjectHistoryForm(prev => ({ ...prev, history_buying_date: event.target.value }));
                                                            if (objectHistoryAddFormErrors.history_buying_date) {

                                                            }
                                                        }}
                                                        type="date"
                                                        id='history_buying_date'
                                                        name='history_buying_date' />
                                                </FormGroup>

                                                <FormGroup>
                                                    <Label htmlFor='history_buying_price' label="Prix d'achat (€)" />
                                                    <Input
                                                        useFormik={false}
                                                        value={addObjectHistoryForm.history_buying_price}
                                                        error={objectHistoryAddFormErrors.history_buying_price}
                                                        onChange={event => {
                                                            setAddObjectHistoryForm(prev => ({ ...prev, history_buying_price: parseFloat(event.target.value) || 0 }));
                                                            if (objectHistoryAddFormErrors.history_buying_price) {
                                                                setObjectHistoryAddFormErrors(prev => ({ ...prev, history_buying_price: undefined }));
                                                            }
                                                        }}
                                                        type='number'
                                                        id='history_buying_price'
                                                        name='history_buying_price' />
                                                </FormGroup>
                                            </FormRow>

                                            <Button
                                                onClick={handleAddObjectHistory}
                                                type='button'
                                                disabled={isAddingObjectHistory}>{isAddingObjectHistory ? "Ajout en cours..." : "Ajouter l'historique"}</Button>
                                        </div>
                                    </div>
                                )}

                                {!certificateTypeExcludedFormFields?.includes("history_actual_country") && (
                                    <div className='space-y-4 border-t border-white/10 pt-8'>
                                        <h2 className="text-white text-lg font-semibold">Lieu actuelle</h2>
                                        <Select
                                            error={errors.history_actual_country}
                                            id="history_actual_country"
                                            options={countries.map((country: Country) => (
                                                { label: country.name, value: country.code }
                                            ))} />
                                    </div>
                                )}
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </div >
    )
}

export default PartnerCertificationReportHistoryModal