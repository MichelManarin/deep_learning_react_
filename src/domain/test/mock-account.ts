import { AuthenticationParams } from '@/domain/usecases'
import { AccountModel } from '../models'

export const mockAuthentication = (): AuthenticationParams => ({
  email: 'any_email',
  password: 'any_password'
})

export const mockAccountModel = (): AccountModel => ({
  accessToken: 'fake_acess_token'
})
