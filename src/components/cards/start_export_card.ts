import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { consume } from '@lit/context'

import { globalStyles } from '@/global_styles'

import type { Settings } from '@/types/settings'
import { settingsContext } from '@/contexts/settings_context'
import type { QAndAEntry } from '@/types/q_and_a_entry'
import { qAndAContext } from '@/contexts/q_and_a_context'
import type { DataSet } from '@/types/data_set'
import { dataSetContext } from '@/contexts/data_set_context'
import { availableDataSetsContext } from '@/contexts/available_data_sets_context'
import type { CLayerConf } from '@/types/c_layer_conf'
import type { CLayerConnectionConf } from '@/types/c_layer_connection_conf'
import { layerConfsContext } from '@/contexts/layer_confs_context'
import { layerConnectionConfsContext } from '@/contexts/layer_con_confs_context'
import type { TrainOptions } from '@/types/train_options'
import { trainOptionsContext } from '@/contexts/train_options_context'
import { CCard } from '../reusables/c-card'
import SlButton from "@shoelace-style/shoelace/dist/components/button/button.component.js"
import IconFileEarmarkArrowDown from "bootstrap-icons/icons/file-earmark-arrow-down.svg"

export class StartExportCard extends LitElementWw {

  static scopedElements = {
    "c-card": CCard,
    "sl-button": SlButton
  }

  @consume({ context: settingsContext, subscribe: true })
  accessor settings: Settings

  @consume({ context: qAndAContext, subscribe: true })
  accessor qAndA: QAndAEntry[]

  @consume({ context: availableDataSetsContext, subscribe: true })
  accessor availableDataSets: DataSet[]

  @consume({ context: dataSetContext, subscribe: true })
  accessor dataSet: DataSet

  @consume({ context: layerConfsContext, subscribe: true })
  accessor layerConfs: CLayerConf[]

  @consume({ context: layerConnectionConfsContext, subscribe: true })
  accessor layerConnectionConfs: CLayerConnectionConf[]

  @consume({ context: trainOptionsContext, subscribe: true })
  accessor trainOptions: TrainOptions

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  handleExport() {
    this.dispatchEvent(
      new Event('export-config', {
        bubbles: true,
        composed: true,
      })
    )
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult = globalStyles

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Export</div>
        <div slot="content">
          <p>
            Export the current configuration to your local file system as a JSON
            file. Storing trained models is not supported.
          </p>
          <sl-button
            @click="${(_e: MouseEvent) => {
              void this.handleExport()
            }}"
          >
            <sl-icon slot="prefix" src=${IconFileEarmarkArrowDown}></sl-icon>
            Export
          </sl-button>
        </div>
      </c-card>
    `
  }
}
