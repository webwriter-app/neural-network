import { DataSet } from '@/data_set/data_set'
import { DataSetConfig } from '@/types/data_set_config'

export abstract class DataSetFactory {
  constructor() {
    return
  }

  static async openDataSet(basepath: string): Promise<DataSet> {
    // parse JSON config
    const jsonFile = await fetch(`${basepath}/config.json`)
    const jsonObject: JSON = <JSON>await jsonFile.json()
    const config: DataSetConfig = <DataSetConfig>Object.create(jsonObject)

    // load data
    const dataFile = await fetch(`${basepath}/data.txt`)
    const text = await dataFile.text()
    const lines = text.split('\n')
    const data: Array<{
      inputs: number[]
      label: number
    }> = []
    for (const line of lines) {
      // remove spaces in the beginning and end with trim and use split to
      // convert into array of the values
      const values: string[] = line.trim().split(/\s+/)

      // parse input and output data (config.inputs.length * input values and
      // one output/label)
      const inputs: number[] = []
      let index = 0
      for (const _input of config.inputs) {
        inputs.push(parseInt(values[index]))
        index += 1
      }
      const label: number = parseInt(values[index])

      // add parsed data from this line to the data array
      data.push({
        inputs: inputs,
        label: label,
      })
    }

    return new DataSet(config, data)
  }

  static getDataSetByName(name: string): Promise<DataSet> {
    switch (name) {
      case 'Boston House Pricing':
        return this.openDataSet('/data_set/boston')
      case 'Pima Indians Diabetes':
        return this.openDataSet('/data_set/diabetes')
    }
  }

  static getOptions(): string[] {
    return ['Boston House Pricing', 'Pima Indians Diabetes']
  }
}
