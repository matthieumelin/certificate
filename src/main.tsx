import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import routes from './utils/routes'
import MainLayout from './components/Layouts/MainLayout'
import RegisterPage from './pages/Auth/Register'
import LoginPage from './pages/Auth/Login'
import NotFoundPage from './pages/NotFound'
import { AuthProvider } from './contexts/AuthContext'
import { Bounce, ToastContainer } from 'react-toastify';
import DashboardLayout from './components/Layouts/DashboardLayout'
import LogoutPage from './pages/Auth/Logout'
import DashboardPage from './pages/Dashboard'
import CertificatesPage from './pages/Dashboard/Certificates'
import CertificateDetailsPage from './pages/Dashboard/Certificates/Details'
import AdminDashboardPage from './pages/Dashboard/Admin/Dashboard'
import PartnerCertificates from './pages/Dashboard/Certificates/Partner'
import PaymentPage from './pages/Payment'
import SetPasswordPage from '@/pages/Auth/SetPassword'
import AuthCallback from '@/pages/Auth/Callback'
import HomePage from '@/pages/Home'
import DashboardProfilePage from '@/pages/Dashboard/Profile'
import ForgotPasswordPage from '@/pages/Auth/ForgotPassword'
import ResetPasswordPage from '@/pages/Auth/ResetPassword'

export const appName = import.meta.env.VITE_APP_NAME;
export const isDev = import.meta.env.MODE === 'development';

const router = createBrowserRouter([
  {
    path: routes.Home,
    element: <MainLayout />,
    children: [
      { index: true, path: routes.Home, element: <HomePage /> },
      { path: routes.Register, element: <RegisterPage /> },
      { path: routes.Login, element: <LoginPage /> },
      { path: routes.Callback, element: <AuthCallback /> },
      { path: routes.SetPassword, element: <SetPasswordPage /> },
      { path: routes.ForgotPassword, element: <ForgotPasswordPage /> },
      { path: routes.ResetPassword, element: <ResetPasswordPage /> },
      { path: routes.NotFound, element: <NotFoundPage /> },
      { path: routes.Dashboard.Payment, element: <PaymentPage /> },
    ]
  },
  {
    path: routes.Dashboard.Main,
    element: <DashboardLayout />,
    children: [
      { path: routes.Dashboard.Main, element: <DashboardPage /> },
      { path: routes.Dashboard.Profile, element: <DashboardProfilePage /> },

      { path: routes.Dashboard.Certificates.Main, element: <CertificatesPage /> },
      { path: routes.Dashboard.Certificates.Details, element: <CertificateDetailsPage /> },

      { path: routes.Dashboard.Admin.Main, element: <AdminDashboardPage /> },

      { path: routes.Dashboard.Partner.Certificates.List, element: <PartnerCertificates /> }
    ]
  },
  { path: routes.Logout, element: <LogoutPage /> },

  { path: "*", element: <NotFoundPage /> },
])

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Bounce}
    />
    <RouterProvider router={router} />
  </AuthProvider>
)
