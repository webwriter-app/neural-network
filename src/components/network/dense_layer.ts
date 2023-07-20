import { CSSResult, TemplateResult } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import { NeuronLayer } from '@/components/network/neuron_layer'

import { spawnAlert } from '@/utils/alerts'
import { Position } from '@/types/position'
import {
  ActivationOption,
  activationsMap,
} from '@/components/network/activation'

import * as tf from '@tensorflow/tfjs'

@customElement('dense-layer')
export class DenseLayer extends NeuronLayer {
  // a type and description that is displayed as an info for the layer
  static LAYER_TYPE = 'Dense'
  static LAYER_NAME = 'Dense layer'

  @property()
  units: number

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  firstUpdated() {
    super.firstUpdated()

    // add the neurons
    for (let unit = 1; unit <= this.units; unit++) {
      this.addNeuron()
    }
  }

  // FACTORY - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static create({
    units = 2,
    activation = 'None',
    pos = null,
    alert = true,
  }: {
    units?: number
    activation?: ActivationOption
    pos?: Position
    alert?: boolean
  } = {}): DenseLayer {
    // create a new dense layer element with the specified properties
    const layer: DenseLayer = <DenseLayer>document.createElement('dense-layer')
    layer.units = units
    layer.activation = activation
    layer.firstNeuronPos = pos
    layer.alert = alert

    // emit an layer-created event - the network listens to them, so it can add
    // a unique layer id to the layer and add it to the network array
    dispatchEvent(
      new CustomEvent<DenseLayer>('layer-created', {
        detail: layer,
        bubbles: true,
        composed: true,
      })
    )

    return layer
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // get a description of this layer to display in an info card
  getDescription(): string {
    return 'A dense layer, also called fully-connected layer, is a layer whose inside neurons connect to every neuron in the preceding layer.'
  }

  // set the neurons to a specific number
  setNeurons(units: number): void {
    if (units >= 1) {
      if (units > this.neurons.length) {
        for (let unit = this.neurons.length + 1; unit <= units; unit++) {
          this.addNeuron()
        }
      } else if (units < this.neurons.length) {
        for (let unit = this.neurons.length; unit > units; unit--) {
          this.removeNeuron()
        }
      }
      spawnAlert({
        message: `The number of neurons in '${this.getName()}' has been updated to ${units}!`,
        variant: 'success',
        icon: 'check-circle',
      })
    } else {
      spawnAlert({
        message: `The number of neurons in '${this.getName()}' could not be updated to ${units}! Layer needs at least one neuron!`,
        variant: 'warning',
        icon: 'x-circle',
      })
    }
  }

  // duplicated the layer by creating a new one and passing it to the network by
  // emitting an event
  duplicate(): void {
    const newPos = {
      x: this.canvas.cy.getElementById(this.getCyId()).position().x,
      y:
        this.firstNeuronPos.y -
        this.canvas.getHeight(this.getCyId()) -
        this.canvas.LAYER_DISTANCE,
    }

    DenseLayer.create({
      units: this.neurons.length,
      activation: this.activation,
      pos: newPos,
    })
  }

  // -> BUILD  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  build(inputs: tf.SymbolicTensor[]): void {
    // check if we have multiple inputs.
    let input: tf.SymbolicTensor | tf.SymbolicTensor[] | tf.Tensor | tf.Tensor[]
    if (inputs.length > 1) {
      // if there are multiple inputs we concatenate them into one
      input = tf.layers
        .concatenate({ axis: 1, name: `concatinputs-${this.getTensorName()}` })
        .apply(inputs)
    } else {
      // we know that we must have one input since this method has to have been
      // called from somewhere, so we set the input to the tensor of the first
      // (and single) input of our inputFrom array
      input = inputs[0]
    }

    // lets now create the main tensor
    const dense = <tf.SymbolicTensor>tf.layers
      .dense({
        units: this.neurons.length,
        activation: <tf.ActivationIdentifier>(
          activationsMap.get(this.activation)
        ),
        name: this.getTensorName(),
      })
      .apply(input)

    // finally apply dropout
    const dropout: tf.SymbolicTensor = <tf.SymbolicTensor>(
      tf.layers
        .dropout({ rate: parseInt(this.trainOptions.dropoutRate) })
        .apply(dense)
    )

    // set this tensor to the dropout tensor and add the layer id
    this.tensor = dropout
    this.tensor['layer_id'] = this.layerId
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = [globalStyles]

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return super.render()
  }
}
