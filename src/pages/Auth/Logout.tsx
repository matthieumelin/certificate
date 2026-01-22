import useAuth from '@/contexts/AuthContext'
import routes from '@/utils/routes'
import { useEffect, type FC } from 'react'
import { useNavigate } from 'react-router-dom'

const LogoutPage: FC = () => {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut()
        navigate(routes.Login, { replace: true })
      } catch (error) {
        navigate(routes.Login, { replace: true })
      }
    }

    handleLogout()
  }, [signOut, navigate])

  return (
    <div className='h-screen flex items-center justify-center'>
      <div className='text-center'>
        <div className='w-12 h-12 border-4 border-green border-t-transparent rounded-full animate-spin mx-auto'></div>
        <p className='text-white mt-4'>Déconnexion en cours...</p>
      </div>
    </div>
  )
}

export default LogoutPage