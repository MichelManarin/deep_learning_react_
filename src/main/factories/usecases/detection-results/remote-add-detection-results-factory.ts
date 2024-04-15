import { makeApiUrl } from '@/main/factories/http/api-url-factory'
import { makeAxiosHttpClient } from '@/main/factories/http/axios-http-client-factory'
import { AddDetectionResult } from '@/domain/usecases'
import { RemoteAddDetectionResult } from '@/data/usecases/detection-result/detection-result'

export const makeRemoteDetectionResults = (): AddDetectionResult => {
  return new RemoteAddDetectionResult(makeApiUrl('/detection-result'), makeAxiosHttpClient())
}
