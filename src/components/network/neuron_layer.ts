import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import { spawnAlert } from '@/utils/alerts'

import { CLayer } from '@/components/network/c_layer'
import { Neuron } from '@/components/network/neuron'

import { Position } from '@/types/position'

import '@/components/network/neuron'

// Abstract class NeuronLayer acts as a bridge between the general CLayer class
// and specific classes such as Dense layer. It stores the number of neurons and
// acts as a type checker for some methods that only exists for these layers.
// Important as a differentation to other possible layers that to not consist of
// just neurons.
@customElement('neuron-layer')
export abstract class NeuronLayer extends CLayer {
  // position on canvas (first neuron's position)
  @property()
  firstNeuronPos: Position

  @state()
  neurons: Neuron[] = []

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  firstUpdated(): void {
    // let the canvas generate a position for the layer if none was specified as
    // a property (would make more sense in the constructor but at this stage
    // this.canvas is not yet specified; firstUpdated is early enough)
    if (!this.firstNeuronPos) {
      this.firstNeuronPos = { ...this.canvas.generatePos() }
    }

    // add an event listener that updates the layer position when layer position
    // changes
    this.canvas.cy
      .getElementById(this.getCyId())
      .on('position', (_e) => this.updateInternalFirstNeuronPos())
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> INFORMATION  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // get the cytoscape ids of all neurons that are already rendered. used for
  // layer connections so that the connection class knows where to draw an edge.
  // filtering by rendered neurons is necessary since else, the connection class
  // would attempt to draw a connection from/to a node that does not exist and
  // will throw an error. when neurons are rendered, they trigger a redrawing of
  // the connection afterwards, so eventhough we filter by rendered neurons
  // eventually, after the last neuron has been drawn, all neurons are rendered
  // and thus this method will return all neurons
  getConnectionIds(): string[] {
    return this.neurons
      .filter((neuron) => neuron.rendered)
      .map((neuron) => neuron.getCyId())
  }

  // create an unused id for a neuron. since we principally allow deletion of
  // any neuron we need to get the maximum id (which is always the last neurons
  // id) and add 1 to be sure to have an unused one
  getFreshNeuronId(): number {
    if (this.neurons.length) {
      return this.neurons[this.neurons.length - 1].neuronId + 1
    } else {
      return 1
    }
  }

  // get the position for the next neuron, e.g. if our neurons array contains
  // two neurons for the third
  getPositionForUnit(unit: number): Position {
    return {
      x:
        this.firstNeuronPos.x +
        (unit - 1) * (this.canvas.NEURON_SIZE + this.canvas.NEURON_DISTANCE),
      y: this.firstNeuronPos.y,
    }
  }

  // update internal position
  updateInternalFirstNeuronPos(): void {
    if (this.neurons.length) {
      const firstNeuronCy = this.canvas.cy.getElementById(
        this.neurons[0].getCyId()
      )
      if (firstNeuronCy.length) {
        this.firstNeuronPos = firstNeuronCy.position()
      }
    }
  }

  // -> MANIPULATING LAYER - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // add a neuron to the layer
  addNeuron({ label }: { label?: string } = {}): Neuron {
    // create a new neuron with a fresh id and specified data and add it to our
    // array of neurons
    const neuron: Neuron = <Neuron>document.createElement('c-neuron')
    neuron.layer = this
    neuron.neuronId = this.getFreshNeuronId()
    neuron.label = label

    // finally add the created neuron to our array of neurons
    this.neurons.push(neuron)
    this.requestUpdate()

    // return the neuron
    return neuron
  }

  // remove the last neuron. we can ignore the neuron argument since we
  // generally do not allow the deletion of specific neurons. might be allowed
  // by subclasses of NeuronLayer
  removeNeuron({
    neuron = null,
    force = false,
  }: {
    neuron?: Neuron
    force?: boolean
  } = {}): void {
    if (neuron)
      console.error(
        'removing specific neurons is not yet supported! To adjust the number of neurons in the layer, select the layer and adjust its configuration instead!'
      )
    if (this.neurons.length > 1 || force) {
      this.neurons.pop().removeFromCanvas()
      this.requestUpdate()
    } else {
      spawnAlert({
        message: `Could not remove neuron in '${this.getName()}'! Layer needs at least one neuron!`,
        variant: 'warning',
        icon: 'x-circle',
      })
    }
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = [globalStyles]

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`${super.render()}${this.neurons}`
  }
}
