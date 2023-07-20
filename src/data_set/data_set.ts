import { CLayer } from '@/components/network/c_layer'
import { DataSetInput } from '@/types/data_set_input'
import { DataSetLabel } from '@/types/data_set_label'

export class DataSet {
  // information about the dataSet
  name: string
  description: string
  type: 'regression' | 'classification'

  // formal description of input and labels, not the data
  inputs: DataSetInput[]
  label: DataSetLabel

  // data
  data: Array<{
    inputs: number[]
    label: number
  }>

  constructor(
    {
      name,
      description,
      type,
      inputs,
      label,
    }: {
      name: string
      description: string
      type: 'regression' | 'classification'
      inputs: DataSetInput[]
      label: DataSetLabel
    },
    data: Array<{ inputs: number[]; label: number }>
  ) {
    this.name = name
    this.description = description
    this.type = type
    this.inputs = inputs
    this.label = label
    this.data = data
  }

  /*
  GENERAL
  */
  unassignKey(key: string): void {
    this.assignKey(key, null)
  }

  assignKey(key: string, layer: CLayer): void {
    this.assignInputToLayer({ key, layer })
    this.assignLabelToLayer({ key, layer })
  }

  getByKey(key: string): DataSetInput | DataSetLabel {
    return this.getInputByKey(key) ?? this.getLabelByKey(key)
  }

  /*
  INPUTS
  */
  getNonAssignedInputKeys(): string[] {
    const nonAssignedInputs = this.inputs.filter((input) => !input.layer)
    return nonAssignedInputs.map((input) => input.key)
  }

  getAssignedInputsFor(layer: CLayer): DataSetInput[] {
    return this.inputs.filter((input) => input.layer == layer)
  }

  getInputByKey(key: string): DataSetInput {
    const input = this.inputs.find((input) => input.key == key)
    return input
  }

  private assignInputToLayer({
    key,
    layer,
  }: {
    key: string
    layer: CLayer
  }): void {
    const input = this.getInputByKey(key)
    if (input) {
      input.layer = layer
    }
  }

  getInputDataForLayer(layer: CLayer): number[][] {
    // get the indizes for the data that belongs to the layer
    const desiredIndizes = []
    for (const [index, input] of this.inputs.entries()) {
      if (input.layer == layer) desiredIndizes.push(index)
    }

    // filter the data
    const inputData = this.data.map(({ inputs }) =>
      inputs.filter((_input, index) => desiredIndizes.includes(index))
    )
    return inputData
  }

  /*
  LABEL
  */
  // returns our label key, only if it is not assigned
  getNonAssignedLabelKey(): string {
    if (!this.label.layer) {
      return this.label.key
    } else {
      return null
    }
  }

  // returns our label
  getLabelByKey(key: string): DataSetLabel {
    if (this.label.key == key) {
      return this.label
    } else {
      return null
    }
  }

  // assign our label to a layer
  private assignLabelToLayer({
    key,
    layer,
  }: {
    key: string
    layer: CLayer
  }): void {
    const label = this.getLabelByKey(key)
    if (label) {
      label.layer = layer
    }
  }

  getLabelData(): number[] {
    return this.data.map(({ label }) => label)
  }

  /*
  DATA
  */
  getData(): Array<{
    inputs: number[]
    label: number
  }> {
    return this.data
  }
}
