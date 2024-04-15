import { HttpPostClient, HttpStatusCode } from '@/data/protocols/http'
import { UnexpectedError } from '@/domain/errors'
import { InputUserModel } from '@/domain/models/input-user-model'
import { AddInputUser, AddInputUserParams } from '@/domain/usecases'

export class RemoteAddInputUser implements AddInputUser {
  constructor (
    private readonly url: string,
    private readonly httpPostClient: HttpPostClient<AddInputUserParams, InputUserModel>
  ) {}

  async add (params: AddInputUserParams): Promise<InputUserModel> {
    const httpResponse = await this.httpPostClient.post({
      url: this.url,
      body: params
    })
    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: return httpResponse.body
      default: throw new UnexpectedError()
    }
  }
}
