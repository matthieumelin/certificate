import { supabase } from '@/lib/supabase';
import routes from '@/utils/routes';
import { useEffect, type FC } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthCallback: FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                const { data, error } = await supabase.auth.getSession();

                if (error || !data.session) {
                    console.error("OAuth callback error:", error);
                    navigate(routes.Login, { replace: true });
                    return;
                }

                const user = data.session.user;

                const userCreatedAt = new Date(user.created_at).getTime();
                const now = Date.now();
                const isNewUser = (now - userCreatedAt) < 10000;

                if (isNewUser && user.email) {
                    // const username = user.user_metadata?.full_name ||
                    //     user.user_metadata?.user_name ||
                    //     user.email.split('@')[0] ||
                    //     'Utilisateur';

                    // await sendMail({
                    //     to: user.email,
                    //     subject: `Bienvenue sur ${appName} !`,
                    //     html: welcomeEmailTemplate({ username })
                    // }).catch(error => {
                    //     console.error("Erreur lors de l'envoi du mail de bienvenue:", error);
                    // });
                }

                navigate(routes.Dashboard.Main, { replace: true });
            } catch (error) {
                console.error("Erreur lors du callback OAuth:", error);
                navigate(routes.Login, { replace: true });
            }
        }

        handleAuthCallback();
    }, [navigate])

    return (
        <div className='min-h-screen flex items-center justify-center'>
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green mx-auto mb-4"></div>
                <p className='text-white'>Connexion en cours...</p>
            </div>
        </div>
    )
}

export default AuthCallback