export type DataSetConfig = {
  name: string
  description: string
  type: 'classification' | 'regression'
  inputs: Array<{
    key: string
    description: string
  }>
  label: {
    key: string
    description: string
    classes?: Array<{
      key: string
      description: string
    }>
  }
}
