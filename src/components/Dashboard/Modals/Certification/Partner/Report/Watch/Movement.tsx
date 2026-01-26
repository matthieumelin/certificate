import FormGroup from '@/components/UI/Form/Group';
import Input from '@/components/UI/Form/Input';
import Label from '@/components/UI/Form/Label';
import FormRow from '@/components/UI/Form/Row';
import Select from '@/components/UI/Form/Select';
import { useCertificateReportForm } from '@/hooks/useCertificateReportForm';
import { useCertificateReportFormStore } from '@/stores/certificateReportFormStore';
import { useCertificateReportStore } from '@/stores/certificateReportStore';
import type { CertificateType } from '@/types/certificate';
import { choiceOptions, movementTypes } from '@/utils/report';
import { Form, Formik } from 'formik'
import { type FC } from 'react'

interface FormValues {
    movement_type: string;
    movement_functions: string;
    movement_serial_number: string;
    movement_caliber_reference: string;
    movement_caliber_base: string;
    movement_caliber_factory: string;
    movement_caliber_change: string;
    movement_gems_number: number;
    movement_power_reserve_announced: number;
    movement_announced_amplitude: number;
    movement_announced_frequency_hz: number;
    movement_announced_frequency_ah: number;
    movement_pieces_change: string;
    movement_pieces_change_date: string;
}

interface PartnerCertificationReportMovementModalProps {
    certificateTypes: CertificateType[];
}

const PartnerCertificationReportMovementModal: FC<PartnerCertificationReportMovementModalProps> = ({ certificateTypes }) => {
    const { selectedCertificate } = useCertificateReportStore();
    const { formData } = useCertificateReportFormStore();

    const movementFunctions = [
        "Heures",
        "Minutes",
        "Secondes",
        "Petite seconde",
        "Date simple",
        "Jour",
        "Mois",
        "Année",
        "Calendrier complet",
        "Triple Quantième",
        "Calendrier annuel",
        "Quantième perpétuel",
        "Calendrier Perpétuel",
        "Phases de lune",
        "Chronographe",
        "Chronographe monopoussoir",
        "Chronographe flyback",
        "GMT",
        "Deuxième Fuseau Horaire",
        "Heure universelle",
        "Indicateur de réserve de marche",
        "Alarme",
        "Répétition minutes",
        "Grande sonnerie",
        "Petite sonnerie",
        "Tourbillon",
        "Carrousel",
        "Stop seconde"
    ];
    const movementChangeCaliberChoices = [
        "Oui (entièrement)",
        "Non",
        "Partiellement"
    ];
    const movementPieces = [
        "Balancier",
        "Spiral",
        "Échappement",
        "Axe de balancier",
        "Roue de centre",
        "Roue de moyenne",
        "Roue de seconde",
        "Roue d'heure",
        "Ressort moteur",
        "Barillet",
        "Arbre de barillet",
        "Roue de couronne",
        "Roue de remontoir",
        "Rochet",
        "Masse oscillante",
        "Pont du rotor",
        "Roues de réduction",
        "Inverseurs",
        "Modules de complications",
        "Platine",
        "Ponts",
        "Rubis"
    ]

    const initialValues: FormValues = {
        movement_type: formData.movement_type || "",
        movement_functions: formData.movement_functions || "",
        movement_caliber_reference: formData.movement_caliber_reference || "",
        movement_caliber_base: formData.movement_caliber_base || "",
        movement_serial_number: formData.movement_serial_number || "",
        movement_gems_number: formData.movement_gems_number || 0,
        movement_power_reserve_announced: formData.movement_power_reserve_announced || 0,
        movement_announced_amplitude: formData.movement_announced_amplitude || 0,
        movement_announced_frequency_hz: formData.movement_announced_frequency_hz || 0,
        movement_announced_frequency_ah: formData.movement_announced_frequency_ah || 0,
        movement_caliber_factory: formData.movement_caliber_factory || choiceOptions[0],
        movement_caliber_change: formData.movement_caliber_change || choiceOptions[1],
        movement_pieces_change: formData.movement_pieces_change || "",
        movement_pieces_change_date: formData.movement_pieces_change_date || "",
    }

    const certificateType = certificateTypes.find((certificateType: CertificateType) => certificateType.id === selectedCertificate?.certificate_type_id);
    const certificateTypeExcludedFormFields = certificateType?.excluded_report_form_fields ? certificateType?.excluded_report_form_fields.filter((excludedFormField: string) => excludedFormField.startsWith("movement")) : []

    return (
        <div className="space-y-4">
            <Formik
                initialValues={initialValues}
                onSubmit={() => { }}>
                {({ values, errors, setFieldValue }) => {
                    useCertificateReportForm(values);
                    return (
                        <Form>
                            <div className='space-y-4'>
                                <h2 className="text-white text-xl font-semibold">Mouvement</h2>

                                {!certificateTypeExcludedFormFields?.includes("movement_type") && (
                                    <FormGroup>
                                        <Label
                                            htmlFor="movement_type"
                                            label="Type de mouvement"
                                            required />
                                        <Select
                                            error={errors.movement_type}
                                            value={values.movement_type}
                                            onChange={value => setFieldValue('movement_type', value)}
                                            id='movement_type'
                                            options={movementTypes.map((type: string) => (
                                                {
                                                    label: type,
                                                    value: type
                                                }
                                            ))}
                                            searchable />
                                    </FormGroup>
                                )}

                                {!certificateTypeExcludedFormFields?.includes("movement_functions") && (
                                    <FormGroup>
                                        <Label
                                            htmlFor="movement_functions"
                                            label="Fonctions du mouvement"
                                            required />
                                        <Select
                                            multiple
                                            error={errors.movement_functions}
                                            value={values.movement_functions}
                                            onChange={value => setFieldValue('movement_functions', value)}
                                            id='movement_functions'
                                            options={movementFunctions.map((func: string) => (
                                                {
                                                    label: func,
                                                    value: func
                                                }
                                            ))}
                                            searchable />
                                    </FormGroup>
                                )}

                                <FormRow>
                                    {!certificateTypeExcludedFormFields?.includes("movement_caliber_reference") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="movement_caliber_reference"
                                                label="Référence calibre"
                                                required />
                                            <Input
                                                error={errors.movement_caliber_reference}
                                                id='movement_caliber_reference'
                                                name='movement_caliber_reference'
                                                type='text'
                                            />
                                        </FormGroup>
                                    )}

                                    {!certificateTypeExcludedFormFields?.includes("movement_caliber_base") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="movement_caliber_base"
                                                label="Calibre de base" />
                                            <Input
                                                error={errors.movement_caliber_base}
                                                id='movement_caliber_base'
                                                name='movement_caliber_base'
                                                type='text'
                                            />
                                        </FormGroup>
                                    )}
                                </FormRow>

                                {!certificateTypeExcludedFormFields?.includes("movement_serial_number") && (
                                    <FormGroup>
                                        <Label
                                            htmlFor="movement_serial_number"
                                            label="Numéro de série du mouvement" />
                                        <Input
                                            error={errors.movement_serial_number}
                                            id='movement_serial_number'
                                            name='movement_serial_number'
                                            type='text'
                                        />
                                    </FormGroup>
                                )}

                                {!certificateTypeExcludedFormFields?.includes("movement_gems_number") && (
                                    <FormGroup>
                                        <Label
                                            htmlFor="movement_gems_number"
                                            label="Nombre de pierres" />
                                        <Input
                                            error={errors.movement_gems_number}
                                            id='movement_gems_number'
                                            name='movement_gems_number'
                                            type='number'
                                        />
                                    </FormGroup>
                                )}

                                <FormRow>
                                    {(values.movement_type === movementTypes[0]
                                        || values.movement_type === movementTypes[1]) && !certificateTypeExcludedFormFields?.includes("movement_power_reserve_announced") && (
                                            <FormGroup>
                                                <Label
                                                    htmlFor="movement_power_reserve_announced"
                                                    label="Réserve de marche annoncée (H)"
                                                />
                                                <Input
                                                    error={errors.movement_power_reserve_announced}
                                                    id='movement_power_reserve_announced'
                                                    name='movement_power_reserve_announced'
                                                    type='number'
                                                    placeholder='H'
                                                />
                                            </FormGroup>
                                        )}
                                    {!certificateTypeExcludedFormFields?.includes("movement_announced_amplitude") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="movement_announced_amplitude"
                                                label="Amplitude annoncée"
                                            />
                                            <Input
                                                error={errors.movement_announced_amplitude}
                                                id='movement_announced_amplitude'
                                                name='movement_announced_amplitude'
                                                type='number'
                                                placeholder='°'
                                            />
                                        </FormGroup>
                                    )}
                                </FormRow>

                                <FormRow>
                                    {!certificateTypeExcludedFormFields?.includes("movement_announced_frequency_hz") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="movement_announced_frequency_hz"
                                                label="Fréquence annoncée (Hz)"
                                            />
                                            <Input
                                                error={errors.movement_announced_frequency_hz}
                                                id='movement_announced_frequency_hz'
                                                name='movement_announced_frequency_hz'
                                                type='number'
                                                placeholder='Hz'
                                            />
                                        </FormGroup>
                                    )}

                                    {!certificateTypeExcludedFormFields?.includes("movement_announced_frequency_ah") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="movement_announced_frequency_ah"
                                                label="Fréquence annoncée (A/h)"
                                            />
                                            <Input
                                                error={errors.movement_announced_frequency_ah}
                                                id='movement_announced_frequency_ah'
                                                name='movement_announced_frequency_ah'
                                                type='number'
                                                placeholder='A/h'
                                            />
                                        </FormGroup>
                                    )}
                                </FormRow>

                                <div className='space-y-4 border-t border-white/10 py-8'>
                                    <div className='grid grid-cols-2 gap-4'>
                                        {!certificateTypeExcludedFormFields?.includes("movement_caliber_factory") && (
                                            <FormGroup>
                                                <Label
                                                    htmlFor="movement_caliber_factory"
                                                    label="Calibre d'origine"
                                                    required />
                                                <Select
                                                    error={errors.movement_caliber_factory}
                                                    value={values.movement_caliber_factory}
                                                    onChange={value => setFieldValue('movement_caliber_factory', value)}
                                                    id='movement_caliber_factory'
                                                    options={choiceOptions.map((option: string) => (
                                                        {
                                                            label: option,
                                                            value: option
                                                        }
                                                    ))} />
                                            </FormGroup>
                                        )}
                                        <div>
                                            <FormGroup>
                                                {!certificateTypeExcludedFormFields?.includes("movement_caliber_change") && (
                                                    <FormGroup>
                                                        <Label
                                                            htmlFor="movement_caliber_change"
                                                            label="Calibre remplacé" />
                                                        <Select
                                                            error={errors.movement_caliber_change}
                                                            value={values.movement_caliber_change}
                                                            onChange={value => setFieldValue('movement_caliber_change', value)}
                                                            id='movement_caliber_change'
                                                            options={movementChangeCaliberChoices.map((piece: string) => (
                                                                {
                                                                    label: piece,
                                                                    value: piece
                                                                }
                                                            ))} />
                                                    </FormGroup>
                                                )}

                                                {!certificateTypeExcludedFormFields?.includes("movement_pieces_change") && (
                                                    <FormGroup>
                                                        <Label
                                                            htmlFor="movement_pieces_change"
                                                            label="Pièce(s) remplacée(s)" />
                                                        <Select
                                                            error={errors.movement_pieces_change}
                                                            value={values.movement_pieces_change}
                                                            onChange={value => setFieldValue('movement_pieces_change', value)}
                                                            id='movement_pieces_change'
                                                            options={movementPieces.map((piece: string) => (
                                                                {
                                                                    label: piece,
                                                                    value: piece
                                                                }
                                                            ))} />
                                                    </FormGroup>
                                                )}

                                                {values.movement_caliber_change === movementChangeCaliberChoices[0] && (
                                                    <FormGroup>
                                                        {!certificateTypeExcludedFormFields?.includes("movement_pieces_change_date") && (
                                                            <FormGroup>
                                                                <Label
                                                                    htmlFor="movement_pieces_change_date"
                                                                    label="Date de remplacement" />
                                                                <Input
                                                                    error={errors.movement_pieces_change_date}
                                                                    id='movement_pieces_change_date'
                                                                    name='movement_pieces_change_date'
                                                                    placeholder={new Date().toLocaleDateString()}
                                                                    type='text'
                                                                />
                                                            </FormGroup>
                                                        )}
                                                    </FormGroup>
                                                )}
                                            </FormGroup>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </div >
    )
}

export default PartnerCertificationReportMovementModal