import { widgetMsg } from '@webwriter/lit/localize'
import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { consume } from '@lit/context'

import { globalStyles } from '../global-styles'

import type { Settings } from '../../model/app-types'
import { settingsContext } from '../contexts'
import type { QAndAEntry } from '../../model/app-types'
import { qAndAContext } from '../contexts'
import type { DataSet } from '../../model/data-types'
import { dataSetContext } from '../contexts'
import { availableDataSetsContext } from '../contexts'
import type { CLayerConf } from '../../model/network-types'
import type { CLayerConnectionConf } from '../../model/network-types'
import { layerConfsContext } from '../contexts'
import { layerConnectionConfsContext } from '../contexts'
import type { TrainOptions } from '../../model/network-types'
import { trainOptionsContext } from '../contexts'
import { CCard } from '../reusables/c-card'
import SlButton from '@shoelace-style/shoelace/dist/components/button/button.component.js'
import IconFileEarmarkArrowDown from '@tabler/icons/outline/file-download.svg'

export class StartExportCard extends LitElementWw {
  private readonly msg = widgetMsg(this);
  static scopedElements = {
    'c-card': CCard,
    'sl-button': SlButton,
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
      }),
    )
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult = globalStyles

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">${this.msg('Export')}</div>
        <div slot="content">
          <p>
            ${this.msg(
              'Export the current configuration to your local file system as a JSON file. Storing trained models is not supported.',
            )}
          </p>
          <sl-button
            @click="${(_e: MouseEvent) => {
              void this.handleExport()
            }}"
          >
            <sl-icon slot="prefix" src=${IconFileEarmarkArrowDown}></sl-icon>
            ${this.msg('Export')}
          </sl-button>
        </div>
      </c-card>
    `
  }
}
