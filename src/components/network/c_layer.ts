import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html } from 'lit'
import { property, queryAll, state } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import type { CCanvas } from '@/components/canvas'
import { canvasContext } from '@/contexts/canvas_context'
import type { DataSet } from '@/types/data_set'
import { dataSetContext } from '@/contexts/data_set_context'
import type { CLayerConf } from '@/types/c_layer_conf'
import type { Activation } from '@/types/activation'
import type { CNeuron } from '@/components/network/neuron'
import { NetworkUtils } from '@/utils/network_utils'
import type { TrainOptions } from '@/types/train_options'
import { trainOptionsContext } from '@/contexts/train_options_context'
import type { Selected } from '@/types/selected'
import { selectedContext } from '@/contexts/selected_context'

import * as tf from '@tensorflow/tfjs'

import { AlertUtils } from '@/utils/alert_utils'

export abstract class CLayer extends LitElementWw {
  @consume({ context: canvasContext, subscribe: true })
  canvas: CCanvas

  // the data set is stored as a property for the layer to realize changes in
  // the data set in lifecycle hooks and respond to them
  @consume({ context: dataSetContext, subscribe: true })
  @property({ attribute: false })
  dataSet: DataSet

  @consume({ context: selectedContext, subscribe: true })
  selected: Selected

  @consume({ context: trainOptionsContext, subscribe: true })
  trainOptions: TrainOptions

  @property({ attribute: false })
  conf: CLayerConf

  @property({ attribute: false })
  tensor: tf.SymbolicTensor

  @property({ attribute: false })
  weights: Float32Array

  @property({ attribute: false })
  bias: Float32Array

  // sometimes lit lifecycle hooks are really frustrating since it may happen
  // that render() is executed even after disconnectedCallback(). If we would
  // render html this would be no problem since it would be removed right after
  // that, but as we add something to cytoscape, this is permanent. So we
  // prevent from rendering to cytoscape after disconnectedCallback was called
  @state()
  doNotRender = false

  @state()
  positionListenerActive: boolean = false

  @queryAll('c-neuron')
  _neurons: NodeListOf<CNeuron>

  // a type and description that is displayed as an info for the layer
  static LAYER_TYPE: string
  static LAYER_NAME: string

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  connectedCallback(): void {
    super.connectedCallback()
    this.doNotRender = false
    if (this.conf.firstSpawn) {
      AlertUtils.spawn({
        message: `'${this.getName()}' has been created!`,
        variant: 'success',
        icon: 'check-circle',
      })
      this.conf.firstSpawn = false
      this.dispatchEvent(
        new Event('update-layer-confs', {
          bubbles: true,
          composed: true,
        })
      )
    }
  }

  updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties)
    if (!this.positionListenerActive) {
      this.positionListenerActive = true
      // add an event listener that updates the layer position when layer position
      // changes
      this.canvas.cy
        .getElementById(this.getCyId())
        .on('dragfree', (_e) => this.updateInternalPos())
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.doNotRender = true
    this.positionListenerActive = false
    this.removeFromCanvas()
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> INFORMATION  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // get the already rendered neurons. used for layer connections so that the
  // connection class knows where to draw an edge. filtering by rendered neurons
  // is necessary since else, the connection class would attempt to draw a
  // connection from/to a node that does not exist and will throw an error. when
  // neurons are rendered, they trigger a redrawing of the connection
  // afterwards, so eventhough we filter by rendered neurons eventually, after
  // the last neuron has been drawn, all neurons are rendered and thus this
  // method will return all neurons
  getNeurons(): CNeuron[] {
    return Array.from(this._neurons).filter((neuron) => neuron.rendered)
  }

  // get a readable name for this layer that is displayed in the UI. do not use
  // the name for referencing purposes (can be overwritten by the
  // implementations)
  getName(): string {
    return `${this.conf.layerId} - ${this.conf.LAYER_NAME} ${
      this.conf.activation != NetworkUtils.actNone
        ? `(${this.conf.activation.name})`
        : ``
    }`
  }

  // get a description of the layer that may contain the type and purpose of the
  // layer (to be overwritten by the implementations)
  getDescription(): string {
    return ''
  }

  // -> ACTIONS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // set the activation function
  setActivation(activation: Activation): void {
    this.conf.activation = activation

    // also update the label of the layer in the canvas
    this.canvas.cy
      .getElementById(`${this.conf.layerId}`)
      .data('label', this.getName())
  }

  // duplicates the layer by creating a copy of this layer with changes in
  // position and id
  abstract duplicate(): void

  // completely deletes the layer
  delete(): void {
    dispatchEvent(
      new CustomEvent<CLayer>('query-layer-deletion', {
        detail: this,
        bubbles: true,
        composed: true,
      })
    )
  }

  // -> CANVAS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // return the corresponding id of the layer for the canvas
  getCyId(): string {
    return `${this.conf.layerId}`
  }

  // update internal position
  updateInternalPos(): void {
    const layerCy = this.canvas.cy.getElementById(this.getCyId())
    /*       const firstNeuronCy = this.canvas.cy.getElementById(
        this.neurons[0].getCyId()
      ) */
    if (layerCy.length /* && firstNeuronCy.length */) {
      this.conf.pos = {
        x: layerCy.position().x,
        y: layerCy.position().y /* firstNeuronCy.position().y */,
      }
      this.dispatchEvent(
        new Event('update-layer-confs', {
          bubbles: true,
          composed: true,
        })
      )
    }
  }

  // remove the previous built layer if exists. these are all nodes with its
  // layer property being this.layerId or edges with either source or target
  // being this.layerId
  removeFromCanvas(): void {
    const ele = this.canvas.cy.getElementById(this.getCyId())
    if (ele.length) {
      ele.remove()
    }
  }

  // -> MODEL  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // every layer needs to implement a build function that takes the layer
  // configuration into account and builds a symbolic tensor that is then used
  // in the model.
  abstract build(inputs: tf.SymbolicTensor[]): tf.SymbolicTensor

  // in the build method, layers are supposed to call this method to get a
  // unique name for the corresponding layer. currently not important
  getTensorName(): string {
    return this.conf.layerId.toString()
  }

  // -> MISC - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  openCorrespondingPanel(): void {
    this.dispatchEvent(
      new CustomEvent<string>('open-panel', {
        detail: 'layer',
        bubbles: true,
        composed: true,
      })
    )
  }

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    if (!this.doNotRender && this.canvas?.cy) {
      // layer is only rendered once
      if (!this.canvas.cy.getElementById(this.getCyId()).length)
        // draw the layer
        this.canvas.cy.add({
          group: 'nodes',
          data: {
            id: this.getCyId(),
            label: this.getName(),
            type: 'layer',
            layer: this.conf.layerId,
            layer_type: `${this.conf.LAYER_TYPE}`,
          },
        })

      // add the element to the selected context (which will also take care of
      // selecting the element in cytoscape)
      if (this.selected?.layer == this.getCyId()) {
        this.dispatchEvent(
          new CustomEvent<CLayer>('selected-ele-rendered', {
            detail: this,
            bubbles: true,
            composed: true,
          })
        )
      }
    }
    return html``
  }
}
