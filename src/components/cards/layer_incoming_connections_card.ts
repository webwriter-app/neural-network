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

export class LayerIncomingConnectionsCard extends LitElementWw {
  
  static scopedElements = {
    "c-card": CCard,
    "sl-select": SlSelect
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
    // current layer ids of the incoming connections
    const currentLayerIds: number[] = this.layerConnectionConfs
      .filter((conConf) => {
        return conConf.targetLayerId == this.layer.conf.layerId
      })
      .map((conConf) => conConf.sourceLayerId)

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
      const sourceLayerConf = this.layerConfs.find(
        (layer) => layer.layerId == addedLayerId
      )
      this.dispatchEvent(
        new CustomEvent<{
          source: number
          target: number
        }>('add-layer-connection', {
          detail: {
            source: sourceLayerConf.layerId,
            target: this.layer.conf.layerId,
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
      const sourceLayerConf = this.layerConfs.find(
        (layerConf) => layerConf.layerId == removedLayerId
      )
      this.dispatchEvent(
        new CustomEvent<{
          source: number
          target: number
        }>('remove-layer-connection', {
          detail: {
            source: sourceLayerConf.layerId,
            target: this.layer.conf.layerId,
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
          layerConf != this.layer.conf && !(layerConf.LAYER_TYPE == 'Output')
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
        <div slot="title">Incoming connections</div>
        <div slot="content">
          <sl-select
            id="connectionSelect"
            value=${this.layerConnectionConfs
              .filter((conConf) => {
                return conConf.targetLayerId == this.layer.conf.layerId
              })
              .map((conConf) => conConf.sourceLayerId)
              .join(' ')}
            multiple
            clearable
            help-text="Select the layers that connect to this layer"
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
