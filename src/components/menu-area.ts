import { widgetMsg } from '@webwriter/lit/localize'
import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, css } from 'lit'
import { consume } from '@lit/context'

import { globalStyles } from './global-styles'

import { editableContext } from './contexts'
import type { Settings } from '../model/app-types'
import { settingsContext } from './contexts'
import type { QAndAEntry } from '../model/app-types'
import { qAndAContext } from './contexts'
import type { ModelConf } from '../model/network-types'
import { modelConfContext } from './contexts'
import type { Selected } from '../model/app-types'
import type { SelectedEle } from '../model/app-types'
import { selectedContext } from './contexts'
import { selectedEleContext } from './contexts'
import { panelContext } from './contexts'

import { SettingsPanel } from './panels/settings-panel'
import { StartPanel } from './panels/start-panel'
import { HelpPanel } from './panels/help-panel'
import { NetworkPanel } from './panels/network-panel'
import { DataSetPanel } from './panels/data-set-panel'
import { TrainPanel } from './panels/train-panel'
import { PredictPanel } from './panels/predict-panel'
import { LayerPanel } from './panels/layer-panel'
import { NeuronPanel } from './panels/neuron-panel'
import { EdgePanel } from './panels/edge-panel'
import { CTab } from './reusables/c-tab'

import IconHome from "@tabler/icons/outline/home.svg"
import IconOne from "@tabler/icons/outline/circle-number-1.svg"
import IconTwo from "@tabler/icons/outline/circle-number-2.svg"
import IconThree from "@tabler/icons/outline/circle-number-3.svg"
import IconSend from "@tabler/icons/outline/send.svg"
import IconLayers from "@tabler/icons/outline/stack-2.svg";
import IconCpu from "@tabler/icons/outline/cpu.svg";
import IconArrows from "@tabler/icons/outline/arrows-diagonal.svg";
import SlIcon from "@shoelace-style/shoelace/dist/components/icon/icon.component.js"

export class MenuArea extends LitElementWw {
  private readonly msg = widgetMsg(this);

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
    "edge-panel": EdgePanel,
    "sl-icon": SlIcon,
  }

  @consume({ context: editableContext, subscribe: true })
  accessor editable: boolean = false

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
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
      }

      #rightMenu.collapsed {
        transform: translate(450px, 0);
      }

      #rightMenuTabs {
        margin-top: 10px;
        margin-left: 10px;
        position: relative;
        display: flex;
        column-gap: 5px;
        row-gap: 5px;
        flex-wrap: wrap
      }

      #rightMenuPanel {
        width: 435px;
        flex: 1 1 0;
        min-height: 0;
        overflow: auto;
        -ms-overflow-style: none;
        scrollbar-width: none;
        padding: 10px;
      }

      #rightMenuPanel::-webkit-scrollbar {
        display: none;
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
                >${this.msg('Settings')}</c-tab
              >`
            : html``}
          ${this.editable || this.settings.mayExport || this.settings.mayImport
            ? html` <c-tab name="start"><sl-icon slot="prefix" src=${IconHome}></sl-icon>${this.msg('Start')}</c-tab>`
            : html``}
          <c-tab name="network"><sl-icon slot="prefix" src=${IconOne}></sl-icon>${this.msg('Network')}</c-tab>
          <c-tab name="dataSet"><sl-icon slot="prefix" src=${IconTwo}></sl-icon>${this.msg('Data set')}</c-tab>
          <c-tab name="train"><sl-icon slot="prefix" src=${IconThree}></sl-icon>${this.msg('Train')}</c-tab>
          ${this.modelConf.model
            ? html` <c-tab name="predict"><sl-icon slot="prefix" src=${IconSend}></sl-icon>${this.msg('Predict')}</c-tab> `
            : html``}
          ${this.selected.layer && this.selectedEle
            ? html` <c-tab name="layer" colored><sl-icon slot="prefix" src=${IconLayers}></sl-icon>${this.msg('Layer')}</c-tab> `
            : html``}
          ${this.selected.neuron && this.selectedEle
            ? html` <c-tab name="neuron" colored><sl-icon slot="prefix" src=${IconCpu}></sl-icon>${this.msg('Neuron')}</c-tab> `
            : html``}
          ${this.selected.edge && this.selectedEle
            ? html` <c-tab name="edge" colored><sl-icon slot="prefix" src=${IconArrows}></sl-icon>${this.msg('Edge')}</c-tab> `
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
