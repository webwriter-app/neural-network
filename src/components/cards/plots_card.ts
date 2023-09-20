import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import type { DataSet } from '@/types/data_set'
import type { FeatureDesc } from '@/types/feature_desc'
import type { LabelDesc } from '@/types/label_desc'
import { dataSetContext } from '@/contexts/data_set_context'

import * as tfvis from '@tensorflow/tfjs-vis'

@customElement('plots-card')
export class PlotsCard extends LitElementWw {
  @consume({ context: dataSetContext, subscribe: true })
  dataSet: DataSet

  @property()
  featureKey: string | null

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  buildPlots(): TemplateResult<1> {
    if (this.dataSet && this.featureKey) {
      const parentContainer: HTMLDivElement = document.createElement('div')
      parentContainer.setAttribute('id', 'plots')

      const labelDesc: LabelDesc = this.dataSet.labelDesc

      const featureIndex: number = this.dataSet.featureDescs.findIndex(
        (featureDesc: FeatureDesc) => featureDesc.key == this.featureKey
      )

      const values: tfvis.Point2D[] = this.dataSet.data.map((data) => ({
        x: data.features[featureIndex],
        y: data.label,
      }))

      // TODO maybe additional series for predicted data?; test/train as
      // different series?
      const series: string[] = ['Data set']

      const container: HTMLDivElement = parentContainer.appendChild(
        document.createElement('div')
      )
      void tfvis.render.scatterplot(
        { drawArea: container },
        { values, series },
        {
          xLabel: this.featureKey,
          yLabel: labelDesc.key,
          width: 350,
          height: 240,
        }
      )

      return html`${parentContainer}`
    } else {
      return html`Click on an feature pill above to see the relation between
      this feature and the label in a plot`
    }
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult = css`
    #plots {
      display: flex;
      flex-direction: row;
      gap: 10px;
      overflow-x: auto;
    }
  `

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">
          ${this.featureKey
            ? `${this.featureKey} plotted against ${this.dataSet.labelDesc.key}`
            : 'Plots'}
        </div>
        <div slot="content">${this.buildPlots()}</div>
      </c-card>
    `
  }
}
