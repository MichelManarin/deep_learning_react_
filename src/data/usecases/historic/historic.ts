import { HttpGetClient, HttpStatusCode } from '@/data/protocols/http'
import { UnexpectedError } from '@/domain/errors'
import { HistoricModel } from '@/domain/models'
import { GetHistoric } from '@/domain/usecases'

export class RemoteGetHistoric implements GetHistoric {
  constructor (
    private readonly url: string,
    private readonly httpGetClient: HttpGetClient<HistoricModel[]>
  ) {}

  async get (): Promise<HistoricModel[]> {
    const httpResponse = await this.httpGetClient.get({
      url: this.url
    })
    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: return httpResponse.body
      default: throw new UnexpectedError()
    }
  }
}
