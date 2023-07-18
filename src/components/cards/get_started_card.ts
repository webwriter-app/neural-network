import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import { consume } from '@lit-labs/context'
import { Canvas, canvasContext } from '@/contexts/canvas_context'
import {
  NetworkConf,
  networkConfContext,
} from '@/contexts/network_conf_context'
import { dataSetContext } from '@/contexts/data_set_context'

import { InputLayer } from '@/components/network/input_layer'
import { DenseLayer } from '@/components/network/dense_layer'
import { OutputLayer } from '@/components/network/output_layer'

import { DataSet } from '@/data_set/data_set'
import { DataSetFactory } from '@/data_set/data_set_factory'
import { spawnAlert } from '@/utils/alerts'

@customElement('get-started-card')
export class GetStartedActions extends LitElementWw {
  @consume({ context: canvasContext, subscribe: true })
  canvas: Canvas

  @consume({ context: networkConfContext, subscribe: true })
  networkConf: NetworkConf

  @consume({ context: dataSetContext, subscribe: true })
  dataSet: DataSet

  _handleImport() {
    return
  }

  _handleExport() {
    return
  }

  async _handleClear() {
    // network conf
    this.dispatchEvent(
      new CustomEvent('clear-network', { bubbles: true, composed: true })
    )

    // data set
    let dataSet: DataSet
    if (this.dataSet.name) {
      dataSet = await DataSetFactory.getDataSetByName(this.dataSet.name)
    } else {
      dataSet = await DataSetFactory.getDataSetByName(
        DataSetFactory.getOptions()[0]
      )
    }
    const event = new CustomEvent<DataSet>('change-data-set', {
      detail: dataSet,
      bubbles: true,
      composed: true,
    })
    this.dispatchEvent(event)
  }

  async _handleCreateFeedForwardNetwork(_e?: MouseEvent) {
    await this._handleClear()
    const inputLayer = InputLayer.create({
      pos: { x: 0, y: 0 },
      alert: false,
    })
    const denseLayer1 = DenseLayer.create({
      units: 5,
      pos: { x: 0, y: -300 },
      alert: false,
    })
    const denseLayer2 = DenseLayer.create({
      pos: { x: -350, y: -600 },
      alert: false,
    })
    const denseLayer3 = DenseLayer.create({
      units: 3,
      pos: { x: 300, y: -600 },
      alert: false,
    })
    const outputLayer = OutputLayer.create({
      pos: { x: 0, y: -900 },
      alert: false,
    })

    this.networkConf.network.addLayerConnection(inputLayer, denseLayer1)
    this.networkConf.network.addLayerConnection(denseLayer1, denseLayer2)
    this.networkConf.network.addLayerConnection(denseLayer1, denseLayer3)
    this.networkConf.network.addLayerConnection(denseLayer2, outputLayer)
    this.networkConf.network.addLayerConnection(denseLayer3, outputLayer)

    spawnAlert({
      message: 'A new feed forward network has been created!',
      variant: 'success',
      icon: 'check-circle',
    })

    // @TODO thats not nice
    setTimeout(() => {
      this.canvas.fit()
    }, 50)
  }

  static styles: CSSResult[] = [globalStyles]

  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Get started</div>
        <div slot="content">
          <c-button-group>
            <sl-button
              @click="${(_e: MouseEvent) => {
                this._handleImport()
              }}"
            >
              <sl-icon slot="prefix" name="file-earmark-arrow-up"></sl-icon>
              Import
            </sl-button>
            <sl-button
              @click="${(_e: MouseEvent) => {
                this._handleExport()
              }}"
            >
              <sl-icon slot="prefix" name="file-earmark-arrow-down"></sl-icon>
              Export
            </sl-button>
            <sl-button
              @click="${(_e: MouseEvent) => {
                void this._handleClear()
              }}"
            >
              <sl-icon slot="prefix" name="file-earmark-arrow-up"></sl-icon>
              Clear
            </sl-button>
          </c-button-group>
          <sl-button
            variant="primary"
            @click="${(_e: MouseEvent) => {
              void this._handleCreateFeedForwardNetwork()
            }}"
          >
            <sl-icon slot="prefix" name="file-earmark-plus"></sl-icon>
            Create feed forward network
          </sl-button>
        </div>
      </c-card>
    `
  }
}
