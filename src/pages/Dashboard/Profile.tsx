import ProfileCredentialsForm from '@/components/Forms/Profile/Credentials';
import ProfilePasswordForm from '@/components/Forms/Profile/Password';
import Loading from '@/components/UI/Loading';
import useAuth from '@/contexts/AuthContext';
import routes from '@/utils/routes';
import title from '@/utils/title';
import { type FC, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { UserProfileRole } from '@/types/user.d';
import ProfilePartnerInfoForm from '@/components/Forms/Profile/PartnerInfo';

type SettingsTab = 'profile' | 'security' | 'partner-info';

const DashboardProfilePage: FC = () => {
    const { user, userProfile, isLoadingUser, isLoadingProfile } = useAuth();
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

    const isPartner = userProfile?.role === UserProfileRole.Partner;

    if (isLoadingUser || isLoadingProfile) {
        return <Loading />
    }

    if (!user) {
        return <Navigate to={routes.Login} replace />
    }

    return (
        <div>
            <title>{title("Paramètres")}</title>

            <div className='p-5'>
                <h1 className='text-white text-3xl lg:text-4xl font-light mb-6'>
                    Paramètres
                </h1>

                <div className='flex gap-4 mb-6 border-b border-emerald-900/30'>
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`pb-3 px-4 font-medium transition-colors border-b-2 ${activeTab === 'profile'
                            ? 'text-emerald-400 border-emerald-400'
                            : 'text-neutral-400 hover:text-white border-transparent'
                            }`}
                    >
                        Profil
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`pb-3 px-4 font-medium transition-colors border-b-2 ${activeTab === 'security'
                            ? 'text-emerald-400 border-emerald-400'
                            : 'text-neutral-400 hover:text-white border-transparent'
                            }`}
                    >
                        Sécurité
                    </button>
                    {isPartner && (
                        <button
                            onClick={() => setActiveTab('partner-info')}
                            className={`pb-3 px-4 font-medium transition-colors border-b-2 ${activeTab === 'partner-info'
                                ? 'text-emerald-400 border-emerald-400'
                                : 'text-neutral-400 hover:text-white border-transparent'
                                }`}
                        >
                            Point de contrôle
                        </button>
                    )}
                </div>

                <div className='max-w-3xl'>
                    {activeTab === 'profile' && (
                        <div className='space-y-6'>
                            <div className='bg-black/40 backdrop-blur-sm border border-emerald-900/30 rounded-2xl p-6'>
                                <h2 className='text-white text-xl font-semibold mb-4'>
                                    Informations personnelles
                                </h2>
                                <ProfileCredentialsForm />
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className='space-y-6'>
                            <div className='bg-black/40 backdrop-blur-sm border border-emerald-900/30 rounded-2xl p-6'>
                                <h2 className='text-white text-xl font-semibold mb-4'>
                                    Sécurité
                                </h2>
                                <ProfilePasswordForm />
                            </div>
                        </div>
                    )}

                    {activeTab === 'partner-info' && isPartner && (
                        <div className='space-y-6'>
                            <div className='bg-black/40 backdrop-blur-sm border border-emerald-900/30 rounded-2xl p-6'>
                                <h2 className='text-white text-xl font-semibold mb-4'>
                                    Informations point de contrôle
                                </h2>
                                <p className='text-gray text-sm mb-6'>
                                    Ces informations seront affichées aux clients lors de la prise de rendez-vous.
                                </p>
                                <ProfilePartnerInfoForm />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DashboardProfilePage;