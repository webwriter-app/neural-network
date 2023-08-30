export interface LabelDesc {
  key: string
  description: string
  // classes only for label in classification dataset
  classes?: Array<{
    id: number
    description: string
  }>
}
