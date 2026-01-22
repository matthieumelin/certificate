import { useEffect, type FC } from 'react'
import CertificationSteps from '../../../Steps'
import FileUpload from '../../../../UI/Form/FileUpload';
import { Button } from '../../../../UI/Button';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { UserCertificateStep } from '../../../../../types/certificate';
import type { UploadedFile } from '../../../../../types/file';

interface CertificationPicturesModalProps {
    currentStep: UserCertificateStep;
    uploadedFiles: UploadedFile[];
    setUploadedFiles: (files: UploadedFile[]) => void;
    onPreviousStep: () => void;
    onNextStep: () => void;
}

const CertificationPicturesModal: FC<CertificationPicturesModalProps> = ({
    currentStep,
    uploadedFiles,
    setUploadedFiles,
    onPreviousStep,
    onNextStep
}) => {
    // place into props??
    const steps = Object.values(UserCertificateStep);
    const currentStepIndex = steps.indexOf(currentStep);

    const pictureTypes: string[] = ["Photo de face"]

    useEffect(() => {
        if (uploadedFiles.length === 0) {
            const initialFiles = pictureTypes.map((pictureType: string) => ({
                id: pictureType,
                file: null
            }));
            setUploadedFiles(initialFiles);
        }
    }, [])

    const handleUploadedFile = (id: string, files: File[]) => {
        setUploadedFiles(
            uploadedFiles.map(item =>
                item.id === id ? { ...item, file: files.length > 0 ? files[0] : null } : item
            )
        );
    }

    const currentFiles = uploadedFiles.find(item => item.id === "Photo de face")?.file;
    const initialFiles = currentFiles ? [currentFiles] : [];

    return (
        <div>
            <CertificationSteps
                currentStep={currentStep}
                steps={steps} />
            <div>
                <div className='my-8'>
                    <h2 className='text-2xl text-white font-bold'>Photo de l'objet</h2>
                    <p className='text-gray'>Téléchargez des photos claires et de bonne qualité</p>
                </div>
                <div className='rounded-xl border border-gray p-5'>
                    <h3 className='text-white font-medium'>Progression des photos</h3>
                    {pictureTypes && pictureTypes.length > 0 ? (
                        <ul className='mt-3'>
                            {pictureTypes.map((pictureType: string, index: number) => {
                                const isFilled = uploadedFiles.some((value: UploadedFile) => value.id === pictureType && value.file != null)
                                return <li key={index} className={`flex items-center gap-2 ${isFilled ? "text-green" : "text-gray"}`}>
                                    <div className={`w-4 h-4 border rounded-full ${isFilled ? "bg-green border-green" : "border-gray"}`}>
                                        {isFilled && (
                                            <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                    {pictureType}
                                </li>
                            })}
                        </ul>
                    ) : null}
                </div>
                <div className='mt-8'>
                    <h2 className='text-white'>Photo de face <span className='text-red-500'>*</span></h2>
                    <p className='text-gray mb-6'>Veuillez prendre une photo de face de l'objet, nette</p>
                    <FileUpload
                        initialFiles={initialFiles}
                        onFilesSelected={(files) => handleUploadedFile("Photo de face", files)}
                        maxFiles={1}
                        maxSizeMB={1}
                        acceptedFileTypes={['.jpg', '.png']}
                    />
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
                        onClick={onNextStep}
                        disabled={!uploadedFiles.some(file => file.file !== null)}
                        type='submit'
                        theme='primary'
                        className='lg:w-max'>
                        Suivant <IoIosArrowForward />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CertificationPicturesModal