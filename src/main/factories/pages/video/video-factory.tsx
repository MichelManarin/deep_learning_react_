import React from 'react'
import { Video } from '@/presentation/pages'
import { makeVideoValidation } from './video-validation-factory'
import { makeRemoteInputUser } from '@/main/factories/usecases/add-input-user/remote-add-input-user-factory'
import { makeRemoteDetectionResults } from '@/main/factories/usecases/detection-results/remote-add-detection-results-factory'

export const makeVideo: React.FC = () => {
  return (
    <Video
      validation={makeVideoValidation()}
      addInputUser={makeRemoteInputUser()}
      addDetectionResult={makeRemoteDetectionResults()}
    />
  )
}
