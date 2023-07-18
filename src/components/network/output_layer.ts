import { CSSResult, TemplateResult } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import { Position } from '@/types/position'
import { ActivationOption } from '@/components/network/activation'
import { NeuronLayer } from '@/components/network/neuron_layer'
import { spawnAlert } from '@/utils/alerts'
import { DataSetLabel } from '@/types/data_set_label'
import { isRegressionLabel } from '@/types/data_set_regression_label'
import { isClassificationLabel } from '@/types/data_set_classification_label'

@customElement('output-layer')
export class OutputLayer extends NeuronLayer {
  static LAYER_TYPE = 'Output'
  static LAYER_NAME = 'Output layer'

  @property()
  dataSetLabel: DataSetLabel

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('dataSetLabel')) {
      // check the updated data set keys
      if (this.dataSetLabel) {
        // re-create our neurons if some key(s) was/were assigned
        this.handleLabelChange()
      } else {
        // if no label was assigned (should in theory not happen), notify the
        // network that this layer wants to be deleted
        this.dispatchEvent(
          new Event('query-layer-deletion', {
            bubbles: true,
            composed: true,
          })
        )
        spawnAlert({
          message: `Layer ${this.getCyId()} was deleted because no data could be assigned to it!`,
          variant: 'warning',
          icon: 'x-circle',
        })
      }
    }
  }

  // FACTORY - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static create({
    activation = 'None',
    pos = null,
    alert = true,
  }: {
    activation?: ActivationOption
    pos?: Position
    alert?: boolean
  } = {}): OutputLayer {
    // create a new dense layer element with the specified properties
    const layer: OutputLayer = <OutputLayer>(
      document.createElement('output-layer')
    )
    layer.activation = activation
    layer.firstNeuronPos = pos
    layer.alert = alert

    // emit an layer-created event - the network listens to them, so it can add
    // a unique layer id to the layer and add it to the network array
    dispatchEvent(
      new CustomEvent<OutputLayer>('layer-created', {
        detail: layer,
        bubbles: true,
        composed: true,
      })
    )

    return layer
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // overwrite getName for the outputKey
  getName(): string {
    return `${this.dataSetLabel.key} ${this.constructor.LAYER_NAME} ${
      this.activation != 'None' ? `(${this.activation})` : ``
    }`
  }
  // get description
  getDescription(): string {
    let description =
      'An output layer in this simulation is just a normal dense layer, additionally equipped with the ability to output the incoming data out of the network.'
    if (isClassificationLabel(this.dataSetLabel)) {
      description +=
        ' Since the purpose if this layer is to output a classifiction, we should combine it with a softmax activation function in order to provide a probability distribution.'
    }
    return description
  }

  /*
  DATASET
  */
  handleLabelChange(): void {
    // remove all neurons
    for (let index = this.neurons.length - 1; index >= 0; index--) {
      this.removeNeuron({ force: true })
    }

    // redraw the layer so it has the new output key as a label
    /* this.render() */

    // draw the neuron(s): a single for regression output, once per class for
    // classification output
    if (isRegressionLabel(this.dataSetLabel)) {
      this.addNeuron({ label: this.dataSetLabel.key })
    } else if (isClassificationLabel(this.dataSetLabel)) {
      for (const clazz of this.dataSetLabel.classes) {
        this.addNeuron({ label: clazz.key })
      }
    }

    // update the label of the layer in the canvas
    this.canvas.cy.getElementById(`${this.id}`).data('label', this.getName())
  }

  /*
  BUILD
  */
  /* build(): tf.SymbolicTensor[] {
    console.log(`Building layer ${this.getName()}`)

    // first check if all connected inputs have been build.
    if (!this.inputFrom.every((input) => input.tensor)) {
      return
    }

    // check if we have multiple inputs.
    let input: tf.SymbolicTensor | tf.SymbolicTensor[] | tf.Tensor | tf.Tensor[] //@TODO look into what it actually could be
    if (this.inputFrom.length > 1) {
      // if there are multiple inputs we concatenate them into one
      input = tf.layers
        .concatenate({ axis: 1, name: `concatinputs-${this.getTensorName()}` })
        .apply(this.inputFrom.map((input) => input.tensor))
    } else {
      // we know that we must have one input since this method has to have been
      // called from somewhere, so we set the input to the tensor of the first
      // (and single) input of our inputFrom array
      input = this.inputFrom[0].tensor
    }
    console.log(`Input tensor:`)
    console.log(input)

    // lets now create the main tensor
    this.tensor = <tf.SymbolicTensor>tf.layers
      .dense({
        units: this.neurons.length,
        activation: this.activation.identifier,
        name: this.getTensorName(),
      })
      .apply(input)
    this.tensor['layer_id'] = this.id

    console.log(`This tensor (returned):`)
    console.log(this.tensor)
  } */

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = [globalStyles]

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return super.render()
  }
}
