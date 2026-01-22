import { Form, Formik, type FormikHelpers } from 'formik'
import { type FC } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { appName } from '@/main'
import FormRow from '@/components/UI/Form/Row'
import title from '@/utils/title'
import useAuth from '@/contexts/AuthContext'
import routes from '@/utils/routes'
import registerSchema from '@/validations/auth/register.schema'
import FormGroup from '@/components/UI/Form/Group'
import Label from '@/components/UI/Form/Label'
import Input from '@/components/UI/Form/Input'
import { Button } from '@/components/UI/Button'
import AppLink from '@/components/AppLink'
import Seperator from '@/components/UI/Separator'
import AuthMethods from '@/components/AuthMethods'

interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: FC = () => {
  const { user, signUp } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (values: RegisterFormValues, helpers: FormikHelpers<RegisterFormValues>) => {
    try {
      helpers.setSubmitting(true);

      const { data, error } = await signUp(values.email, values.password, values.firstName, values.lastName);

      if (error) {
        helpers.setFieldError('email', error.message || "Erreur lors de l'inscription");
        return;
      }

      if (data?.user && data.user.identities && data.user.identities.length === 0) {
        helpers.setFieldError('email', 'Email et/ou mot de passe incorrect');
        return;
      }

      navigate(routes.Login);
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
    } finally {
      helpers.setSubmitting(false);
    }
  };

  if (user) {
    return <Navigate to={routes.Dashboard.Main} />
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#050a08]">
      <title>{title('Créer un compte')}</title>

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
              Rejoignez <span className='text-emerald-500 font-bold'>{appName}</span>
            </h1>
            <p className='text-neutral-400 text-center mb-8 italic text-sm'>
              Créez votre compte en quelques secondes
            </p>

            <AuthMethods />
            <Seperator text='OU' />

            <Formik
              initialValues={{
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: ""
              }}
              onSubmit={handleRegister}
              validateOnBlur={false}
              validateOnChange={false}
              validateOnMount={false}
              validationSchema={registerSchema}>
              {({ errors, isSubmitting }) => (
                <Form className='space-y-5 mt-6'>
                  <FormRow>
                    <FormGroup>
                      <Label htmlFor='firstName' label='Prénom' />
                      <Input
                        error={errors.firstName}
                        type='text'
                        id='firstName'
                        name='firstName'
                        placeholder='John'
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor='lastName' label='Nom' />
                      <Input
                        error={errors.lastName}
                        type='text'
                        id='lastName'
                        name='lastName'
                        placeholder='Doe'
                      />
                    </FormGroup>
                  </FormRow>

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
                    <Label htmlFor='password' label='Mot de passe' />
                    <Input
                      error={errors.password}
                      type='password'
                      id='password'
                      name='password'
                      placeholder='********'
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor='confirmPassword' label='Confirmation du mot de passe' />
                    <Input
                      error={errors.confirmPassword}
                      type='password'
                      id='confirmPassword'
                      name='confirmPassword'
                      placeholder='********'
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
                          <span>Création...</span>
                        </>
                      ) : (
                        "Créer mon compte"
                      )}
                    </Button>

                    <p className='text-neutral-400 text-center mt-4 text-sm'>
                      Vous avez déjà un compte ?{' '}
                      <AppLink
                        to={routes.Login}
                        className='text-emerald-400 hover:text-emerald-300 font-bold uppercase'
                      >
                        Se connecter
                      </AppLink>
                    </p>
                  </FormGroup>
                </Form>
              )}
            </Formik>
          </div>

          <div className='space-y-4 mt-6'>
            <p className='text-neutral-400 text-center text-xs'>
              En créant votre compte, vous acceptez nos{' '}
              <AppLink
                to={routes.Cgu}
                className='text-emerald-400 hover:text-emerald-300 underline'
              >
                Conditions d'utilisation
              </AppLink>
            </p>

            <div className='text-center'>
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
    </div>
  )
}

export default RegisterPage