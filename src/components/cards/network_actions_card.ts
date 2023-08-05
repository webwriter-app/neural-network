import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import { dataSetContext } from '@/contexts/data_set_context'
import { layerConfsContext } from '@/contexts/layer_confs_context'
import { layerConnectionConfsContext } from '@/contexts/layer_con_confs_context'
import {
  TrainOptions,
  trainOptionsContext,
} from '@/contexts/train_options_context'

import type { DataSet } from '@/data_set/data_set'

import { CLayerConf } from '@/components/network/c_layer_conf'
import { CLayerConnectionConf } from '@/components/network/c_layer_connection_conf'
import { FileConfigV1 } from '@/types/file_config_v1'
import { spawnAlert } from '@/utils/alerts'

@customElement('network-actions-card')
export class GetStartedActions extends LitElementWw {
  @consume({ context: dataSetContext, subscribe: true })
  dataSet: DataSet

  @consume({ context: layerConfsContext, subscribe: true })
  layerConfs: CLayerConf[]

  @consume({ context: layerConnectionConfsContext, subscribe: true })
  layerConnectionConfs: CLayerConnectionConf[]

  @consume({ context: trainOptionsContext, subscribe: true })
  trainOptions: TrainOptions

  _handleClear() {
    // network conf
    this.dispatchEvent(
      new CustomEvent('clear-network', { bubbles: true, composed: true })
    )
  }

  async _handleExport() {
    const config: FileConfigV1 = {
      version: 1,
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

  static styles: CSSResult[] = [globalStyles]

  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Actions</div>
        <div slot="content">
          <c-button-group>
            <sl-button
              @click="${(_e: MouseEvent) => {
                void this._handleClear()
              }}"
            >
              <sl-icon slot="prefix" name="trash"></sl-icon>
              Clear
            </sl-button>
            <sl-button
              @click="${(_e: MouseEvent) => {
                this._handleExport()
              }}"
            >
              <sl-icon slot="prefix" name="file-earmark-arrow-down"></sl-icon>
              Export
            </sl-button>
          </c-button-group>
        </div>
      </c-card>
    `
  }
}
