import { AccountModel } from '../models'

export interface SaveAccessToken {
  save: (account: AccountModel) => void
}
