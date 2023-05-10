import { LitElementWw } from "@webwriter/lit"
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import Neuron from "@/network/neuron";
import Dataset from "@/dataset/dataset";
import OutputLayer from "@/network/output_layer";

@customElement('neuron-info-card')
class NeuronInfoCard extends LitElementWw {

    @property() neuron: Neuron
    @property() dataset: Dataset

    render(){
        return html`
            <c-card>
                <div slot="title">
                    Info
                </div>
                <div slot="content">
                    <div>
                        <p>Selected item: <c-network-link .target="${this.neuron}">Neuron ${this.neuron.id}</c-network-link> inside <c-network-link .target="${this.neuron.layer}">${this.neuron.layer.getName()}</c-network-link></p>
                        ${this.neuron.inputData ? html`
                            <h4>Assigned input data</h4>
                            <c-data-info .dataProperty="${this.dataset.getInputByKey(this.neuron.inputData)}"></c-data-info>
                        ` : html``}
                        ${this.neuron.outputData ? html`
                            <h4>Assigned output data</h4>
                            <c-data-info .dataProperty="${this.dataset.getLabel()}"></c-data-info>
                        ` : html``}
                    </div>
                </div>
            </c-card>
        `;
    }
}