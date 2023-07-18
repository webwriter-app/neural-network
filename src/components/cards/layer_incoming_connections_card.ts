import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'

import { consume } from '@lit-labs/context'
import {
  NetworkConf,
  networkConfContext,
} from '@/contexts/network_conf_context'

import { globalStyles } from '@/global_styles'

import { CLayer } from '@/components/network/c_layer'
import { OutputLayer } from '@/components/network/output_layer'

import { SlChangeEvent, SlSelect } from '@shoelace-style/shoelace'

@customElement('layer-incoming-connections-card')
export class LayerIncomingConnectionsCard extends LitElementWw {
  @property()
  layer: CLayer

  @consume({ context: networkConfContext, subscribe: true })
  networkConf: NetworkConf

  @query('#connectionSelect')
  _connectionSelect: SlSelect

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  _handleChangeConnections(): void {
    // current layer ids of the incoming connections
    const currentLayerIds = Array.from(this.networkConf.layerConnections.keys())
      .filter(([_sourceId, targetId]) => targetId == this.layer.layerId)
      .map(([sourceId, _targetId]) => sourceId)

    // incoming layer ids of the connections we want to have
    const selectedLayerIds: number[] = (<string[]>(
      this._connectionSelect.value
    )).map((id) => {
      return parseInt(id)
    })

    // add connections that do not yet exist
    const addedLayerIds = selectedLayerIds.filter(
      (layerId) => !currentLayerIds.includes(layerId)
    )
    for (const addedLayerId of addedLayerIds) {
      const sourceLayer = this.networkConf.network.getLayerById(addedLayerId)
      this.networkConf.network.addLayerConnection(sourceLayer, this.layer)
    }

    // remove connections that existed but were unselected
    const removedLayerIds = currentLayerIds.filter(
      (layerId) => !selectedLayerIds.includes(layerId)
    )
    for (const removedLayerId of removedLayerIds) {
      const sourceLayer = this.networkConf.network.getLayerById(removedLayerId)
      this.networkConf.network.removeLayerConnection(sourceLayer, this.layer)
    }
  }

  _getConnectionOptions(): TemplateResult<1>[] {
    const options = Array.from(this.networkConf.layers.values()).filter(
      (layer) => layer != this.layer && !(layer instanceof OutputLayer)
    )
    return options.map(
      (layer) =>
        html`<sl-option value="${layer.layerId.toString()}"
          >${layer.getName()}</sl-option
        >`
    )
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = [globalStyles]

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Incoming connections</div>
        <div slot="content">
          <sl-select
            id="connectionSelect"
            value=${Array.from(this.networkConf.layerConnections.keys())
              .filter(([_sourceId, targetId]) => {
                targetId == this.layer.layerId
              })
              .map(([sourceId, _targetId]) => sourceId)
              .join(' ')}
            multiple
            clearable
            help-text="Select the layers that connect to this layer"
            @sl-change="${(_e: SlChangeEvent) =>
              this._handleChangeConnections()}"
          >
            ${this._getConnectionOptions()}
          </sl-select>
        </div>
      </c-card>
    `
  }
}
