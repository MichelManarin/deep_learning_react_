import { HttpPostClient, HttpStatusCode } from '@/data/protocols/http'
import { UnexpectedError } from '@/domain/errors'
import { DetectionResultModel } from '@/domain/models'
import { AddDetectionResult, AddDetectionResultsParams } from '@/domain/usecases'

export class RemoteAddDetectionResult implements AddDetectionResult {
  constructor (
    private readonly url: string,
    private readonly httpPostClient: HttpPostClient<AddDetectionResultsParams, DetectionResultModel>
  ) {}

  async add (params: AddDetectionResultsParams): Promise<DetectionResultModel> {
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
