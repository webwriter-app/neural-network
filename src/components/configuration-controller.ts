import type { ReactiveController } from 'lit'
import { str } from '@lit/localize'
import { listen } from './listen'
import type { WebwriterNeuralNetwork } from '../widgets/webwriter-neural-network'
import type { FileConfig, DataSet } from '../model/data-types'
import type { FileConfigV1 } from '../model/data-types'

import { DataSetUtils } from './data-sets/data-set-utils'
import { AlertUtils } from '../model/alert-utils'
import { CsvError, csvToDataSet, dataSetToCsv, fileStem, weightsOf } from '../model/csv-data'

export class ConfigurationController implements ReactiveController {
  host: WebwriterNeuralNetwork

  constructor(host: WebwriterNeuralNetwork) {
    this.host = host
    host.addController(this)
  }

  // HOST LIFECYCLE  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  private abort = new AbortController()

  hostConnected() {
    this.abort = new AbortController()
    // add event listeners for configuration related events on host
    listen(this.host.renderRoot, 'initiate-import', () => void this.initiateImport(), this.abort.signal)
    listen<FileConfigV1>(this.host.renderRoot, 'import-config', (e) => this.importConfig(e.detail), this.abort.signal)
    listen(this.host.renderRoot, 'export-config', () => void this.exportConfig(), this.abort.signal)
  }

  hostDisconnected() {
    this.abort.abort()
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  /** Reads and checks the text of a config file. Nothing is changed. */
  parseConfig(text: string): FileConfigV1 {
    let fileConfig: FileConfig
    try {
      fileConfig = JSON.parse(text)
    } catch {
      throw new Error(this.host.msg('The config you imported seems to be broken :('))
    }
    if (fileConfig?.version !== 1) {
      throw new Error(
        this.host.msg('The version of the config file is not compatible with the widget version you currently use!')
      )
    }
    const keys = ['settings', 'qAndA', 'availableDataSets', 'dataSet', 'layerConfs', 'layerConnectionConfs', 'trainOptions']
    if (!keys.every((key) => Object.hasOwn(fileConfig, key))) {
      throw new Error(this.host.msg('The config you imported seems to be broken :('))
    }
    return {
      version: 1,
      settings: fileConfig.settings,
      qAndA: fileConfig.qAndA,
      availableDataSets: fileConfig.availableDataSets,
      dataSet: fileConfig.dataSet,
      layerConfs: fileConfig.layerConfs,
      layerConnectionConfs: fileConfig.layerConnectionConfs,
      trainOptions: fileConfig.trainOptions,
    }
  }

  async initiateImport(): Promise<void> {
    const file = await this.pickFile()
    if (!file) return // picker dismissed
    try {
      this.importConfig(this.parseConfig(await file.text()))
    } catch (err: unknown) {
      const error = err as Error
      AlertUtils.spawn({
        message: error.message,
        variant: 'danger',
        icon: 'x-circle',
      })
    }
  }

  /** Prepares a config file for the editor's import; the returned function applies it. */
  async prepareConfigFile(file: File): Promise<() => void> {
    const config = this.parseConfig(await file.text())
    return () => this.importConfig(config)
  }

  /** Prepares a CSV file as a new data set (features first, label last); the returned function adds and selects it. */
  async prepareCsvFile(file: File): Promise<() => void> {
    let dataSet
    try {
      dataSet = csvToDataSet(await file.text(), fileStem(file.name.replace(/\.[^.]*$/, '')))
    } catch (error) {
      if (!(error instanceof CsvError)) throw error
      const line = error.line
      throw new Error(
        error.code === 'empty'
          ? this.host.msg('The CSV file needs at least two columns and one row of data.')
          : error.code === 'columns'
            ? this.host.msg(str`Line ${line} of the CSV file has a different number of columns than the first line.`)
            : this.host.msg(str`Line ${line} of the CSV file has a value that is not a number.`)
      )
    }
    dataSet.description = this.host.msg('Imported from a CSV file.')
    return () => this.addAndSelectDataSet(dataSet)
  }

  private addAndSelectDataSet(dataSet: DataSet): void {
    const taken = new Set(this.host.availableDataSets.map(({ name }) => name))
    let name = dataSet.name
    for (let n = 2; taken.has(name); n++) name = `${dataSet.name}-${n}`
    const added = { ...dataSet, name }
    this.host.availableDataSets = [...this.host.availableDataSets, added]
    this.host.modelController.discardModel()
    this.host.dataSet = added
  }

  async exportCsvFile(): Promise<File> {
    const dataSet = await DataSetUtils.loadData(this.host.dataSet)
    return new File([dataSetToCsv(dataSet)], `${fileStem(dataSet.name)}.csv`, { type: 'text/csv' })
  }

  /** The widget's configuration with the weights of the trained model, if there is one. */
  async exportModelFile(): Promise<File> {
    const config = await this.buildConfig()
    const weights = weightsOf(this.host.network?.tensorConfs)
    const model = Object.keys(weights).length ? { ...config, weights } : config
    return new File([JSON.stringify(model)], `${fileStem(config.dataSet.name)}-network.json`, { type: 'application/json' })
  }

  private async buildConfig(): Promise<FileConfigV1> {
    const availableDataSets = await Promise.all(this.host.availableDataSets.map((dataSet) => DataSetUtils.loadData(dataSet)))
    return {
      version: 1,
      settings: this.host.settings,
      qAndA: this.host.qAndA,
      availableDataSets,
      dataSet: await DataSetUtils.loadData(this.host.dataSet),
      layerConfs: this.host.layerConfs,
      layerConnectionConfs: this.host.layerConnectionConfs,
      trainOptions: this.host.trainOptions,
    }
  }

  importConfig(config: FileConfigV1): void {
    // only overwrite settings and help when in editable mode, else ignore the
    // imported ones
    if (this.host.editable) {
      this.host.settings = { ...config.settings }
      this.host.qAndA = [...config.qAndA]
    }

    this.host.dataSet = config.dataSet
    this.host.availableDataSets = config.availableDataSets
    this.host.layerConfs = config.layerConfs
    this.host.layerConnectionConfs = config.layerConnectionConfs
    this.host.trainOptions = config.trainOptions
    this.host.modelController.discardModel()
    this.host.panel = 'network'
    this.host.selected = {}

    AlertUtils.spawn({
      message: this.host.msg('The imported config was successfully loaded!'),
      variant: 'success',
      icon: 'check-circle',
    })

    // TODO this is not really nice and unreliable, but how to fix it?
    setTimeout(() => {
      this.host.canvas?.fit()
    }, 1000)
  }

  // reference to the detached file input so it is not garbage collected while
  // the picker is open
  fileInput?: HTMLInputElement

  /** Opens a file picker via <input type=file> */
  private async pickFile(): Promise<File | undefined> {
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json,application/json'
      const done = (file?: File) => {
        this.fileInput = undefined
        resolve(file)
      }
      input.addEventListener('change', () => done(input.files?.[0]))
      input.addEventListener('cancel', () => done(undefined))
      this.fileInput = input
      input.click()
    })
  }

  async exportConfig(): Promise<void> {
    const configJSON = JSON.stringify(await this.buildConfig())
    const url = URL.createObjectURL(
      new Blob([configJSON], { type: 'application/json' })
    )
    const a = document.createElement('a')
    a.href = url
    a.download = 'export.json'
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 10000)
    AlertUtils.spawn({
      message: this.host.msg('The current configuration was successfully exported!'),
      variant: 'success',
      icon: 'check-circle',
    })
  }
}
