import type { AuthError, Session, User } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState, useRef, type FC, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase';
import type { UserProfile, UserProfileType } from '@/types/user';
import routes from '@/utils/routes';

interface AuthContextType {
    isLoadingUser: boolean;
    user: User | null;
    userProfile: UserProfile | null;
    isLoadingProfile: boolean;
    isOAuthUser: boolean;
    signUp: (
        email: string,
        password: string,
        firstName: string,
        lastName: string
    ) => Promise<{
        data: {
            user: User | null;
            session: Session | null;
        } | null;
        error: AuthError | null;
    }>;
    signIn: (email: string, password: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>,
    setPassword: (newPassword: string) => Promise<boolean>,
    resetPassword: (email: string) => Promise<void>;
    updateCredentials: (email: string, firstName: string, lastName: string, society: string, vatNumber: string, address: string, city: string, postalCode: string, country: string, type: UserProfileType) => Promise<{
        success: boolean;
        emailChanged: boolean;
    }>;
}


interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);
    const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true);

    const profileLoadedRef = useRef<boolean>(false);

    const isOAuthUser = user?.app_metadata?.provider !== 'email' && user?.app_metadata?.provider !== undefined;

    const fetchUserProfile = async (userId: string) => {
        if (profileLoadedRef.current) {
            return;
        }

        try {
            setIsLoadingProfile(true);

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;

            setUserProfile(data);
            profileLoadedRef.current = true;
        } catch (error) {
            console.error('Erreur lors du chargement du profil:', error);
            setUserProfile(null);
        } finally {
            setIsLoadingProfile(false);
        }
    };

    useEffect(() => {
        const {
            data: { subscription }
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'INITIAL_SESSION') {
                setUser(session?.user ?? null);
                setIsLoadingUser(false);

                if (session?.user) {
                    fetchUserProfile(session.user.id);
                } else {
                    setIsLoadingProfile(false);
                }
            }

            if (event === 'SIGNED_IN' && session?.user) {
                setUser(session.user);
                fetchUserProfile(session.user.id);
            }

            if (event === 'SIGNED_OUT') {
                setUser(null);
                setUserProfile(null);
                setIsLoadingProfile(false);
                profileLoadedRef.current = false;
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = async (
        email: string,
        password: string,
        firstName: string,
        lastName: string
    ): Promise<{
        data: { user: User | null; session: Session | null } | null;
        error: AuthError | null;
    }> => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                },
                emailRedirectTo: `${window.location.origin}/login`
            },
        });

        return { data, error };
    };

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        });

        if (error) throw error;
    };

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
    }

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }

    const changePassword = async (currentPassword: string, newPassword: string) => {
        if (!user?.email) {
            throw new Error("Utilisateur non connecté");
        }

        try {
            const { data, error } = await supabase.rpc("update_password", {
                p_user_id: user.id,
                p_current_password: currentPassword,
                p_new_password: newPassword
            });

            if (error) {
                if (error.message.includes('mot de passe actuel est incorrect')) {
                    throw new Error('Le mot de passe actuel est incorrect');
                }
                throw new Error(error.message || 'Erreur lors du changement de mot de passe');
            }

            return data === "success";
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Une erreur inattendue est survenue');
        }
    }

    const setPassword = async (newPassword: string) => {
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
            data: {
                has_password: true
            }
        });

        if (error) throw error;

        return true;
    }

    const resetPassword = async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}${routes.ResetPassword}`
        });

        if (error) throw error;
    };

    const updateCredentials = async (email: string, firstName: string, lastName: string, society: string, vatNumber: string, address: string, city: string, postalCode: string, country: string, type: UserProfileType) => {
        if (!user?.id) {
            throw new Error("Utilisateur non connecté");
        }

        try {
            const { data, error } = await supabase.rpc("update_user_credentials", {
                p_user_id: user.id,
                p_new_email: email,
                p_new_first_name: firstName,
                p_new_last_name: lastName,
                p_new_society: society,
                p_new_vat_number: vatNumber,
                p_new_address: address,
                p_new_city: city,
                p_new_postal_code: postalCode,
                p_new_country: country,
                p_new_type: type
            });

            if (error) {
                if (error.message.includes('email est déjà utilisé')) {
                    throw new Error('Cet email est déjà utilisé par un autre compte');
                }
                throw new Error(error.message || 'Erreur lors de la mise à jour');
            }

            if (userProfile) {
                setUserProfile({
                    ...userProfile,
                    email: email,
                    first_name: firstName,
                    last_name: lastName,
                    society: society,
                    vat_number: vatNumber,
                    address: address,
                    city: city,
                    postal_code: postalCode,
                    country: country,
                    type: type,
                    updated_at: new Date().toISOString()
                });
            }

            return {
                success: data.success,
                emailChanged: data.email_changed,
            };
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Une erreur inattendue est survenue');
        }
    }

    return (
        <AuthContext.Provider value={{
            isLoadingUser,
            user,
            userProfile,
            isLoadingProfile,
            isOAuthUser,
            signUp,
            signIn,
            signInWithGoogle,
            signOut,
            changePassword,
            setPassword,
            resetPassword,
            updateCredentials
        }}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export default useAuth;