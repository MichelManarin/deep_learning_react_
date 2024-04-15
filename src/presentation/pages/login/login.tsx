import React, { useState, useEffect, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FormContext, ApiContext } from '@/presentation/contexts'
import { Input, FormStatus, SubmitButton } from '@/presentation/components'
import { Validation } from '@/presentation/protocols/validation'
import { Authentication } from '@/domain/usecases'

type Props = {
  validation: Validation
  authentication: Authentication
}

const Login: React.FC<Props> = ({ validation, authentication }: Props) => {
  const { setCurrentAccount } = useContext(ApiContext)
  const history = useHistory()
  const [state, setState] = useState({
    isLoading: false,
    isFormInvalid: true,
    email: '',
    password: '',
    emailError: 'Campo obrigatório',
    passwordError: 'Campo obrigatório',
    mainError: ''
  })
  useEffect(() => {
    const { email, password } = state
    const formData = { email, password }
    const emailError = validation.validate('email', formData)
    const passwordError = validation.validate('password', formData)
    setState({
      ...state,
      emailError: emailError,
      passwordError: passwordError,
      isFormInvalid: !!emailError || !!passwordError
    })
  }, [state.email, state.password])
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    try {
      if (state.isLoading || state.isFormInvalid) {
        return
      }
      setState({ ...state, isLoading: true })
      const account = await authentication.auth({
        email: state.email, password: state.password
      })
      setCurrentAccount(account)
      history.replace('/')
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        mainError: error.message
      })
    }
  }
  return (
    <div className='h-full bg-gray-50 flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]'>
        <div className='bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12'>
          <FormContext.Provider value={{ state, setState }}>
            <form data-testid="form" className='space-y-6' onSubmit={handleSubmit}>
              <Input
                label='Confidence'
                labelProps={{
                  htmlFor: 'confidence',
                  className:
                    'block text-sm font-medium leading-6 text-gray-900'
                }}
                inputProps={{
                  required: true,
                  id: 'confidence',
                  name: 'confidence',
                  type: 'confidence',
                  autoComplete: 'confidence',
                  className:
                    'block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                }}
              />

              <Input
                label='Iou'
                labelProps={{
                  htmlFor: 'iou',
                  className:
                    'block text-sm font-medium leading-6 text-gray-900'
                }}
                inputProps={{
                  required: true,
                  id: 'iou',
                  name: 'iou',
                  type: 'iou',
                  autoComplete: '',
                  className:
                    'block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-5'
                }}
              />
              <FormStatus />

              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <input
                    id='remember-me'
                    name='remember-me'
                    type='checkbox'
                    className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600'
                  />
                  <label
                    htmlFor='remember-me'
                    className='ml-3 block text-sm leading-6 text-gray-900'
                  >
                    Lembre de mim
                  </label>
                </div>

                <div className='text-sm leading-6'>
                  <a
                    href='#'
                    className='font-semibold text-indigo-600 hover:text-indigo-500'
                  >
                    Esqueceu sua senha?
                  </a>
                </div>
              </div>

              <div>
                <SubmitButton text='Entrar' className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'/>
              </div>
            </form>
          </FormContext.Provider>
        </div>
        <p className="mt-10 text-center text-sm text-gray-500">
          Ainda não é um membro?
          <Link data-testid="signup-link" to="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 ml-1">
            Crie uma conta gratuita!
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
