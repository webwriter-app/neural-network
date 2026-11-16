import { widgetMsg } from '@webwriter/lit/localize'
import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { consume } from '@lit/context'

import type { DataSet } from '../../model/data-types'
import { dataSetContext } from '../contexts'
import type { OutputLayer } from '../network/output-layer'
import { CCard } from '../reusables/c-card'
import { CDataInfo } from '../reusables/c-data-info'

export class LayerOutgoingDataCard extends LitElementWw {
  private readonly msg = widgetMsg(this);
  static scopedElements = {
    'c-card': CCard,
    'c-data-info': CDataInfo,
  }

  @property()
  accessor layer: OutputLayer

  @consume({ context: dataSetContext, subscribe: true })
  accessor dataSet: DataSet

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">${this.msg('Outgoing data')}</div>
        <div slot="content">
          ${this.layer.conf.labelDesc.key
            ? html`
                <c-data-info
                  type="label"
                  .dataDesc="${this.layer.conf.labelDesc}"
                  .dataSet="${this.dataSet}"
                ></c-data-info>
              `
            : html``}
        </div>
      </c-card>
    `
  }
}
