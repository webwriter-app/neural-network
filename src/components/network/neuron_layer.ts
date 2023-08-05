import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property, queryAll } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import { CLayer } from '@/components/network/c_layer'
import { Neuron } from '@/components/network/neuron'

import '@/components/network/neuron'
import { NeuronLayerConf } from '@/components/network/neuron_layer_conf'

// Abstract class NeuronLayer acts as a bridge between the general CLayer class
// and specific classes such as Dense layer. It stores the number of neurons and
// acts as a type checker for some methods that only exists for these layers.
// Important as a differentation to other possible layers that to not consist of
// just neurons.
@customElement('neuron-layer')
export abstract class NeuronLayer extends CLayer {
  @property()
  conf: NeuronLayerConf

  @queryAll('c-neuron')
  _neurons: NodeListOf<Neuron>

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
    return Array.from(this._neurons)
      .filter((neuron) => neuron.rendered)
      .map((neuron) => neuron.getCyId())
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = [globalStyles]

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`${super.render()}`
  }
}
