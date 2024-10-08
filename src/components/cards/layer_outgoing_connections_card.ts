import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { consume } from '@lit/context'

import type { CLayerConf } from '@/types/c_layer_conf'
import type { CLayerConnectionConf } from '@/types/c_layer_connection_conf'
import type { CNetwork } from '@/components/network/network'
import type { CLayer } from '@/components/network/c_layer'
import { networkContext } from '@/contexts/network_context'
import { layerConfsContext } from '@/contexts/layer_confs_context'
import { layerConnectionConfsContext } from '@/contexts/layer_con_confs_context'

import type { SlChangeEvent } from '@shoelace-style/shoelace'
import { CCard } from '../reusables/c-card'
import SlSelect from "@shoelace-style/shoelace/dist/components/select/select.component.js"
import SlOption from "@shoelace-style/shoelace/dist/components/option/option.component.js"

export class LayerOutgoingConnectionsCard extends LitElementWw {

  static scopedElements = {
    "c-card": CCard,
    "sl-select": SlSelect,
    "sl-option": SlOption
  }
  
  @property()
  accessor layer: CLayer

  @consume({ context: layerConfsContext, subscribe: true })
  accessor layerConfs: CLayerConf[]

  @consume({ context: layerConnectionConfsContext, subscribe: true })
  accessor layerConnectionConfs: CLayerConnectionConf[]

  @consume({ context: networkContext, subscribe: true })
  accessor network: CNetwork

  @query('#connectionSelect')
  accessor _connectionSelect: SlSelect

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  handleChangeConnections(): void {
    // current layer ids of the outgoing connections
    const currentLayerIds: number[] = this.layerConnectionConfs
      .filter((conConf) => {
        return conConf.sourceLayerId == this.layer.conf.layerId
      })
      .map((conConf) => conConf.targetLayerId)

    // outgoing layer ids of the connections we want to have
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
      const targetLayerConf = this.layerConfs.find(
        (layer) => layer.layerId == addedLayerId
      )
      this.dispatchEvent(
        new CustomEvent<{
          source: number
          target: number
        }>('add-layer-connection', {
          detail: {
            source: this.layer.conf.layerId,
            target: targetLayerConf.layerId,
          },
          bubbles: true,
          composed: true,
        })
      )
    }

    // remove connections that existed but were unselected
    const removedLayerIds = currentLayerIds.filter(
      (layerId) => !selectedLayerIds.includes(layerId)
    )
    for (const removedLayerId of removedLayerIds) {
      const targetLayerConf = this.layerConfs.find(
        (layerConf) => layerConf.layerId == removedLayerId
      )
      this.dispatchEvent(
        new CustomEvent<{
          source: number
          target: number
        }>('remove-layer-connection', {
          detail: {
            source: this.layer.conf.layerId,
            target: targetLayerConf.layerId,
          },
          bubbles: true,
          composed: true,
        })
      )
    }
  }

  getConnectionOptions(): TemplateResult<1>[] {
    const options = this.layerConfs
      .filter(
        (layerConf) =>
          layerConf != this.layer.conf && !(layerConf.LAYER_TYPE == 'Input')
      )
      .map((layerConf) => this.network.getLayerById(layerConf.layerId))
    return options.map(
      (layer) =>
        html`<sl-option value="${layer.conf.layerId.toString()}"
          >${layer.getName()}</sl-option
        >`
    )
  }

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Outgoing connections</div>
        <div slot="content">
          <sl-select
            id="connectionSelect"
            value=${this.layerConnectionConfs
              .filter((conConf) => {
                return conConf.sourceLayerId == this.layer.conf.layerId
              })
              .map((conConf) => conConf.targetLayerId)
              .join(' ')}
            multiple
            clearable
            help-text="Select the layers this layer connects to"
            @sl-change="${(_e: SlChangeEvent) =>
              this.handleChangeConnections()}"
          >
            ${this.getConnectionOptions()}
          </sl-select>
        </div>
      </c-card>
    `
  }
}
