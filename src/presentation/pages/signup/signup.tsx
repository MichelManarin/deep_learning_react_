import React, { useState, useEffect, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FormContext, ApiContext } from '@/presentation/contexts'
import { Input, FormStatus, SubmitButton } from '@/presentation/components'
import { Validation } from '@/presentation/protocols/validation'
import { AddAccount } from '@/domain/usecases'

type Props = {
  validation: Validation
  addAccount: AddAccount
}

const SignUp: React.FC<Props> = ({ validation, addAccount }: Props) => {
  const { setCurrentAccount } = useContext(ApiContext)
  const history = useHistory()
  const [state, setState] = useState({
    isLoading: false,
    isFormInvalid: true,
    name: '',
    email: '',
    password: '',
    nameError: '',
    emailError: '',
    passwordError: '',
    passwordConfirmation: '',
    passwordConfirmationError: '',
    mainError: ''
  })
  useEffect(() => {
    const { name, email, password, passwordConfirmation } = state
    const formData = { name, email, password, passwordConfirmation }
    const nameError = validation.validate('name', formData)
    const emailError = validation.validate('email', formData)
    const passwordError = validation.validate('password', formData)
    const passwordConfirmationError = validation.validate('passwordConfirmation', formData)
    setState({
      ...state,
      nameError,
      emailError,
      passwordError,
      passwordConfirmationError,
      isFormInvalid: !!nameError || !!emailError || !!passwordError || !!passwordConfirmationError
    })
  }, [state.name, state.email, state.password, state.passwordConfirmation])
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    try {
      if (state.isLoading || state.isFormInvalid) {
        return
      }
      setState({ ...state, isLoading: true })
      const account = await addAccount.add({
        name: state.name,
        email: state.email,
        password: state.password,
        passwordConfirmation: state.passwordConfirmation
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
                label='Digite seu nome'
                labelProps={{
                  htmlFor: 'name',
                  className:
                    'block text-sm font-medium leading-6 text-gray-900'
                }}
                inputProps={{
                  required: true,
                  id: 'name',
                  name: 'name',
                  type: 'text',
                  autoComplete: 'name',
                  className:
                    'block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                }}
              />

              <Input
                label='E-mail'
                labelProps={{
                  htmlFor: 'email',
                  className:
                    'block text-sm font-medium leading-6 text-gray-900'
                }}
                inputProps={{
                  required: true,
                  id: 'email',
                  name: 'email',
                  type: 'email',
                  autoComplete: 'email',
                  className:
                    'block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                }}
              />

              <Input
                label='Senha'
                labelProps={{
                  htmlFor: 'email',
                  className:
                    'block text-sm font-medium leading-6 text-gray-900'
                }}
                inputProps={{
                  required: true,
                  id: 'password',
                  name: 'password',
                  type: 'password',
                  autoComplete: '',
                  className:
                    'block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-5'
                }}
              />

              <Input
                label='Repita sua senha'
                labelProps={{
                  htmlFor: 'passwordConfirmation',
                  className:
                    'block text-sm font-medium leading-6 text-gray-900'
                }}
                inputProps={{
                  required: true,
                  id: 'passwordConfirmation',
                  name: 'passwordConfirmation',
                  type: 'password',
                  autoComplete: '',
                  className:
                    'block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-5'
                }}
              />

              <FormStatus />

              <div>
                <SubmitButton text="Criar conta" className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600' />
              </div>
            </form>
          </FormContext.Provider>
        </div>
        <p className="mt-10 text-center text-sm text-gray-500">
          <Link data-testid="login-link" replace to="/login" className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500 ml-1'>
            Voltar para a página de Login!
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp
