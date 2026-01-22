import { Button } from "@/components/UI/Button";
import { UserCertificateStep } from "@/types/certificate";
import type { ObjectType } from "@/types/object";
import type { FC } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface CertificationTypeModalProps {
    objectTypes: ObjectType[];
    currentStep: UserCertificateStep;
    selectedObjectType: number | undefined;
    onSelectObjectType: (id: number) => void;
    onNextStep: () => void;
}

const CertificationTypeModal: FC<CertificationTypeModalProps> = ({
    objectTypes,
    currentStep,
    selectedObjectType,
    onSelectObjectType,
    onNextStep
}) => {
    // place into props??
    const steps = Object.values(UserCertificateStep);
    const currentStepIndex = steps.indexOf(currentStep);

    return (
        <div>
            <CertificationSteps
                steps={steps} />
            <div>
                <div className='my-8'>
                    <h2 className='text-2xl text-white font-bold'>Type d'objet</h2>
                    <p className='text-gray'>Sélectionnez le type d'objet que vous souhaitez certifier</p>
                </div>
                {objectTypes && objectTypes.length > 0 ? (
                    <div className='mt-6 grid lg:grid-cols-4 gap-5'>
                        {objectTypes.map((objectType: ObjectType) => (
                            <div
                                key={objectType.id}
                                onClick={() => onSelectObjectType(objectType.id)}
                                className={`cursor-pointer group duration-200 ${selectedObjectType === objectType.id
                                    ? "border-green bg-green/5"
                                    : "hover:border-green border-white/10"
                                    } flex flex-col items-center justify-center gap-2 border-2 rounded-xl p-5 transition-all`}>
                                <div className='text-4xl group-hover:scale-110 transition-transform duration-200'>
                                    {objectType.icon}
                                </div>
                                <h2 className='text-white text-center font-semibold'>{objectType.label}</h2>
                            </div>
                        ))}
                    </div>
                ) : <p className="text-gray">
                    Il n' y a aucun type d'objet
                </p>}
            </div>
            <div className='grid md:grid-cols-3 gap-4 items-center border-t-2 border-white/20 mt-8 pt-5'>
                <Button
                    disabled={currentStep === UserCertificateStep.Type}
                    theme="secondary"
                    className='lg:w-max'>
                    <IoIosArrowBack /> Précédent
                </Button>
                <p className='text-gray text-center'>Étape {currentStepIndex + 1} sur {steps.length}</p>
                <Button
                    onClick={onNextStep}
                    theme='primary'
                    className='lg:w-max'
                    disabled={!selectedObjectType}>
                    Suivant <IoIosArrowForward />
                </Button>
            </div>
        </div>
    )
}

export default CertificationTypeModal;