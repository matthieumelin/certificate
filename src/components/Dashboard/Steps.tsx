import { FaCheck } from "react-icons/fa6";
import { useCertificateStore } from "@/stores/certificateStore";
import { PartnerCertificateStep, UserCertificateStep } from "@/types/certificate.d";
import { PartnerCertificateStepLabels, UserCertificateStepLabels } from "@/helpers/translations";

interface StepsProps<T extends UserCertificateStep | PartnerCertificateStep> {
    steps: T[];
}

const Steps = <T extends UserCertificateStep | PartnerCertificateStep>({
    steps
}: StepsProps<T>) => {
    const { draft } = useCertificateStore();
    const currentStepIndex = steps.indexOf(draft.current_step as T);

    const getStepLabel = (step: T): string => {
        if (Object.values(PartnerCertificateStep).includes(step as PartnerCertificateStep)) {
            return PartnerCertificateStepLabels[step as PartnerCertificateStep];
        }
        return UserCertificateStepLabels[step as UserCertificateStep];
    };

    return (
        <div className='mb-8 flex items-center justify-between'>
            {steps.map((step: T, index: number) => {
                const isCompleted = currentStepIndex > index;
                const isCurrent = currentStepIndex === index;

                return (
                    <div key={index} className='flex items-center flex-1'>
                        <div className='flex flex-col items-center gap-2 relative z-10'>
                            <div className={`
                                font-bold border-2 w-12 h-12 
                                flex justify-center items-center rounded-full 
                                transition-all duration-300
                                ${isCompleted
                                    ? "border-emerald-500 bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                                    : isCurrent
                                        ? "text-emerald-400 border-emerald-500 bg-emerald-900/20 shadow-lg shadow-emerald-500/10"
                                        : "text-neutral-500 border-emerald-900/30 bg-black/20"
                                }
                            `}>
                                {isCompleted ? <FaCheck size={16} /> : index + 1}
                            </div>
                            <h3 className={`mt-1 text-xs uppercase font-bold tracking-wide transition-colors duration-200 text-center ${isCompleted || isCurrent
                                    ? "text-emerald-400"
                                    : "text-neutral-500"
                                }`}>
                                {getStepLabel(step)}
                            </h3>
                        </div>
                        {index < steps.length - 1 && (
                            <div className='flex-1 h-1 mx-4 relative' style={{ top: '-16px' }}>
                                <div className='h-full bg-emerald-900/20 rounded-full overflow-hidden'>
                                    <div
                                        className={`h-full bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-full transition-all duration-500 ${currentStepIndex > index ? "w-full" : "w-0"
                                            }`}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default Steps;