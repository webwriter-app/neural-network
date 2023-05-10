import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'

import { State, StateController } from "@lit-app/state";
import myState from '@/state'

import * as tfvis from "@tensorflow/tfjs-vis";

@customElement('plots-panel')
class PlotsPanel extends LitElementWw {

    state = new StateController(this, myState)

    @state() private _unsubscribe

    async connectedCallback() {
        super.connectedCallback()
        await this.updateComplete

        this._unsubscribe = myState.subscribe((key: string, dataset: any, state: State) => {
            if (dataset != null) {
                this.buildPlots(dataset)
            }
        }, ['dataset'])
    }

    disconnectedCallback() {
        this._unsubscribe()
    }

    buildPlots(dataset) {
        const parentContainer = this.renderRoot.querySelector<HTMLElement>("#plots")

        // remove previously built plots
        parentContainer.innerHTML = ""

        const label = dataset.label

        for (const [index, input] of dataset.inputs.entries()) {

            const values = dataset.data.map(data => ({
                x: data.inputs[index],
                y: data.label
            }))
            const series = label.key

            const container = parentContainer.appendChild(document.createElement('div'))
            tfvis.render.scatterplot(
                {drawArea: container},
                {values, series},
                {
                    xLabel: input.key,
                    yLabel: label.key,
                    width: 450,
                    height: 240
                }
            );
        }
    }

    static styles = css`
        .panel {
            height: 100%;
        }

        sl-card {
            height: 100%;
            display: flex;
            flex-direction: column;
            gap: 10px;
            --padding: 20px 0 0 0;
        }

        #plots {
            display: flex;
            flex-direction: row;
            gap: 10px;
            overflow-x: auto;
        }
    `

    render(){
        return html`
            <div class="panel">
                <sl-card>
                    <div id="plots"></div>
                </sl-card>
            </div>
        `;
    }
}