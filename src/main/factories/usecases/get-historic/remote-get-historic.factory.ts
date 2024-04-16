import { makeApiUrl } from '@/main/factories/http/api-url-factory'
import { makeAxiosHttpClient } from '@/main/factories/http/axios-http-client-factory'
import { GetHistoric } from '@/domain/usecases'
import { RemoteGetHistoric } from '@/data/usecases/historic/historic'

export const makeRemoteHistoric = (): GetHistoric => {
  return new RemoteGetHistoric(makeApiUrl('/historic'), makeAxiosHttpClient())
}
