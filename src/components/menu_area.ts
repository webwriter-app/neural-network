import { LitElement } from 'lit'
import { CSSResult, TemplateResult, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import { editableContext } from '@/contexts/editable_context'
import { settingsContext, Settings } from '@/contexts/settings_context'
import { HelpEntry, helpContext } from '@/contexts/help_context'
import { ModelConf, modelConfContext } from '@/contexts/model_conf_context'
import { Selected, selectedContext } from '@/contexts/selected_context'
import {
  SelectedEle,
  selectedEleContext,
} from '@/contexts/selected_ele_context'
import { panelContext } from '@/contexts/panels_context'

import '@/components/panels/settings_panel.ts'
import '@/components/panels/start_panel.ts'
import '@/components/panels/help_panel.ts'
import '@/components/panels/network_panel.ts'
import '@/components/panels/data_set_panel.ts'
import '@/components/panels/train_panel.ts'
import '@/components/panels/predict_panel.ts'
import '@/components/panels/layer_panel.ts'
import '@/components/panels/neuron_panel.ts'
import '@/components/panels/edge_panel.ts'

@customElement('menu-area')
export class MenuArea extends LitElement {
  @consume({ context: editableContext, subscribe: true })
  editable: boolean

  @consume({ context: settingsContext, subscribe: true })
  settings: Settings

  @consume({ context: helpContext, subscribe: true })
  help: HelpEntry[]

  @consume({ context: modelConfContext, subscribe: true })
  modelConf: ModelConf

  @consume({ context: selectedContext, subscribe: true })
  selected: Selected

  @consume({ context: selectedEleContext, subscribe: true })
  selectedEle: SelectedEle

  @consume({ context: panelContext, subscribe: true })
  panel: string

  /* STYLES */
  static styles: CSSResult[] = [
    ...globalStyles,
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
      <div id="rightMenu" class="${!this.panel ? 'collapsed' : ''}">
        <div id="rightMenuTabs">
          ${this.editable
            ? html`<c-tab name="settings" class="only-editable"
                >Settings</c-tab
              >`
            : html``}
          ${this.editable || this.settings.mayExport || this.settings.mayImport
            ? html` <c-tab name="start">Start</c-tab>`
            : html``}
          ${this.editable || this.help.length
            ? html`<c-tab name="help">Help</c-tab>`
            : html``}
          <c-tab name="network">Network</c-tab>
          <c-tab name="dataSet">Data set</c-tab>
          <c-tab name="train">Train</c-tab>
          ${this.modelConf.model
            ? html` <c-tab name="predict">Predict</c-tab> `
            : html``}
          ${this.selected.layer && this.selectedEle
            ? html` <c-tab name="layer" colored>Layer</c-tab> `
            : html``}
          ${this.selected.neuron && this.selectedEle
            ? html` <c-tab name="neuron" colored>Neuron</c-tab> `
            : html``}
          ${this.selected.edge && this.selectedEle
            ? html` <c-tab name="edge" colored>Edge</c-tab> `
            : html``}
        </div>
        <div id="rightMenuPanel" class="${!this.panel ? 'collapsed' : ''}">
          ${this.editable ? html`<settings-panel></settings-panel>` : html``}
          <start-panel></start-panel>
          ${this.editable || this.help.length
            ? html`<help-panel></help-panel>`
            : html``}
          <network-panel></network-panel>
          <data-set-panel></data-set-panel>
          <train-panel></train-panel>
          ${this.modelConf.model
            ? html` <predict-panel></predict-panel> `
            : html``}
          ${this.selected.layer && this.selectedEle
            ? html` <layer-panel></layer-panel> `
            : html``}
          ${this.selected.neuron && this.selectedEle
            ? html` <neuron-panel></neuron-panel> `
            : html``}
          ${this.selected.edge && this.selectedEle
            ? html` <edge-panel></edge-panel> `
            : html``}
        </div>
      </div>
    `
  }
}
