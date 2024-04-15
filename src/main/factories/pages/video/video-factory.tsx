import React from 'react'
import { Video } from '@/presentation/pages'
import { makeVideoValidation } from './video-validation-factory'
import { makeRemoteInputUser } from '@/main/factories/usecases/add-input-user/remote-add-input-user-factory'

export const makeVideo: React.FC = () => {
  return (
    <Video
      addInputUser={makeRemoteInputUser()}
      validation={makeVideoValidation()}
    />
  )
}
