import { widgetMsg } from '@webwriter/lit/localize'
import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, css } from 'lit'
import { property, query } from 'lit/decorators.js'
import { consume } from '@lit/context'

import type { DataSet } from '../../model/data-types'
import type { FeatureDesc } from '../../model/data-types'
import { dataSetContext } from '../contexts'

import { clearCharts, renderScatter } from '../charts'
import { CCard } from '../reusables/c-card'

export class PlotsCard extends LitElementWw {
  private readonly msg = widgetMsg(this);

  static scopedElements = {
    "c-card": CCard
  }
  
  @consume({ context: dataSetContext, subscribe: true })
  accessor dataSet: DataSet

  @property()
  accessor featureKey: string | null

  @query('#plotArea')
  accessor _plotArea: HTMLDivElement | null

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // the chart is drawn again only when its input changed, not on every update
  private plotted?: { area: HTMLElement; featureKey: string; dataSet: DataSet }

  protected updated(): void {
    if (!this._plotArea || !this.dataSet || !this.featureKey) return
    const last = this.plotted
    if (last?.area === this._plotArea && last.featureKey === this.featureKey && last.dataSet === this.dataSet) return
    this.plotted = { area: this._plotArea, featureKey: this.featureKey, dataSet: this.dataSet }
    const featureIndex: number = this.dataSet.featureDescs.findIndex(
      (featureDesc: FeatureDesc) => featureDesc.key == this.featureKey
    )
    const points = this.dataSet.data.map((data) => ({
      x: data.features[featureIndex],
      y: data.label,
    }))
    renderScatter(this._plotArea, points, this.featureKey, this.dataSet.labelDesc.key, 'Data set')
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    if (this._plotArea) clearCharts(this._plotArea)
    this.plotted = undefined
  }

  buildPlots(): TemplateResult<1> {
    if (this.dataSet && this.featureKey) {
      return html`<div id="plots"><div id="plotArea"></div></div>`
    } else {
      return html`${this.msg('Click on an feature pill above to see the relation between this feature and the label in a plot')}`
    }
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult = css`
    #plotArea {
      pointer-events: none;
    }
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
            ? `${this.featureKey} ${this.msg('plotted against')} ${this.dataSet.labelDesc.key}`
            : this.msg('Plots')}
        </div>
        <div slot="content">${this.buildPlots()}</div>
      </c-card>
    `
  }
}
