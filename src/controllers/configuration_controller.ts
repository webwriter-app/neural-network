import type { ReactiveController } from 'lit'
import type { WwDeepLearning } from '@/app'
import type { FileConfig } from '@/types/file_config'
import type { FileConfigV1 } from '@/types/file_config_v1'

import { AlertUtils } from '@/utils/alert_utils'

export class ConfigurationController implements ReactiveController {
  host: WwDeepLearning

  constructor(host: WwDeepLearning) {
    this.host = host
    host.addController(this)
  }

  // HOST LIFECYCLE  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  hostConnected() {
    // add event listeners for configuration related events on host
    this.host.renderRoot.addEventListener(
      'initiate-import',
      (_e: Event) => void this.initiateImport()
    )
    this.host.renderRoot.addEventListener(
      'import-config',
      (e: CustomEvent<FileConfigV1>) => this.importConfig(e.detail)
    )
    this.host.renderRoot.addEventListener(
      'export-config',
      (_e: Event) => void this.exportConfig()
    )
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async initiateImport(): Promise<void> {
    const [handle] = await window.showOpenFilePicker({
      types: [
        {
          description: 'JSON',
          accept: { 'application/json': ['.json'] },
        },
      ],
    })
    const file = await handle.getFile()
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
            throw new Error('The config you imported seems to be broken :(')
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
            'The version of the config file is not compatible with the widget version you currently use!'
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
      message: `The imported config was successfully loaded!`,
      variant: 'success',
      icon: 'check-circle',
    })

    // TODO this is not really nice and unreliable, but how to fix it?
    setTimeout(() => {
      this.host.canvas.fit()
    }, 1000)
  }

  async exportConfig(): Promise<void> {
    const config: FileConfigV1 = {
      version: 1,
      settings: this.host.settings,
      qAndA: this.host.qAndA,
      availableDataSets: this.host.availableDataSets,
      dataSet: this.host.dataSet,
      layerConfs: this.host.layerConfs,
      layerConnectionConfs: this.host.layerConnectionConfs,
      trainOptions: this.host.trainOptions,
    }
    const configJSON = JSON.stringify(config)
    const handle = await window.showSaveFilePicker({
      suggestedName: 'export.json',
      types: [
        {
          description: 'JSON',
          accept: { 'application/json': ['.json'] },
        },
      ],
    })
    const writer = await handle.createWritable()
    await writer.write(configJSON)
    await writer.close()
    AlertUtils.spawn({
      message: `The current configuration was successfully exported!`,
      variant: 'success',
      icon: 'check-circle',
    })
  }
}
