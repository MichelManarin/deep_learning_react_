import { DetectionResultModel } from '../models'

export type AddDetectionResultsParams = {
  number_fps: number
  user_input_id: number
  image_base64: string
}

export interface AddDetectionResult {
  add: (params: AddDetectionResultsParams) => Promise<DetectionResultModel>
}
