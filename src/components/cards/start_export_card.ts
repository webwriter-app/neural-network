import { LitElement } from 'lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import { Settings, settingsContext } from '@/contexts/settings_context'
import { HelpEntry, helpContext } from '@/contexts/help_context'
import { availableDataSetsContext } from '@/contexts/available_data_sets_context'
import { dataSetContext } from '@/contexts/data_set_context'
import { layerConfsContext } from '@/contexts/layer_confs_context'
import { layerConnectionConfsContext } from '@/contexts/layer_con_confs_context'
import {
  TrainOptions,
  trainOptionsContext,
} from '@/contexts/train_options_context'

import type { DataSet } from '@/data_set/data_set'

import { CLayerConf } from '@/network/c_layer_conf'
import { CLayerConnectionConf } from '@/network/c_layer_connection_conf'
import { FileConfigV1 } from '@/types/file_config_v1'
import { spawnAlert } from '@/utils/alerts'

@customElement('start-export-card')
export class StartExportCard extends LitElement {
  @consume({ context: settingsContext, subscribe: true })
  settings: Settings

  @consume({ context: helpContext, subscribe: true })
  help: HelpEntry[]

  @consume({ context: availableDataSetsContext, subscribe: true })
  availableDataSets: DataSet[]

  @consume({ context: dataSetContext, subscribe: true })
  dataSet: DataSet

  @consume({ context: layerConfsContext, subscribe: true })
  layerConfs: CLayerConf[]

  @consume({ context: layerConnectionConfsContext, subscribe: true })
  layerConnectionConfs: CLayerConnectionConf[]

  @consume({ context: trainOptionsContext, subscribe: true })
  trainOptions: TrainOptions

  async handleExport() {
    const config: FileConfigV1 = {
      version: 1,
      settings: this.settings,
      help: this.help,
      availableDataSets: this.availableDataSets,
      dataSet: this.dataSet,
      layerConfs: this.layerConfs,
      layerConnectionConfs: this.layerConnectionConfs,
      trainOptions: this.trainOptions,
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
    spawnAlert({
      message: `The current configuration was successfully exported!`,
      variant: 'success',
      icon: 'check-circle',
    })
  }

  static styles: CSSResult[] = globalStyles

  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Export</div>
        <div slot="content">
          <p>
            Export the current configuration to your local file system as a JSON
            file. It contains the set settings, the current and all other
            available data sets, the whole network configuration and the set
            training settings. Storing trained models is currently not yet
            supported. NOTE: this feature is currently not available in Safari
            and Firefox.
          </p>
          <div class="button-group">
            <sl-button
              @click="${(_e: MouseEvent) => {
                void this.handleExport()
              }}"
            >
              <sl-icon slot="prefix" name="file-earmark-arrow-down"></sl-icon>
              Export
            </sl-button>
          </div>
        </div>
      </c-card>
    `
  }
}
