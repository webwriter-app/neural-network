export type DataSetConfig = {
  name: string
  description: string
  inputs: Array<{
    key: string
    description: string
  }>
  label: {
    type: 'classification' | 'regression'
    key: string
    description: string
    classes?: Array<{
      key: string
      description: string
    }>
  }
}
