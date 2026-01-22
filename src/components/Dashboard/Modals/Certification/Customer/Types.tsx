import Map from '@/components/Map';
import { Button } from '@/components/UI/Button';
import { UserCertificateStep, type CertificateType } from '@/types/certificate';
import { type ChangeEvent, type FC, type ReactNode } from 'react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

interface CertificationServicesModalProps {
    certificateTypes: CertificateType[];
    currentStep: UserCertificateStep;
    selectedDeliveryMethod: string | null;
    selectedCertificateType: CertificateType | null;
    onSelectCertificateType: (id: number) => void;
    onSelectDeliveryMethod: (id: string) => void;
    onPreviousStep: () => void;
    onNextStep: () => void;
}

interface DeliveryMethodRadioProps {
    id: string;
    value: string;
    label: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const DeliveryMethodRadio: FC<DeliveryMethodRadioProps> = ({ id, value, label, onChange }) => {
    return (
        <div className='flex items-center gap-2'>
            <input
                className='accent-green'
                onChange={onChange}
                value={value}
                checked={value === id}
                type="radio"
                name={id}
                id={id} />
            <label className='text-white' htmlFor={id}>{label}</label>
        </div>
    )
}

interface BoxProps {
    title: string;
    children: ReactNode;
}

const Box: FC<BoxProps> = ({ title, children }) => {
    return (
        <div className='border border-white/10 p-5 rounded-xl mt-8'>
            <h2 className='text-white text-xl font-bold'>{title}</h2>
            <div>
                {children}
            </div>
        </div>
    )
}

const CertificationCertificateTypesModal: FC<CertificationServicesModalProps> = ({ certificateTypes, currentStep, selectedDeliveryMethod, selectedCertificateType, onPreviousStep, onNextStep, onSelectCertificateType, onSelectDeliveryMethod }) => {
    // place into props??
    const steps = Object.values(UserCertificateStep);
    const currentStepIndex = steps.indexOf(currentStep);

    return (
        <div>
            <CertificationSteps
                steps={steps} />
            <div>
                <div className='my-8'>
                    <h2 className='text-2xl text-white font-bold'>Choix de la certification</h2>
                    <p className='text-gray'>Sélectionnez la certification souhaitée.</p>
                </div>
                {certificateTypes && certificateTypes.length > 0 ? (
                    <div className='grid lg:grid-cols-2 gap-5'>
                        {certificateTypes.map((certicateType: CertificateType) => {
                            const selected = selectedCertificateType != null && selectedCertificateType.id === certicateType.id;
                            return (
                                <ServiceCard
                                    key={certicateType.id}
                                    data={certicateType}
                                    selected={selected}
                                    onSelect={() => onSelectCertificateType(certicateType.id)} />
                            )
                        })}
                    </div>
                ) : null}

                {selectedCertificateType && (
                    <div>
                        {selectedCertificateType.physical && (
                            <Box title={`Options ${selectedCertificateType.name}`}>
                                <div className='mt-2'>
                                    <h3 className='text-gray'>Mode de livraison</h3>
                                    <div className='mt-2'>
                                        <DeliveryMethodRadio
                                            onChange={() => { onSelectDeliveryMethod("dropoff") }}
                                            value={selectedDeliveryMethod || ''}
                                            id='dropoff'
                                            label='Je dépose ou envoie mon objet au point de contrôle' />
                                    </div>
                                </div>

                                {selectedDeliveryMethod === "dropoff" && (
                                    <Map
                                        className='mt-5'
                                        center={{
                                            lat: 10.99835602,
                                            lng: 77.01502627
                                        }}
                                        zoom={11} />
                                )}
                            </Box>
                        )}

                        <Box title='Récapitulatif'>
                            <div className='my-4'>
                                <div className='flex items-center justify-between gap-3 text-gray'>
                                    <h3>Abonnement {selectedCertificateType.name}</h3>
                                    <h4 className='text-white'>{selectedCertificateType.price.toFixed(2)}€</h4>
                                </div>
                            </div>
                            <div className='pt-4 flex items-center justify-between border-t border-white/10'>
                                <h3 className='text-white text-xl font-bold'>Total</h3>
                                <h4 className='text-green text-xl font-bold'>{selectedCertificateType.price.toFixed(2)}</h4>
                            </div>
                        </Box>

                    </div>
                )}

            </div>
            <div className='flex flex-col lg:flex-row lg:justify-between gap-4 items-center border-t-2 border-white/20 mt-8 pt-5'>
                <Button
                    onClick={onPreviousStep}
                    theme="secondary"
                    className='lg:w-max'>
                    <IoIosArrowBack /> Précédent
                </Button>
                <p className='text-gray'>Étape {currentStepIndex + 1} sur {steps.length}</p>
                <Button
                    onClick={onNextStep}
                    disabled={!selectedCertificateType}
                    theme='primary'
                    className='lg:w-max'>
                    Suivant <IoIosArrowForward />
                </Button>
            </div>
        </div>
    )
}

export default CertificationCertificateTypesModal