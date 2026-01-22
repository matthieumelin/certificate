import { type FC, useRef } from 'react'
import { toast } from 'react-toastify';
import { Form, Formik, type FormikProps } from 'formik';
import Select from '@/components/UI/Form/Select';
import type { ObjectBrand, ObjectModel, ObjectReference } from '@/types/object.d';
import { useCertificateReportStore } from '@/stores/certificateReportStore';
import { withCurrentValueOption } from '@/helpers/select';
import { CertificateInspectionResult, CertificateStatus, type CertificateType } from '@/types/certificate.d';
import useAuth from '@/contexts/AuthContext';
import { useApi } from '@/hooks/useApi';
import { useCertificateInspections, usePartnerCertificates } from '@/hooks/useSupabase';
import FormGroup from '@/components/UI/Form/Group';
import Label from '@/components/UI/Form/Label';
import certificateInspectionSchema from '@/validations/certificate/partner/inspection.schema';
import FileUpload from '@/components/UI/Form/FileUpload';
import Input from '@/components/UI/Form/Input';
import { Button } from '@/components/UI/Button';

interface ResultButtonProps {
    authentic: boolean;
    label: string;
    active: boolean;
    onSelectResult: () => void;
}

interface SuspectPointCheckBoxProps {
    id: string;
    label: string;
    checked: boolean;
    onChange: () => void;
}

interface ExtraSuspectPointsProps {
    extraSuspectPoints: string[];
    selectedPoints: string[];
    onToggleSuspectPoint: (suspectPoint: string) => void;
}

interface PartnerCertificationInspectionModalProps {
    certificateTypes: CertificateType[];
    objectBrands: ObjectBrand[];
    objectModels: ObjectModel[];
    objectReferences: ObjectReference[];
    onClose: () => void;
    onStartReport: () => void;
    onSuccess: () => void;
}

interface FormValues {
    brand: string;
    model: string;
    reference: string;
    serialNumber: string;
    result: CertificateInspectionResult | null;
    suspectPoints: string[];
    comment: string;
    photos: string[];
}

const ResultButton: FC<ResultButtonProps> = ({ authentic, label, active, onSelectResult }) => {
    return (
        <button
            className={`text-sm border rounded-full px-3 py-px hover:text-black duration-200 ${authentic ? "text-green border-green hover:bg-green" : "text-red-500 border-red-500 hover:bg-red-500"}
            ${active ? `${authentic ? "bg-green" : "bg-red-500"} text-black!` : ''}`}
            type="button"
            onClick={onSelectResult}>{label}</button>
    )
}

const SuspectPointCheckBox: FC<SuspectPointCheckBoxProps> = ({ id, checked, label, onChange }) => {
    return (
        <div className='flex items-center gap-2'>
            <input
                className='relative peer shrink-0 appearance-none w-4 h-4 border border-white/10 rounded-sm checked:bg-green checked:border-0 
                after:content-[""] after:absolute after:hidden after:left-[5px] after:top-0.5 after:w-1.5 after:h-2.5
                after:border-white after:border-r-2 after:border-b-2 after:rotate-45 checked:after:block'
                type="checkbox"
                name={id}
                id={id}
                checked={checked}
                onChange={onChange}
            />
            <label
                htmlFor={id}
                className='text-white'>{label}</label>
        </div>
    )
}

const ExtraSuspectPoints: FC<ExtraSuspectPointsProps> = ({ selectedPoints, extraSuspectPoints, onToggleSuspectPoint }) => {
    return (
        <div>
            {extraSuspectPoints.map((extraSuspectPoint: string, index: number) => (
                <SuspectPointCheckBox
                    key={`esp_${index}`}
                    id={extraSuspectPoint}
                    label={extraSuspectPoint}
                    checked={selectedPoints.includes(extraSuspectPoint)}
                    onChange={() => onToggleSuspectPoint(extraSuspectPoint)} />
            ))}
        </div>
    )
}

const PartnerCertificationInspectionModal: FC<PartnerCertificationInspectionModalProps> = ({
    certificateTypes,
    objectBrands,
    objectModels,
    objectReferences,
    onClose,
    onStartReport,
    onSuccess,
}) => {
    const { user } = useAuth();
    const { selectedCertificate } = useCertificateReportStore();
    const { updatePartnerCertificate } = usePartnerCertificates();
    const { createCertificateInspection } = useCertificateInspections();
    const { request } = useApi();

    const formRef = useRef<FormikProps<FormValues>>(null);

    const initialValues: FormValues = {
        brand: selectedCertificate?.object?.brand || '',
        model: selectedCertificate?.object?.model || '',
        reference: selectedCertificate?.object?.reference || '',
        serialNumber: selectedCertificate?.object?.serial_number || '',
        result: null,
        suspectPoints: [],
        comment: '',
        photos: []
    }

    const suspectPoints = [
        "Boitier",
        "Bracelet",
        "Mouvement",
        "Cadran",
        "Index",
        "Aiguilles",
        "Numéro de série",
        "Dimensions",
        "Poids",
        "Matériaux",
    ]
    const extraSuspectPoints = [
        "Documents",
        "Accessoires"
    ]

    const handleSubmit = async (values: FormValues) => {
        if (!selectedCertificate) {
            toast.error("Erreur lors de la récupération des données du certificat");
            return;
        }

        const result = await createCertificateInspection(
            selectedCertificate.id,
            user?.id!,
            values.result!,
            values.suspectPoints,
            values.comment,
            values.photos);

        if (!result) {
            toast.error("Impossible de créer l'inspection");
            return;
        }

        if (values.result === CertificateInspectionResult.InauthenticItem) {
            const certificateType = certificateTypes.find((type: CertificateType) => type.id === selectedCertificate.certificate_type_id);
            if (!certificateType) {
                console.error(`Certificate type #${selectedCertificate.certificate_type_id} not found.`);
                toast.warning("Inspection créée, mais impossible d'envoyer l'email au client.");
                return;
            }

            await updatePartnerCertificate(selectedCertificate.id, {
                status: CertificateStatus.Completed
            });

            await request('/send-inauthentic-alert', {
                method: 'POST',
                body: {
                    certificateId: selectedCertificate.id,
                    objectModel: values.model,
                    objectBrand: values.brand,
                    objectReference: values.reference,
                    suspectPoints: values.suspectPoints,
                    expertComment: values.comment,
                    imagesUrl: result.photos,
                }
            })

            toast.success("Inspection réussie");
            await onSuccess();
            onClose();
        } else if (values.result === CertificateInspectionResult.AuthenticItem) {
            await updatePartnerCertificate(selectedCertificate.id, {
                status: CertificateStatus.InspectionCompleted
            });

            await onSuccess();
            onClose();
            onStartReport();
        }
    }

    const getAvailablePoints = (result: CertificateInspectionResult | null) => {
        return result === CertificateInspectionResult.InauthenticItem
            ? [...suspectPoints, ...extraSuspectPoints]
            : extraSuspectPoints;
    }

    const handleToggleSuspectPoint = (suspectPoint: string, currentValues: FormValues) => {
        if (!formRef.current) return;

        const allAvailablePoints = getAvailablePoints(currentValues.result);

        if (suspectPoint === "all") {
            const allSelected = allAvailablePoints.every(point => currentValues.suspectPoints.includes(point));

            if (allSelected) {
                formRef.current.setFieldValue('suspectPoints', []);
            } else {
                formRef.current.setFieldValue('suspectPoints', allAvailablePoints);
            }
        } else {
            const current = currentValues.suspectPoints || [];
            const updated = current.includes(suspectPoint) ? current.filter(point => point !== suspectPoint) : [...current, suspectPoint];
            formRef.current.setFieldValue('suspectPoints', updated);
        }
    };

    const results = Object.values(CertificateInspectionResult);

    return (
        <div>
            <Formik
                innerRef={formRef}
                initialValues={initialValues}
                validationSchema={certificateInspectionSchema}
                validateOnBlur={false}
                validateOnChange={false}
                validateOnMount={false}
                onSubmit={handleSubmit}>
                {({ values, setFieldValue, isSubmitting, errors }) => {
                    const allAvailablePoints = getAvailablePoints(values.result);
                    const allSelected = allAvailablePoints.every(point => values.suspectPoints.includes(point));

                    return (
                        <Form>
                            <div className='grid gap-4'>
                                <FormGroup>
                                    <Label htmlFor='brand' label='Marque' required />
                                    <Select
                                        disabled
                                        allowAdd
                                        id='brand'
                                        error={errors.brand}
                                        value={values.brand}
                                        onChange={(value: string | string[]) => setFieldValue("brand", value)}
                                        options={withCurrentValueOption(objectBrands.map((objectBrand: ObjectBrand) => (
                                            { label: objectBrand.name, value: objectBrand.name }
                                        )), values.brand)} />
                                </FormGroup>

                                <FormGroup>
                                    <Label htmlFor='model' label='Modèle' required />
                                    <Select
                                        disabled
                                        allowAdd
                                        id='model'
                                        error={errors.model}
                                        value={values.model}
                                        onChange={(value: string | string[]) => setFieldValue("model", value)}
                                        options={withCurrentValueOption(objectModels.map((objectModel: ObjectModel) => (
                                            { label: objectModel.name, value: objectModel.name })), values.model)} />
                                </FormGroup>

                                <FormGroup>
                                    <Label htmlFor='reference' label='Référence' required />
                                    <Select
                                        disabled
                                        allowAdd
                                        id='reference'
                                        error={errors.reference}
                                        value={values.reference}
                                        onChange={(value: string | string[]) => setFieldValue("reference", value)}
                                        options={withCurrentValueOption(objectReferences.map((objectReference: ObjectReference) => (
                                            { label: objectReference.name, value: objectReference.name })), values.reference)} />
                                </FormGroup>

                                <FormGroup>
                                    <Label htmlFor="serialNumber" label="Numéro de série" required />
                                    <Input disabled id='serialNumber' name='serialNumber' type='text' placeholder="116610LN" error={errors.serialNumber} />
                                </FormGroup>

                                <FormGroup>
                                    <Label htmlFor='result' label="Résultat de l'inspection" required />
                                    {results && results.length > 0 ? (
                                        <div className='flex flex-wrap gap-2'>
                                            {results.map((result: CertificateInspectionResult, index: number) => (
                                                <ResultButton
                                                    key={index}
                                                    authentic={result === CertificateInspectionResult.AuthenticItem}
                                                    active={values.result === result}
                                                    onSelectResult={() => {
                                                        setFieldValue('result', result);
                                                        setFieldValue('suspectPoints', []);
                                                    }}
                                                    label={result === CertificateInspectionResult.AuthenticItem ? "Pièce authentique" : "Pièce inauthentique"} />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className='text-gray'>Aucun résultat disponible</p>
                                    )}
                                </FormGroup>

                                {values.result && (
                                    <div className='mt-5'>
                                        <div className='flex flex-wrap gap-2'>
                                            <h2 className='text-white font-semibold'>Points suspects identifiés</h2>
                                            <button
                                                onClick={() => handleToggleSuspectPoint('all', values)}
                                                className={`text-sm text-green border border-green px-2 py-px rounded-full ${allSelected ? "bg-green text-black!" : 'duration-200 hover:bg-green hover:text-black'}`}
                                                type="button">
                                                {allSelected ? "Tout désélectionner" : "Tout sélectionner"}
                                            </button>
                                        </div>
                                        {values.result === CertificateInspectionResult.InauthenticItem ? (
                                            <div className='mt-3'>
                                                {suspectPoints && suspectPoints.length > 0 ? (
                                                    <div>
                                                        {suspectPoints.map((suspectPoint: string, index: number) => (
                                                            <SuspectPointCheckBox
                                                                key={index}
                                                                id={suspectPoint}
                                                                label={suspectPoint}
                                                                checked={values.suspectPoints.includes(suspectPoint)}
                                                                onChange={() => handleToggleSuspectPoint(suspectPoint, values)} />
                                                        ))}
                                                    </div>
                                                ) : null}
                                                {extraSuspectPoints && extraSuspectPoints.length > 0 ? (
                                                    <ExtraSuspectPoints
                                                        selectedPoints={values.suspectPoints}
                                                        extraSuspectPoints={extraSuspectPoints}
                                                        onToggleSuspectPoint={point => handleToggleSuspectPoint(point, values)} />
                                                ) : null}
                                            </div>
                                        ) : values.result === CertificateInspectionResult.AuthenticItem ? (
                                            <div className='mt-3'>
                                                {extraSuspectPoints && extraSuspectPoints.length > 0 ? (
                                                    <ExtraSuspectPoints
                                                        selectedPoints={values.suspectPoints}
                                                        extraSuspectPoints={extraSuspectPoints}
                                                        onToggleSuspectPoint={point => handleToggleSuspectPoint(point, values)} />
                                                ) : null}
                                            </div>
                                        ) : null}
                                    </div>
                                )}

                                <FormGroup>
                                    <Label htmlFor='comment' label="Commentaire de l'expert" />
                                    <Input
                                        type='textarea'
                                        id='comment'
                                        name='comment'
                                        error={errors.comment} />
                                </FormGroup>

                                <FormGroup>
                                    <Label htmlFor='photos' label='Photos' required />
                                    <FileUpload
                                        bucketName="certificate_inspections"
                                        uploadPath={selectedCertificate?.id || 'temp'}
                                        value={values.photos}
                                        onChange={(paths) => setFieldValue('photos', paths)}
                                        maxFiles={5}
                                        maxSizeMB={5}
                                        acceptedFileTypes={['.jpg', '.png']}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Button
                                        type='submit'
                                        disabled={isSubmitting || !values.result
                                            || !values.photos || values.photos.length < 5
                                        }>
                                        {values.result === CertificateInspectionResult.AuthenticItem ? "Poursuivre" :
                                            "Terminer l'inspection"}
                                    </Button>
                                </FormGroup>
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default PartnerCertificationInspectionModal