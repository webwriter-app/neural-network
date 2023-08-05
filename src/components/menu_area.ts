import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import { consume } from '@lit-labs/context'
import { Model, modelContext } from '@/contexts/model_context'
import { Selected, selectedContext } from '@/contexts/selected_context'
import { panelGroups, openPanelsContext } from '@/contexts/panels_context'

import { globalStyles } from '@/global_styles'

import '@/components/panels/settings_panel.ts'
import '@/components/panels/network_panel.ts'
import '@/components/panels/data_set_panel.ts'
import '@/components/panels/train_panel.ts'
import '@/components/panels/predict_panel.ts'
import '@/components/panels/layer_panel.ts'
import '@/components/panels/neuron_panel.ts'
import '@/components/panels/edge_panel.ts'

@customElement('menu-area')
export class MenuArea extends LitElementWw {
  @consume({ context: modelContext, subscribe: true })
  model: Model

  @consume({ context: selectedContext, subscribe: true })
  selected: Selected

  @consume({ context: openPanelsContext, subscribe: true })
  openPanels: string[]

  /* STYLES */
  static styles: CSSResult[] = [
    globalStyles,
    css`
      #rightMenu {
        width: 100%;
        height: 100%;
      }

      #rightMenu.collapsed {
        transform: translate(450px, 0);
      }

      #rightMenuTabs {
        position: absolute;
        top: 10px;
        right: 460px;
        width: 90px;
        display: grid;
        gap: 10px;
      }

      #rightMenuPanel {
        width: 100%;
        height: 100%;
        overflow: auto;
        padding: 10px;
      }

      #rightMenuPanel.collapsed {
        display: none;
      }
    `,
  ]

  render(): TemplateResult<1> {
    return html`
      <div
        id="rightMenu"
        class="${!this.openPanels.some((openPanel: string) => {
          return panelGroups['right'].includes(openPanel)
        })
          ? 'collapsed'
          : ''}"
      >
        <div id="rightMenuTabs">
          <c-tab group="right" name="settings" class="only-editable"
            >Settings</c-tab
          >
          <c-tab group="right" name="network">Network</c-tab>
          <c-tab group="right" name="dataSet">Data set</c-tab>
          <c-tab group="right" name="train">Train</c-tab>
          ${this.model.model
            ? html` <c-tab group="right" name="predict">Predict</c-tab> `
            : html``}
          ${this.selected.layer
            ? html` <c-tab group="right" name="layer" colored>Layer</c-tab> `
            : html``}
          ${this.selected.neuron
            ? html` <c-tab group="right" name="neuron" colored>Neuron</c-tab> `
            : html``}
          ${this.selected.edge
            ? html` <c-tab group="right" name="edge" colored>Edge</c-tab> `
            : html``}
        </div>
        <div
          id="rightMenuPanel"
          class="${!this.openPanels.some((openPanel: string) => {
            return panelGroups['right'].includes(openPanel)
          })
            ? 'collapsed'
            : ''}"
        >
          <settings-panel></settings-panel>
          <network-panel></network-panel>
          <data-set-panel></data-set-panel>
          <train-panel></train-panel>
          ${this.model.model ? html` <predict-panel></predict-panel> ` : html``}
          ${this.selected.layer ? html` <layer-panel></layer-panel> ` : html``}
          ${this.selected.neuron
            ? html` <neuron-panel></neuron-panel> `
            : html``}
          ${this.selected.edge ? html` <edge-panel></edge-panel> ` : html``}
        </div>
      </div>
    `
  }
}
