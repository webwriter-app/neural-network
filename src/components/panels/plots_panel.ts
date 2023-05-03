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
                this.buildPlots(dataset.data)
            }
        }, ['dataset'])
    }

    disconnectedCallback() {
        this._unsubscribe()
    }

    buildPlots(data) {
        const parentContainer = this.renderRoot.querySelector<HTMLElement>("#plots")

        // remove previously built plots
        parentContainer.innerHTML = ""

        for (const [inputKey, outputValue] of Object.entries(data[0].inputData)) {

            const values = []
            const series = []

            for (const [outputKey, outputValue] of Object.entries(data[0].outputData)) {
                values.push(data.map(data => ({
                    x: data.inputData[inputKey],
                    y: data.outputData[outputKey],
                })))
                series.push(outputKey)
            }

            const container = parentContainer.appendChild(document.createElement('div'))
            tfvis.render.scatterplot(
                {drawArea: container},
                {values, series},
                {
                    xLabel: inputKey,
                    yLabel: "OUTPUT",
                    width: 400,
                    height: 260
                }
            );
        }
    }

    static styles = css`
        .panel {
            display: flex;
            flex-direction: column;
            gap: 10px;
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
                <div id="plots"></div>
            </div>
        `;
    }
}