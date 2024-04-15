import { makeApiUrl } from '@/main/factories/http/api-url-factory'
import { makeAxiosHttpClient } from '@/main/factories/http/axios-http-client-factory'
import { AddInputUser } from '@/domain/usecases'
import { RemoteAddInputUser } from '@/data/usecases/input-user/input-user'

export const makeRemoteInputUser = (): AddInputUser => {
  return new RemoteAddInputUser(makeApiUrl('/user-input'), makeAxiosHttpClient())
}
