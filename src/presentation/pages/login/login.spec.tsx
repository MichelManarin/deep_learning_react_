import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { RenderResult, cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import { ValidationStub, AuthenticationSpy } from '@/presentation/test'
import { Login } from '@/presentation/pages'
import { ApiContext } from '@/presentation/contexts'
import { AccountModel } from '@/domain/models'

type SutTypes = {
  sut: RenderResult
  validationStub: ValidationStub
  authenticationSpy: AuthenticationSpy
  setCurrentAccountMock: (account: AccountModel) => void
}

const history = createMemoryHistory({ initialEntries: ['/login'] })
const makeSut = (): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  const setCurrentAccountMock = jest.fn()
  const sut = render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
      <Router history={history}>
        <Login validation={validationStub} authentication={authenticationSpy} />
      </Router>
    </ApiContext.Provider>
  )
  return {
    sut,
    validationStub,
    authenticationSpy,
    setCurrentAccountMock
  }
}

const simulateValidSubmit = (sut: RenderResult, email = 'any_email', password = 'any_password'): void => {
  populateEmailField(sut, email)
  populatePasswordField(sut, password)
  const submitButton = sut.getByTestId('submit')
  fireEvent.click(submitButton)
}

const populateEmailField = (sut: RenderResult, email = 'any_email'): void => {
  const emailInput = sut.getByTestId('email')
  fireEvent.input(emailInput, { target: { value: email } })
}

const populatePasswordField = (sut: RenderResult, password = 'any_password'): void => {
  const passwordInput = sut.getByTestId('password')
  fireEvent.input(passwordInput, { target: { value: password } })
}

describe('Login component', () => {
  afterEach(cleanup)

  test('Should start with initial state', () => {
    const { sut } = makeSut()
    const submitButton = sut.getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBe(false)
    const emailStatus = sut.getByTestId('email-status')
    const passwordStatus = sut.getByTestId('password-status')
    expect(emailStatus.title).toBe('Tudo certo!')
    expect(passwordStatus.title).toBe('Tudo certo!')
    expect(emailStatus.textContent).toBe('')
    expect(passwordStatus.textContent).toBe('')
  })

  test('Should show email error if Validation fails', () => {
    const { sut, validationStub } = makeSut()
    const errorMessage = 'any_error'
    validationStub.errorMessage = errorMessage
    populateEmailField(sut)
    const emailStatus = sut.getByTestId('email-status')
    expect(emailStatus.title).toBe(errorMessage)
  })

  test('Should show password error if Validation fails', () => {
    const { sut, validationStub } = makeSut()
    const errorMessage = 'any_error'
    validationStub.errorMessage = errorMessage
    populatePasswordField(sut)
    const passwordStatus = sut.getByTestId('password-status')
    expect(passwordStatus.title).toBe(errorMessage)
  })

  test('Should show valid password state if Validation succeeds', () => {
    const { sut, validationStub } = makeSut()
    validationStub.errorMessage = null
    const password = 'any_password'
    populatePasswordField(sut, password)
    const passwordStatus = sut.getByTestId('password-status')
    expect(passwordStatus.title).toBe('Tudo certo!')
  })

  test('Should show valid email state if Validation succeeds', () => {
    const { sut, validationStub } = makeSut()
    validationStub.errorMessage = null
    const email = 'any_email'
    populateEmailField(sut, email)
    const passwordStatus = sut.getByTestId('email-status')
    expect(passwordStatus.title).toBe('Tudo certo!')
  })

  test('Should enable submit button if form is valid', () => {
    const { sut, validationStub } = makeSut()
    validationStub.errorMessage = null
    const email = 'any_email'
    const password = 'any_password'
    populateEmailField(sut, email)
    populatePasswordField(sut, password)
    const submitButton = sut.getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBe(false)
  })

  test('Should call Authentication with correct values', () => {
    const { sut, validationStub, authenticationSpy } = makeSut()
    validationStub.errorMessage = null
    const email = 'any_email'
    const password = 'any_password'
    simulateValidSubmit(sut, email, password)
    expect(authenticationSpy.params).toEqual({
      email,
      password
    })
  })

  test('Should call Authentication only once', () => {
    const { sut, validationStub, authenticationSpy } = makeSut()
    validationStub.errorMessage = null
    simulateValidSubmit(sut)
    simulateValidSubmit(sut)
    expect(authenticationSpy.callsCount).toBe(1)
  })

  test('Should not call Authentication if form is invalid', () => {
    const { sut, validationStub, authenticationSpy } = makeSut()
    validationStub.errorMessage = 'any_error'
    populateEmailField(sut)
    fireEvent.submit(sut.getByTestId('form'))
    expect(authenticationSpy.callsCount).toBe(0)
  })

  // test('Should present error if Authentication fails', async () => {
  //   const { sut, validationStub, authenticationSpy } = makeSut()
  //   validationStub.errorMessage = 'any_error'
  //   jest.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(new InvalidCredentialsError())
  //   simulateValidSubmit(sut)
  //   const errorWrap = sut.getByTestId('error-wrap')
  //   await waitFor(() => errorWrap)
  //   const mainError = sut.getByTestId('main-error')
  //   expect(1).toEqual(1)
  //   // expect(mainError.textContent).toBe(error.message)
  //   // expect(errorWrap.childElementCount).toBe(1)
  // })

  test('Should call SaveAccessToken on success', async () => {
    const { sut, authenticationSpy, setCurrentAccountMock } = makeSut()
    simulateValidSubmit(sut)
    await waitFor(() => sut.getByTestId('form'))
    expect(setCurrentAccountMock).toHaveBeenCalledWith(authenticationSpy.account)
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/')
  })

  test('Should go to sigup page', () => {
    const { sut } = makeSut()
    const register = sut.getByTestId('signup-link')
    fireEvent.click(register)
    expect(history.length).toBe(2)
    expect(history.location.pathname).toBe('/signup')
  })
})
