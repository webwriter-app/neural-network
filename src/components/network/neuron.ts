import { LitElementWw } from '@webwriter/lit'
import { widgetMsg } from '@webwriter/lit/localize'
import { str } from '@lit/localize'
import { TemplateResult, html } from 'lit'
import { property } from 'lit/decorators.js'
import { consume } from '@lit/context'

import type { Selected } from '../../model/app-types'
import { selectedContext } from '../contexts'
import type { CLayer } from './c-layer'

export class CNeuron extends LitElementWw {
  private readonly msg = widgetMsg(this)

  @consume({ context: selectedContext, subscribe: true })
  accessor selected: Selected

  // reference to the layer
  @property({ attribute: false })
  accessor layer: CLayer

  // the id of the neuron in this layer. first neuron added gets id 1
  @property({ attribute: false })
  accessor neuronId: number

  // key of the corresponding dataSet input or label
  @property({ attribute: false })
  accessor key: string | undefined
  @property({ attribute: false })
  accessor keyPos: 'bottom' | 'top' | undefined

  // bias of the neuron that is to be trained
  @property({ attribute: false })
  accessor bias: number | undefined

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties)
    if (this.selected?.neuron == this.getId()) {
      this.dispatchEvent(
        new CustomEvent<CNeuron>('selected-ele-rendered', {
          detail: this,
          bubbles: true,
          composed: true,
        })
      )
    }

    // notify the network that the layer changed its neurons and thus,
    // connections from and to this layer have to be rerendered
    this.dispatchEvent(
      new CustomEvent<number>('layer-updated', {
        detail: this.layer.conf.layerId,
        bubbles: true,
        composed: true,
      })
    )
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> INFO - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // the id of the neuron in the network
  getId(): string {
    return `${this.layer.getId()}n${this.neuronId}`
  }

  getName(): string {
    return this.msg(str`Neuron ${this.neuronId} inside ${this.layer.getName()}`)
  }

  // -> MISC - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  openCorrespondingPanel(): void {
    this.dispatchEvent(
      new CustomEvent<string>('open-panel', {
        detail: 'neuron',
        bubbles: true,
        composed: true,
      })
    )
  }

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html``
  }
}
