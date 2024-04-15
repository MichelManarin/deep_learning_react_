export type Box = {
  height: number
  width: number
  left: number
  top: number
}

export type DetectionResultModel = {
  box: Box
  class_name: string
  confidence: number
}
