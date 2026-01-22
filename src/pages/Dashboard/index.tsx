import Loading from '@/components/UI/Loading';
import useAuth from '@/contexts/AuthContext';
import routes from '@/utils/routes';
import { type FC } from 'react'
import { Navigate } from 'react-router-dom';

const DashboardPage: FC = () => {
  const { user, userProfile, isLoadingUser } = useAuth();

  if (isLoadingUser) {
    return <Loading />
  }

  if (!user) {
    return <Navigate to={routes.Login} replace />
  }

  return (
    <div>
      <div className='p-5'>
        <h1 className='text-white text-3xl lg:text-4xl font-light mb-2'>
          Tableau de bord
        </h1>
        <p className='text-neutral-400 italic'>Bon retour parmis nous, {userProfile?.first_name} {userProfile?.last_name} !</p>
      </div>
    </div>
  )
}

export default DashboardPage