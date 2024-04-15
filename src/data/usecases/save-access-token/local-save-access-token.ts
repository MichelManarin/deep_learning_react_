import { SetStorage } from '@/data/protocols/cache/set-storage'
import { UnexpectedError } from '@/domain/errors'
import { AccountModel } from '@/domain/models'
import { SaveAccessToken } from '@/domain/usecases/save-access-token'

export class LocalSaveAccessToken implements SaveAccessToken {
  constructor (private readonly setStorage: SetStorage) {}

  save (account: AccountModel): void {
    if (!account?.accessToken) {
      throw new UnexpectedError()
    }
    this.setStorage.set('account', account)
  }
}
