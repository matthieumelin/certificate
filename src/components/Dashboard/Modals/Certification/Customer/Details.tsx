import { type FC } from 'react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { Form, Formik } from 'formik';
import { UserCertificateStep } from '@/types/certificate';
import Steps from '@/components/Dashboard/Steps';
import FormGroup from '@/components/UI/Form/Group';
import Input from '@/components/UI/Form/Input';
import Label from '@/components/UI/Form/Label';
import { Button } from '@/components/UI/Button';
import detailsSchema from '@/validations/certificate/customer/details.schema';

interface CertificationDetailsModalProps {
    currentStep: UserCertificateStep;
    details: CertificationDetails;
    onPreviousStep: () => void;
    onSubmitDetails: (values: CertificationDetails) => void;
}

const CertificationDetailsModal: FC<CertificationDetailsModalProps> = ({
    currentStep,
    onPreviousStep,
    details,
    onSubmitDetails
}) => {
    const steps = Object.values(UserCertificateStep);
    const currentStepIndex = steps.indexOf(currentStep);

    return (
        <div>
            <Steps steps={steps} />
            <div>
                <div className='my-8'>
                    <h2 className='text-2xl text-white font-bold'>Informations de l'objet</h2>
                    <p className='text-gray'>Renseignez les détails de votre objet</p>
                </div>
                <Formik
                    initialValues={{
                        brand: details.brand,
                        model: details.model,
                        estimedPrice: details.estimedPrice,
                        ownOriginal: details.ownOriginal,
                        notes: details.notes || '',
                        ref: details.ref || ''
                    }}
                    onSubmit={onSubmitDetails}
                    validationSchema={detailsSchema}
                    validateOnBlur={false}
                    validateOnChange={false}
                    validateOnMount={false}>
                    {({ errors, isValid, dirty, isSubmitting }) => (
                        <Form>
                            <div className='grid gap-4'>
                                <FormGroup>
                                    <Label htmlFor='brand' label='Marque' required />
                                    <Input type='text' id='brand' name='brand' error={errors.brand}
                                        placeholder='Ex: Rolex, Hermès, Apple...' />
                                </FormGroup>
                                <FormGroup>
                                    <Label htmlFor='model' label='Modèle' required />
                                    <Input type='text' id='model' name='model' error={errors.model}
                                        placeholder='Ex: Submariner, Birkin 30...' />
                                </FormGroup>
                                <FormGroup>
                                    <Label htmlFor='ref' label='Référence (optionnel)' />
                                    <Input type='text' id='ref' name='ref' error={errors.ref}
                                        placeholder='Ex: 116610LN' />
                                </FormGroup>
                                <FormGroup>
                                    <Label htmlFor='estimedPrice' label='Prix estimé (€)' required />
                                    <Input type='number' id='estimedPrice' name='estimedPrice' error={errors.estimedPrice}
                                        placeholder='Ex: 15000' />
                                </FormGroup>
                                <FormGroup>
                                    <Input
                                        label="Je possède les documents originaux (certificat d'authenticité, facture...), accessoires et/ou la boîte d'origine"
                                        type='checkbox' id='ownOriginal' name='ownOriginal' error={errors.ownOriginal} />
                                </FormGroup>
                                <FormGroup>
                                    <Label htmlFor='notes' label='Notes additionnelles (optionnel)' />
                                    <Input
                                        placeholder='Ajoutez des informations supplémentaires (historique, état, particularités...)'
                                        type='textarea'
                                        id='notes'
                                        name='notes'
                                        error={errors.notes} />
                                </FormGroup>
                            </div>
                            <div className='grid md:grid-cols-3 gap-4 items-center border-t-2 border-white/20 mt-8 pt-5'>
                                <Button
                                    theme="secondary"
                                    className='lg:w-max'
                                    onClick={onPreviousStep}>
                                    <IoIosArrowBack /> Précédent
                                </Button>
                                <p className='text-gray'>Étape {currentStepIndex + 1} sur {steps.length}</p>
                                <Button
                                    type='submit'
                                    theme='primary'
                                    className='lg:w-max'
                                    disabled={!isValid || !dirty || isSubmitting}>
                                    Suivant <IoIosArrowForward />
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default CertificationDetailsModal