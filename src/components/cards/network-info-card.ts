import { widgetMsg } from '@webwriter/lit/localize'
import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html } from 'lit'
import { consume } from '@lit/context'

import { globalStyles } from '../global-styles'

import { editableContext } from '../contexts'
import type { Settings } from '../../model/app-types'
import { settingsContext } from '../contexts'
import type { CLayerConf } from '../../model/network-types'
import { layerConfsContext } from '../contexts'
import type { CNetwork } from '../network/network'
import { networkContext } from '../contexts'
import type { ModelConf } from '../../model/network-types'
import { modelConfContext } from '../contexts'
import { CCard } from '../reusables/c-card'

export class NetworkInfoCard extends LitElementWw {
  private readonly msg = widgetMsg(this);
  static scopedElements = {
    'c-card': CCard,
  }

  @consume({ context: editableContext, subscribe: true })
  accessor editable: boolean = false

  @consume({ context: settingsContext, subscribe: true })
  accessor settings: Settings

  @consume({ context: layerConfsContext, subscribe: true })
  accessor layerConfs: CLayerConf[]

  @consume({ context: networkContext, subscribe: true })
  accessor network: CNetwork

  @consume({ context: modelConfContext, subscribe: true })
  accessor modelConf: ModelConf

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles = globalStyles

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">${this.msg('Network')}</div>
        <div slot="content">
          ${this.layerConfs.length
            ? html`<p>
                ${this.msg('Your network currently contains')}${' '}${this.layerConfs
                  .length}${' '}${this.msg('layers')}.
              </p>`
            : html`<p>${this.msg('Your network is currently empty.')}</p>`}
          ${!this.modelConf.model &&
          (this.editable || this.settings.mayAddAndRemoveLayers)
            ? html`
                ${!this.network.getInputLayers().length
                  ? html`
                      <p>
                        ${this.msg(
                          'You currently do not have an input layer. Drag one onto the canvas!',
                        )}
                      </p>
                    `
                  : html``}
                ${!this.network.getOutputLayer()
                  ? html`
                      <p>
                        ${this.msg(
                          'You currently do not have an output layer. Drag one onto the canvas!',
                        )}
                      </p>
                    `
                  : html``}
              `
            : html``}
          ${!this.modelConf.model &&
          (this.editable || this.settings.mayChangeLayerConnections)
            ? html`
                <p>
                  ${this.msg(
                    'Always make sure to connect your layers such that there is a path from your input layer(s) to your output layer! Therefore select a layer in the canvas and select its incoming or outgoing connections',
                  )}
                </p>
              `
            : html``}
        </div>
      </c-card>
    `
  }
}
