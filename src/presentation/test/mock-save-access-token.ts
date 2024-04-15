import { AccountModel } from '@/domain/models'
import { SaveAccessToken } from '@/domain/usecases/save-access-token'

export class SaveAccessTokenMock implements SaveAccessToken {
  account: AccountModel

  async save (account: AccountModel): Promise<void> {
    this.account = account
    return Promise.resolve()
  }
}
