export type AddInputUserParams = {
  iou: number
  path: string
  confidence: number
}

export interface AddInputUser {
  add: (params: AddInputUserParams) => Promise<any>
}
