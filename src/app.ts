import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, css, PropertyDeclarations } from 'lit'
import { customElement, property /* , query */, state } from 'lit/decorators.js'
import { ContextRoot, provide } from '@lit/context'

import '@shoelace-style/shoelace/dist/themes/light.css'
import '@shoelace-style/shoelace/dist/themes/dark.css'

import { globalStyles } from '@/global_styles'

import { ConfigurationController } from '@/controllers/configuration_controller'

import type { SetupStatus } from '@/types/setup_status'
import { setupStatusContext } from '@/contexts/setup_status_context'
import { SetupController } from '@/controllers/setup_controller'
import { SetupUtils } from '@/utils/setup_utils'

import { editableContext } from '@/contexts/editable_context'

import type { Settings } from '@/types/settings'
import { settingsContext } from '@/contexts/settings_context'
import { SettingsController } from '@/controllers/settings_controller'
import { SettingsUtils } from '@/utils/settings_utils'

import type { QAndAEntry } from '@/types/q_and_a_entry'
import { qAndAContext } from '@/contexts/q_and_a_context'
import { QAndAController } from '@/controllers/q_and_a_controller'
import { QAndAUtils } from '@/utils/q_and_a_utils'

import type { CCanvas } from '@/components/canvas'
import { canvasContext } from '@/contexts/canvas_context'

import type { CLayerConf } from '@/types/c_layer_conf'
import type { CLayerConnectionConf } from '@/types/c_layer_connection_conf'
import { CNetwork } from '@/components/network/network'
import { networkContext } from '@/contexts/network_context'
import { layerConfsContext } from '@/contexts/layer_confs_context'
import { layerConnectionConfsContext } from '@/contexts/layer_con_confs_context'
import { NetworkController } from '@/controllers/network_controller'

import type { DataSet } from '@/types/data_set'
import { dataSetContext } from '@/contexts/data_set_context'
import { availableDataSetsContext } from '@/contexts/available_data_sets_context'
import { DataSetController } from '@/controllers/data_set_controller'
import { DataSetUtils } from '@/utils/data_set_utils'

import type { TrainOptions } from '@/types/train_options'
import type { ModelConf } from '@/types/model_conf'
import { trainOptionsContext } from '@/contexts/train_options_context'
import { modelConfContext } from '@/contexts/model_conf_context'
import { ModelController } from '@/controllers/model_controller'
import { ModelUtils } from '@/utils/model_utils'

import type { Selected } from '@/types/selected'
import type { SelectedEle } from '@/types/selected_ele'
import { selectedContext } from '@/contexts/selected_context'
import { selectedEleContext } from '@/contexts/selected_ele_context'
import { SelectionController } from '@/controllers/selection_controller'

import { panelContext } from '@/contexts/panels_context'
import { PanelController } from '@/controllers/panel_controller'

/* import { AlertController } from '@/controllers/alert_controller'
import { AlertUtils } from '@/utils/alert_utils'*/

import type { Theme } from '@/types/theme'
import { themeContext } from '@/contexts/theme_context'
import { ThemeController } from '@/controllers/theme_controller'
import { ThemeUtils } from '@/utils/theme_utils'

import { CCanvasArea } from '@/components/canvas_area'
import { MenuArea } from '@/components/menu_area'
import { ThemeSwitch } from './components/theme_switch'
import { ContextProvider } from '@lit/context'

export class NeuralNetwork extends LitElementWw {

  static properties: PropertyDeclarations = {
    setupStatus: { attribute: false },
    editable: { attribute: true, type: Boolean, reflect: true },
    settings: { attribute: true, type: Object, reflect: true },
    qAndA: { attribute: true, type: Object, reflect: true },
    canvas: {attribute: false},
    network: {attribute: false},
    layerConfs: { attribute: true, type: Array, reflect: true },
    layerConnectionConfs: { attribute: true, type: Array, reflect: true },
    dataSet: { attribute: true, type: Object, reflect: true },
    availableDataSets: { attribute: true, type: Array, reflect: true },
    trainOptions: { attribute: true, type: Object, reflect: true },
    modelConf: { attribute: false },
    selected: { attribute: false },
    selectedEle: { attribute: false },
    panel: { attribute: false },
    theme: { attribute: false }
  }

  constructor() {
    super()
    this.setupStatusProvider = new ContextProvider(this, {context: setupStatusContext, initialValue: SetupUtils.defaultSetupStatus})
    this.editableProvider = new ContextProvider(this, {context: editableContext, initialValue: false})
    this.settingsProvider = new ContextProvider(this, {context: settingsContext, initialValue: JSON.parse(JSON.stringify(SettingsUtils.defaultSettings))})
    this.qAndAProvider = new ContextProvider(this, {context: qAndAContext, initialValue: [...QAndAUtils.defaultQAndA]})
    this.canvasProvider = new ContextProvider(this, {context: canvasContext})
    this.networkProvider = new ContextProvider(this, {context: networkContext})
    this.layerConfsProvider = new ContextProvider(this, {context: layerConfsContext, initialValue: []})
    this.layerConnectionConfsProvider = new ContextProvider(this, {context: layerConnectionConfsContext, initialValue: []})
    this.dataSetProvider = new ContextProvider(this, {context: dataSetContext, initialValue: DataSetUtils.defaultDataSet})
    this.availableDataSetsProvider = new ContextProvider(this, {context: availableDataSetsContext, initialValue: DataSetUtils.defaultAvailableDataSets})
    this.trainOptionsProvider = new ContextProvider(this, {context: trainOptionsContext, initialValue: <TrainOptions>(JSON.parse(JSON.stringify(ModelUtils.defaultTrainOptions)))})
    this.modelConfProvider = new ContextProvider(this, {context: modelConfContext, initialValue: <ModelConf>(JSON.parse(JSON.stringify(ModelUtils.defaultModelConf)))})
    this.selectedProvider = new ContextProvider(this, {context: selectedContext, initialValue: {}})
    this.selectedEleProvider = new ContextProvider(this, {context: selectedEleContext})
    this.panelProvider = new ContextProvider(this, {context: panelContext})
    this.themeProvider = new ContextProvider(this, {context: themeContext, initialValue: ThemeUtils.lightTheme})
  }

  setupStatusProvider: ContextProvider<any, NeuralNetwork>
  editableProvider: ContextProvider<any, NeuralNetwork>
  settingsProvider: ContextProvider<any, NeuralNetwork>
  qAndAProvider: ContextProvider<any, NeuralNetwork>
  canvasProvider: ContextProvider<any, NeuralNetwork>
  networkProvider: ContextProvider<any, NeuralNetwork>
  layerConfsProvider: ContextProvider<any, NeuralNetwork>
  layerConnectionConfsProvider: ContextProvider<any, NeuralNetwork>
  dataSetProvider: ContextProvider<any, NeuralNetwork>
  availableDataSetsProvider: ContextProvider<any, NeuralNetwork>
  trainOptionsProvider: ContextProvider<any, NeuralNetwork>
  modelConfProvider: ContextProvider<any, NeuralNetwork>
  selectedProvider: ContextProvider<any, NeuralNetwork>
  selectedEleProvider: ContextProvider<any, NeuralNetwork>
  panelProvider: ContextProvider<any, NeuralNetwork>
  themeProvider: ContextProvider<any, NeuralNetwork>

  connectedCallback(): void {
    super.connectedCallback()
    const root = new ContextRoot();
    root.attach(document.body);
  }

  static scopedElements = {
    "canvas-area": CCanvasArea,
    "menu-area": MenuArea,
    "c-network": CNetwork,
    "theme-switch": ThemeSwitch
  }
  // DATA PROVIDERS AND CONTROLLERS  - - - - - - - - - - - - - - - - - - - - - -
  configurationController = new ConfigurationController(this)

  // -> SETUP STATUS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  get setupStatus() {
    return this.setupStatusProvider.value
  }
  set setupStatus(value) {
    this.setupStatusProvider.setValue(value)
    this.requestUpdate("setupStatus")
  }
  setupController = new SetupController(this)

  // -> EDITABLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  get editable() {
    return this.editableProvider.value
  }
  set editable(value) {
    this.editableProvider.setValue(value)
    this.requestUpdate("editable")
  }

  // -> SETTINGS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  get settings() {
    return this.settingsProvider.value
  }
  set settings(value) {
    this.settingsProvider.setValue(value)
    this.requestUpdate("settings")
  }
  settingsController = new SettingsController(this)

  // -> HELP - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  get qAndA() {
    return this.qAndAProvider.value
  }
  set qAndA(value) {
    this.qAndAProvider.setValue(value)
    this.requestUpdate("qAndA")
  }
  qAndAController = new QAndAController(this)

  // -> CANVAS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  get canvas() {
    return this.canvasProvider.value
  }
  set canvas(value) {
    this.canvasProvider.setValue(value)
    this.requestUpdate("canvas")
  }

  // -> NETWORK  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  get network() {
    return this.networkProvider.value
  }
  set network(value) {
    this.networkProvider.setValue(value)
    this.requestUpdate("network")
  }
  get layerConfs() {
    return this.layerConfsProvider.value
  }
  set layerConfs(value) {
    this.layerConfsProvider.setValue(value)
    this.requestUpdate("layerConfs")
  }
  get layerConnectionConfs() {
    return this.layerConnectionConfsProvider.value
  }
  set layerConnectionConfs(value) {
    this.layerConnectionConfsProvider.setValue(value)
    this.requestUpdate("layerConnectionConfs")
  }
  networkController = new NetworkController(this)

  // -> DATA SET - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  get dataSet() {
    return this.dataSetProvider.value
  }
  set dataSet(value) {
    this.dataSetProvider.setValue(value)
    this.requestUpdate("dataSet")
  }
  get availableDataSets() {
    return this.availableDataSetsProvider.value
  }
  set availableDataSets(value) {
    this.availableDataSetsProvider.setValue(value)
    this.requestUpdate("availableDataSets")
  }
  dataSetController = new DataSetController(this)

  // -> MODEL  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  get trainOptions() {
    return this.trainOptionsProvider.value
  }
  set trainOptions(value) {
    this.trainOptionsProvider.setValue(value)
    this.requestUpdate("trainOptions")
  }
  get modelConf() {
    return this.modelConfProvider.value
  }
  set modelConf(value) {
    this.modelConfProvider.setValue(value)
    this.requestUpdate("modelConf")
  }
  trainMetricsContainer: HTMLDivElement
  modelController = new ModelController(this)

  // -> SELECTED - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  get selected() {
    return this.selectedProvider.value
  }
  set selected(value) {
    this.selectedProvider.setValue(value)
    this.requestUpdate("selected")
  }
  get selectedEle() {
    return this.selectedEleProvider.value
  }
  set selectedEle(value) {
    this.selectedEleProvider.setValue(value)
    this.requestUpdate("selectedEle")
  }
  selectionController = new SelectionController(this)

  // -> PANELS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  get panel() {
    return this.panelProvider.value
  }
  set panel(value) {
    this.panelProvider.setValue(value)
    this.requestUpdate("panel")
  }
  panelController = new PanelController(this)

  // -> THEME  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  get theme() {
    return this.themeProvider.value
  }
  set theme(value) {
    this.themeProvider.setValue(value)
    this.requestUpdate("theme")
  }
  themeController = new ThemeController(this)

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = [
    globalStyles,
    css`
      :host {
        min-height: 400px;
        height: 100%;
        display: flex;
        flex-direction: row;
        overflow: hidden;
        background-color: var(--sl-color-neutral-0);
      }

      #loadingPage {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: var(--sl-color-neutral-0);
      }

      #loadingDiv {
        position: absolute;
        left: 50%;
        top: 50%;
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      canvas-area {
        width: calc(100% - 450px);
        height: 100%;
      }

      canvas-area.right-collapsed {
        width: 100%;
      }

      menu-area {
        width: 450px;
      }

      menu-area.right-collapsed {
        width: 0;
      }

      #divider {
        position: absolute;
        right: 449px;
        width: 2px;
        top: 10px;
        bottom: 10px;
        background-color: var(--sl-color-neutral-50);
      }

      theme-switch {
        position: absolute;
        bottom: 10px;
        left: 10px;
      }

      /* .sl-toast-stack {
        top: 300 !important;
        width: 50rem !important;
      } */
    `,
  ]

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -F
  render(): TemplateResult<1>[] {
    const renderedHTML: TemplateResult<1>[] = []
    /* renderedHTML.push(html`<div class="sl-toast-stack"></div>`) */

    renderedHTML.push(
      html`<style>
        ${(this.theme as any).styles}
      </style>`
    )
    renderedHTML.push(html` <canvas-area
      class="${!this.panel ? 'right-collapsed' : ''}"
      @canvas-created="${(e: CustomEvent<CCanvas>) => {
        this.canvas = e.detail
      }}"
    >
    </canvas-area>`)
    if ((this.setupStatus as any).loading) {
      renderedHTML.push(html`
        <div id="loadingPage">
          <div id="loadingDiv">
            <h1>Loading</h1>
            <sl-spinner style="font-size: 3rem;"></sl-spinner>
          </div>
        </div>
      `)
    } else {
      renderedHTML.push(html`
        <div id="divider" class="${!this.panel ? 'hidden' : ''}"></div>

        <menu-area
          part="options"
          class="${!this.panel ? 'right-collapsed' : ''}"
          @set-train-metrics-container="${(e: CustomEvent<HTMLDivElement>) =>
            this.modelController.setTrainMetricsContainer(e.detail)}"
        ></menu-area>

        <c-network></c-network>
      `)
    }
    // renderedHTML.push(html`<theme-switch></theme-switch>`)
    return renderedHTML
  }
}

customElements.define("webwriter-neural-network", NeuralNetwork)