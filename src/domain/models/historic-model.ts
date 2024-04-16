import { Box } from './detection-result-model'

export type HistoricModel = {
  box: Box
  id: number
  iou: number
  class_name: string
  confidence: number
  created_at: string
  number_fps: number
  video_path: string
}
