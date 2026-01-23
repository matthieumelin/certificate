import { Form, Formik, type FormikHelpers } from 'formik'
import { type FC } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { appName } from '@/main'
import title from '@/utils/title'
import useAuth from '@/contexts/AuthContext'
import routes from '@/utils/routes'
import AuthMethods from '@/components/AuthMethods'
import Seperator from '@/components/UI/Separator'
import loginSchema from '@/validations/auth/login.schema'
import FormGroup from '@/components/UI/Form/Group'
import Label from '@/components/UI/Form/Label'
import Input from '@/components/UI/Form/Input'
import { Button } from '@/components/UI/Button'
import AppLink from '@/components/AppLink'

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginPage: FC = () => {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values: LoginFormValues, helpers: FormikHelpers<LoginFormValues>) => {
    try {
      await signIn(values.email, values.password);
      navigate(routes.Dashboard.Main);
    } catch (error: any) {
      console.error("Erreur lors de la connexion:", error);

      if (error?.message?.includes('Invalid login credentials')) {
        helpers.setFieldError('email', ' ');
        helpers.setFieldError('password', 'Email ou mot de passe incorrect');
      } else if (error?.message?.includes('Email not confirmed')) {
        helpers.setFieldError('email', 'Veuillez confirmer votre adresse e-mail avant de vous connecter');
      } else {
        console.error(error?.message || 'Une erreur est survenue lors de la connexion');
      }
    }
  }

  if (user) {
    return <Navigate to={routes.Dashboard.Main} replace />
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#050a08]">
      <title>{title('Se connecter')}</title>

      <div className="absolute inset-0 bg-linear-to-br from-emerald-900/20 to-[#0a1410] pointer-events-none"></div>
      <div className="absolute -left-24 -top-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>

      <div className='min-h-screen flex flex-col items-center justify-center p-6 relative z-10'>
        <div className='w-full max-w-md'>
          <Link to={routes.Home} className="flex justify-center mb-8">
            <img src="/logo.png" alt={appName} className='max-w-24 hover:scale-105 transition-transform' />
          </Link>

          <div className='bg-black/40 backdrop-blur-sm border border-emerald-900/30 p-8 rounded-3xl'>
            <h1 className='text-3xl text-white text-center font-light mb-2'>
              Bienvenue sur <span className='text-emerald-500 font-bold'>{appName}</span>
            </h1>
            <p className='text-neutral-400 text-center mb-8 italic text-sm'>
              Connectez-vous pour accéder à votre compte
            </p>

            <AuthMethods />
            <Seperator text='OU' />

            <Formik
              initialValues={{ email: "", password: "" }}
              onSubmit={handleSubmit}
              validateOnBlur={false}
              validateOnChange={false}
              validateOnMount={false}
              validationSchema={loginSchema}>
              {({ errors, isSubmitting }) => (
                <Form className='space-y-5 mt-6'>
                  <FormGroup>
                    <Label htmlFor='email' label='Email' />
                    <Input
                      error={errors.email}
                      type='email'
                      id='email'
                      name='email'
                      placeholder='johndoe@exemple.fr'
                    />
                  </FormGroup>

                  <FormGroup>
                    <div className='flex items-center justify-between mb-2'>
                      <Label htmlFor='password' label='Mot de passe' />
                      <Link
                        className='text-xs text-emerald-400 hover:text-emerald-300 transition-colors uppercase font-bold'
                        to={routes.ForgotPassword}
                      >
                        Mot de passe oublié ?
                      </Link>
                    </div>
                    <Input
                      error={errors.password}
                      type='password'
                      id='password'
                      name='password'
                      placeholder="********"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Button
                      type='submit'
                      disabled={isSubmitting}
                      className='w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-bold uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      {isSubmitting ? (
                        <>
                          <span className='animate-spin'>⏳</span>
                          <span>Connexion...</span>
                        </>
                      ) : (
                        "Se connecter"
                      )}
                    </Button>

                    <p className='text-neutral-400 text-center mt-4 text-sm'>
                      Vous n'avez pas de compte ?{' '}
                      <AppLink
                        to={routes.Register}
                        className='text-emerald-400 hover:text-emerald-300 font-bold uppercase'
                      >
                        S'enregistrer
                      </AppLink>
                    </p>
                  </FormGroup>
                </Form>
              )}
            </Formik>
          </div>

          <div className='text-center mt-6'>
            <Link
              to={routes.Home}
              className='text-emerald-400 hover:text-emerald-300 text-sm font-bold uppercase border-b border-emerald-400/20 hover:border-emerald-400 pb-1 transition-all'
            >
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage