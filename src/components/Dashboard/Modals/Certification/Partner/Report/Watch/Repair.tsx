import { Button } from '@/components/UI/Button';
import DataTable from '@/components/DataTables';
import FormGroup from '@/components/UI/Form/Group';
import Input from '@/components/UI/Form/Input';
import Label from '@/components/UI/Form/Label';
import FormRow from '@/components/UI/Form/Row';
import Select from '@/components/UI/Form/Select';
import { useCertificateReportForm } from '@/hooks/useCertificateReportForm';
import { useObjectRepairs, useObjects } from '@/hooks/useSupabase';
import { useCertificateReportFormStore } from '@/stores/certificateReportFormStore';
import type { CertificateType } from '@/types/certificate.d';
import { type ObjectRepair } from '@/types/object.d';
import { Form, Formik } from 'formik'
import { useState, type FC, useEffect } from 'react'
import { toast } from 'react-toastify';
import { useCertificateStore } from '@/stores/certificateStore';

interface FormValues {
    repair_type: string;
    repair_place: string;
    repair_workshop: string;
    repair_date: string;
}

interface ObjectRepairAddFormValues {
    repair_type: string;
    repair_place: string;
    repair_workshop: string;
    repair_date: string;
}

interface ObjectRepairAddFormErrors {
    repair_type?: string;
    repair_place?: string;
    repair_workshop?: string;
    repair_date?: string;
}

interface PartnerCertificationReportRepairModalProps {
    certificateTypes: CertificateType[];
}

const PartnerCertificationReportRepairModal: FC<PartnerCertificationReportRepairModalProps> = ({ certificateTypes }) => {
    const { selectedCertificate } = useCertificateStore();
    const { formData } = useCertificateReportFormStore();

    const { getObjectById } = useObjects(false);
    const { createObjectRepair, getObjectRepairsByObjectId } = useObjectRepairs(false);

    const [objectRepairs, setObjectRepairs] = useState<ObjectRepair[]>([]);
    const [isAddingObjectRepair, setIsAddingObjectRepair] = useState<boolean>(false);

    const [addObjectRepairForm, setAddObjectRepairForm] = useState<ObjectRepairAddFormValues>({
        repair_type: "",
        repair_place: "",
        repair_workshop: "",
        repair_date: "",
    })
    const [objectRepairAddFormErrors, setObjectRepairAddFormErrors] = useState<ObjectRepairAddFormErrors>({});

    const initialValues: FormValues = {
        repair_type: formData.repair_type || "",
        repair_place: formData.repair_place || "",
        repair_workshop: formData.repair_workshop || "",
        repair_date: formData.repair_date || "",
    }

    const validateObjectRepairForm = (): boolean => {
        const errors: ObjectRepairAddFormErrors = {};

        if (!addObjectRepairForm.repair_type) {
            errors.repair_type = "Le type est requis";
        }

        if (!addObjectRepairForm.repair_place) {
            errors.repair_place = "Le pays est requis";
        }

        if (!addObjectRepairForm.repair_workshop) {
            errors.repair_workshop = "L'atelier est requis";
        }

        if (!addObjectRepairForm.repair_date) {
            errors.repair_date = "La date est requise";
        }

        setObjectRepairAddFormErrors(errors);

        return Object.keys(errors).length === 0;
    }

    const handleAddObjectRepair = async () => {
        setObjectRepairAddFormErrors({});

        if (!validateObjectRepairForm()) {
            return;
        }

        setIsAddingObjectRepair(true);

        try {
            const newObjectRepair = await createObjectRepair({
                object_id: selectedCertificate?.object_id!,
                type: Array.isArray(addObjectRepairForm.repair_type) ?
                    JSON.stringify(addObjectRepairForm.repair_type) :
                    addObjectRepairForm.repair_type,
                date: addObjectRepairForm.repair_date,
                place: addObjectRepairForm.repair_place,
                workshop: addObjectRepairForm.repair_workshop,
            });

            if (newObjectRepair) {
                setObjectRepairs(prev => [...prev, newObjectRepair]);

                setAddObjectRepairForm({
                    repair_date: "",
                    repair_place: "",
                    repair_type: "",
                    repair_workshop: ""
                });
                setObjectRepairAddFormErrors({});

                toast.success("Intervention de l'objet ajoutée avec succès");
            }
        } catch (error) {
            console.error('Error adding object repair:', error);
            toast.error("Erreur lors de l'ajout de l'intervention de l'objet");
        } finally {
            setIsAddingObjectRepair(false);
        }
    }

    useEffect(() => {
        const loadObjectAndRepair = async () => {
            if (!selectedCertificate) return;

            const object = await getObjectById(selectedCertificate.object_id);
            if (object) {
                const objectRepairs = await getObjectRepairsByObjectId(object.id);
                setObjectRepairs(objectRepairs || []);
            }
        }

        loadObjectAndRepair();
    }, [selectedCertificate]);

    const repairTypes = [
        "Révision",
        "Nettoyage habillage",
        "Nettoyage mouvement",
        "Polissage",
        "Réparation esthétique",
        "Réparation technique",
        "Restauration complète",
    ]
    const repairPlaces = [
        "Maison mère de la marque",
        "Point agréé",
        "Atelier externe",
        "Inconnu"
    ]

    const certificateType = certificateTypes.find((certificateType: CertificateType) => certificateType.id === selectedCertificate?.certificate_type_id);
    const certificateTypeExcludedFormFields = certificateType?.excluded_report_form_fields ? certificateType?.excluded_report_form_fields.filter((excludedFormField: string) => excludedFormField.startsWith("repair")) : []

    return (
        <div className="space-y-4">
            <h2 className="text-white text-xl font-semibold">Interventions</h2>
            <Formik
                initialValues={initialValues}
                onSubmit={() => { }}>
                {({ values }) => {
                    useCertificateReportForm(values);
                    return (
                        <Form>
                            {!certificateTypeExcludedFormFields?.includes("repair_previous") && (
                                <div className='space-y-4'>
                                    <h2 className="text-white text-lg font-semibold">Intervention(s) précédente(s)</h2>

                                    {objectRepairs && objectRepairs.length > 0 && (
                                        <DataTable
                                            key={objectRepairs.length}
                                            keyField="id"
                                            columns={[
                                                {
                                                    key: "type", label: "Type", render: (value) => {
                                                        const arrayValues = JSON.parse(value as string);

                                                        return (
                                                            <span>{arrayValues.join(", ")}</span>
                                                        )
                                                    }
                                                },
                                                { key: "place", label: "Lieu" },
                                                { key: "workshop", label: "Atelier" },
                                                {
                                                    key: "date", label: "Date", render: (value) => (
                                                        <span className='text-white font-medium'>
                                                            {new Date(value as number).toLocaleDateString('fr-FR', {
                                                                day: '2-digit',
                                                                month: '2-digit',
                                                                year: 'numeric'
                                                            })}
                                                        </span>
                                                    )
                                                },
                                            ]}
                                            data={objectRepairs} />
                                    )}

                                    <div className='space-y-4'>
                                        <FormRow>
                                            <FormGroup>
                                                <Label htmlFor='repair_type' label='Type' />
                                                <Select
                                                    useFormik={false}
                                                    error={objectRepairAddFormErrors.repair_type}
                                                    value={addObjectRepairForm.repair_type}
                                                    onChange={value => {
                                                        setAddObjectRepairForm(prev => ({ ...prev, repair_type: value as string }));

                                                        if (objectRepairAddFormErrors.repair_type) {
                                                            setObjectRepairAddFormErrors(prev => ({ ...prev, repair_type: undefined }))
                                                        }
                                                    }}
                                                    multiple
                                                    id="repair_type"
                                                    options={repairTypes.map((type: string) => (
                                                        { label: type, value: type }
                                                    ))} />
                                            </FormGroup>

                                            <FormGroup>
                                                <Label htmlFor='repair_place' label='Lieu' />
                                                <Select
                                                    useFormik={false}
                                                    error={objectRepairAddFormErrors.repair_place}
                                                    value={addObjectRepairForm.repair_place}
                                                    onChange={value => {
                                                        setAddObjectRepairForm(prev => ({ ...prev, repair_place: value as string }));

                                                        if (objectRepairAddFormErrors.repair_place) {
                                                            setObjectRepairAddFormErrors(prev => ({ ...prev, repair_place: undefined }))
                                                        }
                                                    }}
                                                    id="repair_place"
                                                    options={repairPlaces.map((place: string) => (
                                                        { label: place, value: place }
                                                    ))} />
                                            </FormGroup>

                                            <FormGroup>
                                                <Label htmlFor='repair_workshop' label='Atelier' />
                                                <Input
                                                    useFormik={false}
                                                    error={objectRepairAddFormErrors.repair_workshop}
                                                    value={addObjectRepairForm.repair_workshop}
                                                    onChange={event => {
                                                        setAddObjectRepairForm(prev => ({ ...prev, repair_workshop: event.target.value }));

                                                        if (objectRepairAddFormErrors.repair_workshop) {
                                                            setObjectRepairAddFormErrors(prev => ({ ...prev, repair_workshop: undefined }))
                                                        }
                                                    }}
                                                    type="text"
                                                    id='repair_workshop'
                                                    name='repair_workshop' />
                                            </FormGroup>

                                            <FormGroup>
                                                <Label htmlFor='repair_date' label='Date' />
                                                <Input
                                                    useFormik={false}
                                                    error={objectRepairAddFormErrors.repair_date}
                                                    value={addObjectRepairForm.repair_date}
                                                    onChange={event => {
                                                        setAddObjectRepairForm(prev => ({ ...prev, repair_date: event.target.value }));

                                                        if (objectRepairAddFormErrors.repair_date) {
                                                            setObjectRepairAddFormErrors(prev => ({ ...prev, repair_date: undefined }))
                                                        }
                                                    }}
                                                    type='date'
                                                    id='repair_date'
                                                    name='repair_date'
                                                    placeholder={new Date().toLocaleDateString()} />
                                            </FormGroup>
                                        </FormRow>

                                        <Button
                                            onClick={handleAddObjectRepair}
                                            type='button'
                                            disabled={isAddingObjectRepair}>{isAddingObjectRepair ? "Ajout en cours..." : "Ajouter l'intervention"}</Button>
                                    </div>
                                </div>
                            )}
                        </Form>
                    )
                }}
            </Formik>
        </div >
    )
}

export default PartnerCertificationReportRepairModal