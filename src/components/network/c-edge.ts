import { LitElementWw } from '@webwriter/lit'
import { property } from 'lit/decorators.js'
import { consume } from '@lit/context'

import type { CNeuron } from './neuron'
import type { Selected } from '../../model/app-types'
import { selectedContext } from '../contexts'

// An edge between two neurons. The canvas draws it; the element carries what
// the edge panel and the selection need.
export class CEdge extends LitElementWw {
  @consume({ context: selectedContext, subscribe: true })
  accessor selected: Selected

  @property({ attribute: false })
  accessor source: CNeuron

  @property({ attribute: false })
  accessor target: CNeuron

  @property({ attribute: false })
  accessor sourceLayerId: number

  @property({ attribute: false })
  accessor targetLayerId: number

  @property({ attribute: false })
  accessor weight: number | undefined

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties)
    if (this.selected?.edge == this.getId()) {
      this.dispatchEvent(
        new CustomEvent<CEdge>('selected-ele-rendered', {
          detail: this,
          bubbles: true,
          composed: true,
        })
      )
    }
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // the id of the edge in the network
  getId(): string {
    return `${this.source.getId()}e${this.target.getId()}`
  }

  openCorrespondingPanel(): void {
    this.dispatchEvent(
      new CustomEvent<string>('open-panel', {
        detail: 'edge',
        bubbles: true,
        composed: true,
      })
    )
  }
}
