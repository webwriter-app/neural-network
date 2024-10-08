import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import { consume } from '@lit/context'

import { globalStyles } from '@/global_styles'

import { editableContext } from '@/contexts/editable_context'
import type { Settings } from '@/types/settings'
import { settingsContext } from '@/contexts/settings_context'
import type { QAndAEntry } from '@/types/q_and_a_entry'
import { qAndAContext } from '@/contexts/q_and_a_context'
import type { ModelConf } from '@/types/model_conf'
import { modelConfContext } from '@/contexts/model_conf_context'
import type { Selected } from '@/types/selected'
import type { SelectedEle } from '@/types/selected_ele'
import { selectedContext } from '@/contexts/selected_context'
import { selectedEleContext } from '@/contexts/selected_ele_context'
import { panelContext } from '@/contexts/panels_context'

import { SettingsPanel } from '@/components/panels/settings_panel'
import { StartPanel } from '@/components/panels/start_panel'
import { HelpPanel } from './panels/help_panel'
import { NetworkPanel } from './panels/network_panel'
import { DataSetPanel } from './panels/data_set_panel'
import { TrainPanel } from './panels/train_panel'
import { PredictPanel } from './panels/predict_panel'
import { LayerPanel } from './panels/layer_panel'
import { NeuronPanel } from './panels/neuron_panel'
import { EdgePanel } from './panels/edge_panel'
import { CTab } from './reusables/c-tab'

export class MenuArea extends LitElementWw {

  static scopedElements = {
    "c-tab": CTab,
    "settings-panel": SettingsPanel,
    "start-panel": StartPanel,
    "help-panel": HelpPanel,
    "network-panel": NetworkPanel,
    "data-set-panel": DataSetPanel,
    "train-panel": TrainPanel,
    "predict-panel": PredictPanel,
    "layer-panel": LayerPanel,
    "neuron-panel": NeuronPanel,
    "edge-panel": EdgePanel
  }

  @consume({ context: editableContext, subscribe: true })
  accessor editable: boolean

  @consume({ context: settingsContext, subscribe: true })
  accessor settings: Settings

  @consume({ context: qAndAContext, subscribe: true })
  accessor qAndA: QAndAEntry[]

  @consume({ context: modelConfContext, subscribe: true })
  accessor modelConf: ModelConf

  @consume({ context: selectedContext, subscribe: true })
  accessor selected: Selected

  @consume({ context: selectedEleContext, subscribe: true })
  accessor selectedEle: SelectedEle

  @consume({ context: panelContext, subscribe: true })
  accessor panel: string

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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
