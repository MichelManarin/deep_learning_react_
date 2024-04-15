import { AddAccountParams } from '@/domain/usecases'

export const mockAddAccountParams = (): AddAccountParams => {
  const password = 'any_password'
  return {
    name: 'any_name',
    email: 'any_email',
    password: password,
    passwordConfirmation: password
  }
}
