import { type FC, useState } from 'react'
import { PartnerCertificateStep } from '@/types/certificate.d';
import type { ObjectBrand, ObjectModel, ObjectReference, ObjectType } from '@/types/object.d';
import { Button } from '@/components/UI/Button';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { Form, Formik } from 'formik';
import FormGroup from '@/components/UI/Form/Group';
import Label from '@/components/UI/Form/Label';
import Select from '@/components/UI/Form/Select';
import Input from '@/components/UI/Form/Input';
import { useCertificateStore } from '@/stores/certificateStore';
import ObjectTypeCard from '@/components/Dashboard/Cards/ObjectType';
import { toast } from 'react-toastify';
import { withCurrentValueOption } from '@/helpers/select';
import { genCertificateId } from '@/helpers/hash';
import Steps from '@/components/Dashboard/Steps';
import objectInfosSchema from '@/validations/certificate/partner/objectInfos.schema';

interface PartnerCertificationObjectInfosModalProps {
    objectTypes: ObjectType[];
    objectBrands: ObjectBrand[];
    objectModels: ObjectModel[];
    objectReferences: ObjectReference[];
}

export interface FormValues {
    type: string;
    brand: string;
    model: string;
    reference: string;
    serial_number: string;
}

const PartnerCertificationObjectInfosModal: FC<PartnerCertificationObjectInfosModalProps> = ({
    objectTypes,
    objectBrands,
    objectModels,
    objectReferences,
}) => {
    const { draft, setDraft } = useCertificateStore();
    const [showObjectTypes, setShowObjectTypes] = useState<boolean>(true);

    const steps = Object.values(PartnerCertificateStep);

    const draftObjectType = objectTypes.find(objectType => objectType.id === draft.object_type_id);

    const initialFormValues: FormValues = {
        type: draftObjectType?.name || objectTypes[0].name,
        brand: draft.object_brand || "",
        model: draft.object_model || "",
        reference: draft.object_reference || "",
        serial_number: draft.object_serial_number || "",
    };

    const handleSubmit = async (values: FormValues) => {
        const { type, brand, model, reference, serial_number } = values;

        try {
            const currentObjectType = objectTypes.find(objectType => objectType.name === type);
            if (!currentObjectType) {
                throw new Error("Aucun type d'objet n'a été trouvé");
            }

            setDraft({
                id: draft.id || genCertificateId(currentObjectType, brand),
                object_type_id: currentObjectType?.id ?? objectTypes[0].id,
                object_brand: brand,
                object_model: model,
                object_reference: reference,
                object_serial_number: serial_number,
                current_step: PartnerCertificateStep.Service
            });
        } catch (error) {
            console.error("Erreur sauvegarde infos:", error);
            toast.error("Erreur lors de la sauvegarde des informations");
        }
    }

    const handleObjectTypeSelect = () => {
        setShowObjectTypes(false);
    }

    return (
        <div>
            <Steps
                steps={steps} />

            <Formik
                initialValues={initialFormValues}
                validationSchema={objectInfosSchema}
                validateOnBlur={false}
                validateOnChange={false}
                validateOnMount={false}
                onSubmit={handleSubmit}>
                {({ errors, values, setFieldValue, isSubmitting }) => (
                    <Form>
                        <div className='space-y-8'>
                            <div className='space-y-4'>
                                <div className='flex items-center justify-between'>
                                    <h2 className='text-white text-xl font-semibold'>Type d'objet</h2>
                                    <button
                                        type="button"
                                        onClick={() => setShowObjectTypes(!showObjectTypes)}
                                        className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
                                    >
                                        <span>{showObjectTypes ? 'Masquer' : 'Afficher'}</span>
                                        <svg
                                            className={`w-4 h-4 transition-transform ${showObjectTypes ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </div>

                                {showObjectTypes && (
                                    <>
                                        {objectTypes && objectTypes.length > 0 ? (
                                            <FormGroup className='grid lg:grid-cols-4 gap-5'>
                                                {objectTypes.sort((a, b) => {
                                                    if (a.is_active === b.is_active) return 0;
                                                    return a.is_active ? -1 : 1;
                                                }).map((objectType: ObjectType) => (
                                                    <div key={objectType.id} onClick={handleObjectTypeSelect}>
                                                        <ObjectTypeCard data={objectType} />
                                                    </div>
                                                ))}
                                            </FormGroup>
                                        ) : (
                                            <p className="text-gray">
                                                Il n'y a aucun type d'objet
                                            </p>
                                        )}
                                    </>
                                )}

                                {!showObjectTypes && draftObjectType && (
                                    <div className='p-4 bg-emerald-900/10 rounded-xl border border-emerald-900/30'>
                                        <span className="text-emerald-400/60 text-xs uppercase font-bold">Type sélectionné : </span>
                                        <span className="text-white font-medium">{draftObjectType.name}</span>
                                    </div>
                                )}
                            </div>

                            <div className='space-y-4 border-t border-white/10 py-6'>
                                <h2 className='text-white text-xl font-semibold'>Informations de l'objet</h2>

                                <div className='space-y-4'>
                                    <FormGroup>
                                        <Label htmlFor='brand' label='Marque' required />
                                        <Select
                                            allowAdd
                                            id="brand"
                                            value={values.brand}
                                            error={errors.brand}
                                            onChange={(value) => setFieldValue("brand", value)}
                                            options={withCurrentValueOption(objectBrands.map(objectBrand => ({
                                                label: objectBrand.name,
                                                value: objectBrand.name,
                                            })), values.brand)}
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label htmlFor='model' label='Modèle' required />
                                        <Select
                                            allowAdd
                                            id="model"
                                            value={values.model}
                                            error={errors.model}
                                            onChange={(value) => setFieldValue("model", value)}
                                            options={withCurrentValueOption(objectModels.map(objectModel => ({
                                                label: objectModel.name,
                                                value: objectModel.name,
                                            })), values.model)}
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label htmlFor='reference' label='Référence' required />
                                        <Select
                                            allowAdd
                                            id="reference"
                                            value={values.reference}
                                            error={errors.reference}
                                            onChange={(value) => setFieldValue("reference", value)}
                                            options={withCurrentValueOption(objectReferences.map(objectReference => ({
                                                label: objectReference.name,
                                                value: objectReference.name,
                                            })), values.reference)}
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label htmlFor="serial_number" label="Numéro de série" required />
                                        <Input id='serial_number' name='serial_number' type='text' placeholder="116610LN" error={errors.serial_number} />
                                    </FormGroup>
                                </div>
                            </div>
                        </div>

                        <div className='flex justify-end gap-5'>
                            <Button
                                theme="secondary"
                                className='lg:w-max'
                                onClick={() => setDraft({ current_step: PartnerCertificateStep.CustomerInfos })}>
                                <IoIosArrowBack /> Précédent
                            </Button>
                            <Button
                                type='submit'
                                className='lg:w-max'
                                disabled={isSubmitting}>
                                Suivant <IoIosArrowForward />
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default PartnerCertificationObjectInfosModal