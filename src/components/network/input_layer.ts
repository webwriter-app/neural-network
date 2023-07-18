import { CSSResult, TemplateResult } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import { Position } from '@/types/position'
import { ActivationOption } from '@/components/network/activation'
import { NeuronLayer } from '@/components/network/neuron_layer'
import { spawnAlert } from '@/utils/alerts'

// an input layer is a special type of a neuron layer. We do not allow
// activation functions and provide methods to assign input data from the
// dataSet to this input layer. We do not allow manual editing of the neurons
// and other layers can not connect to an input layer. Neurons in the input
// layer are marked with the name of the associated input
@customElement('input-layer')
export class InputLayer extends NeuronLayer {
  static LAYER_TYPE = 'Input'
  static LAYER_NAME = 'Input layer'

  @property()
  dataSetKeys: string[] = []

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('dataSetKeys')) {
      // check the updated data set keys
      if (this.dataSetKeys.length) {
        // re-create our neurons if some key(s) was/were assigned
        this.handleKeysChange()
      } else {
        // if no key was assigned, notify the network that this layer wants to
        // be deleted
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
  } = {}): InputLayer {
    // create a new dense layer element with the specified properties
    const layer: InputLayer = <InputLayer>document.createElement('input-layer')
    layer.activation = activation
    layer.firstNeuronPos = pos
    layer.alert = alert

    // emit an layer-created event - the network listens to them, so it can add
    // a unique layer id to the layer and add it to the network array
    dispatchEvent(
      new CustomEvent<InputLayer>('layer-created', {
        detail: layer,
        bubbles: true,
        composed: true,
      })
    )

    return layer
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // overwrite getName function because activation function is always 'None' for
  // input layer
  getName(): string {
    return `${this.layerId} - ${this.constructor.LAYER_NAME}`
  }

  // get description
  getDescription(): string {
    return 'An input layer is a layer that just takes data provided from outside the network and passes it on to the next layer(s)'
  }

  /*
  DATASET
  */
  // assigning inputs
  getAssignedInputs(): string[] {
    return this.neurons.map((neuron) => neuron.label)
  }

  // handle the change of assigned dataSet keys by updating the neurons
  handleKeysChange(): void {
    console.log('handling keys change')
    console.log(this.dataSetKeys)

    // remove all neurons
    for (let index = this.neurons.length - 1; index >= 0; index--) {
      this.removeNeuron({ force: true })
    }

    // add new neurons for every assigned data input
    for (const inputKey of this.dataSetKeys) {
      this.addNeuron({ label: inputKey })
    }
    this.requestUpdate()
  }

  /*
  BUILD
  */
  /* build(): void {
    console.log(`Building layer ${this.getName()}`)

    //  create our input tensor
    this.tensor = tf.input({
      shape: [this.neurons.length],
      name: this.getTensorName(),
    })
    this.tensor['layer_id'] = this.id
    console.log(`This input tensor:`)
    console.log(this.tensor)

    // try to build all connected outputs
    for (const connectedOutput of this.outputTo) {
      connectedOutput.build()
    }
  } */

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = [globalStyles]

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return super.render()
  }
}
