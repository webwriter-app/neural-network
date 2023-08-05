export interface DataSetLabel {
  key: string
  description: string
  // classes only for label in classification dataset
  classes?: Array<{
    key: string
    description: string
  }>
}
