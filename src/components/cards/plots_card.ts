import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import { consume } from '@lit-labs/context'
import { dataSetContext } from '@/contexts/data_set_context'

import * as tfvis from '@tensorflow/tfjs-vis'
import { DataSet } from '@/data_set/data_set'
import { DataSetInput } from '@/types/data_set_input'
import { DataSetLabel } from '@/types/data_set_label'

@customElement('plots-card')
export class PlotsCard extends LitElementWw {
  @consume({ context: dataSetContext, subscribe: true })
  dataSet: DataSet

  @property()
  inputKey: string | null

  buildPlots(): TemplateResult<1> {
    if (this.dataSet && this.inputKey) {
      const parentContainer: HTMLDivElement = document.createElement('div')
      parentContainer.setAttribute('id', 'plots')

      const label: DataSetLabel = this.dataSet.label

      const inputIndex: number = this.dataSet.inputs.findIndex(
        (input: DataSetInput) => input.key == this.inputKey
      )

      const values: tfvis.Point2D[] = this.dataSet.data.map((data) => ({
        x: data.inputs[inputIndex],
        y: data.label,
      }))

      // @TODO additional series for predicted data; maybe split test/train as
      // different series
      const series: string[] = ['Data set']

      const container: HTMLDivElement = parentContainer.appendChild(
        document.createElement('div')
      )
      void tfvis.render.scatterplot(
        { drawArea: container },
        { values, series },
        {
          xLabel: this.inputKey,
          yLabel: label.key,
          width: 350,
          height: 240,
        }
      )

      return html`${parentContainer}`
    } else {
      return html`Click on an input pill above to see the relation between this
      input and the output in a plot`
    }
  }

  static styles: CSSResult[] = [
    ...globalStyles,
    css`
      #plots {
        display: flex;
        flex-direction: row;
        gap: 10px;
        overflow-x: auto;
      }
    `,
  ]

  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Plots</div>
        <div slot="content">${this.buildPlots()}</div>
      </c-card>
    `
  }
}
