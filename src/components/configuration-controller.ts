import type { ReactiveController } from 'lit'
import { listen } from './listen'
import type { WebwriterNeuralNetwork } from '../widgets/webwriter-neural-network'
import type { FileConfig } from '../model/data-types'
import type { FileConfigV1 } from '../model/data-types'

import { DataSetUtils } from './data-sets/data-set-utils'
import { AlertUtils } from '../model/alert-utils'

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
  async initiateImport(): Promise<void> {
    const file = await this.pickFile()
    if (!file) return // picker dismissed
    try {
      const text = await file.text()
      let fileConfig: FileConfig = await JSON.parse(text)

      switch (fileConfig.version) {
        case 1: {
          if (
            !(
              Object.hasOwn(fileConfig, 'settings') &&
              Object.hasOwn(fileConfig, 'qAndA') &&
              Object.hasOwn(fileConfig, 'availableDataSets') &&
              Object.hasOwn(fileConfig, 'dataSet') &&
              Object.hasOwn(fileConfig, 'layerConfs') &&
              Object.hasOwn(fileConfig, 'layerConnectionConfs') &&
              Object.hasOwn(fileConfig, 'trainOptions')
            )
          ) {
            throw new Error(this.host.msg('The config you imported seems to be broken :('))
          }
          const config: FileConfigV1 = {
            version: 1,
            settings: fileConfig.settings,
            qAndA: fileConfig.qAndA,
            availableDataSets: fileConfig.availableDataSets,
            dataSet: fileConfig.dataSet,
            layerConfs: fileConfig.layerConfs,
            layerConnectionConfs: fileConfig.layerConnectionConfs,
            trainOptions: fileConfig.trainOptions,
          }
          this.importConfig(config)
          break
        }
        default: {
          throw new Error(
            this.host.msg('The version of the config file is not compatible with the widget version you currently use!')
          )
        }
      }
    } catch (err: unknown) {
      const error = err as Error
      AlertUtils.spawn({
        message: error.message,
        variant: 'danger',
        icon: 'x-circle',
      })
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
    const availableDataSets = await Promise.all(this.host.availableDataSets.map((dataSet) => DataSetUtils.loadData(dataSet)))
    const config: FileConfigV1 = {
      version: 1,
      settings: this.host.settings,
      qAndA: this.host.qAndA,
      availableDataSets,
      dataSet: await DataSetUtils.loadData(this.host.dataSet),
      layerConfs: this.host.layerConfs,
      layerConnectionConfs: this.host.layerConnectionConfs,
      trainOptions: this.host.trainOptions,
    }
    const configJSON = JSON.stringify(config)
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
