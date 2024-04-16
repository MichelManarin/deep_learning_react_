import React from 'react'
import { Historic } from '@/presentation/pages'
import { makeRemoteHistoric } from '@/main/factories/usecases/get-historic/remote-get-historic.factory'

export const makeHistoric: React.FC = () => {
  return (
    <Historic
      getHistoric={makeRemoteHistoric()}
    />
  )
}
