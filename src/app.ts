import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, css, PropertyDeclarations, PropertyValues } from 'lit'
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

import '@webcomponents/scoped-custom-element-registry';
import { styleMap } from 'lit/directives/style-map.js'

import { localized, msg } from '@lit/localize'
import LOCALIZE from "../localization/generated";

/**
 * @summary Deep learning visualization for feed-forward networks with custom datasets, training and prediction.
 *
 * @tag webwriter-neural-network
 * @tagname webwriter-neural-network
 *
 * @attr {boolean} [editable=false] - Enables authoring/editing features in child components. Reflected to the "editable" attribute.
 * @attr {Settings} settings - Current application settings. Provide as a property for non-string values.
 * @attr {QAndAEntry[]} qAndA - Static help content.
 * @attr {CLayerConf[]} layerConfs - Network layer configurations.
 * @attr {CLayerConnectionConf[]} layerConnectionConfs - Layer connection configurations.
 * @attr {DataSet} dataSet - Active dataset.
 * @attr {DataSet[]} availableDataSets - List of available datasets.
 * @attr {TrainOptions} trainOptions - Training options.
 *
 * @prop {SetupStatus} setupStatus - Setup state of the widget.
 * @prop {CCanvas} canvas - Canvas instance created by the canvas-area.
 * @prop {CNetwork} network - Network instance.
 * @prop {ModelConf} modelConf - Current model configuration.
 * @prop {Selected} selected - Current multi-selection state.
 * @prop {SelectedEle} selectedEle - Current single selected element.
 * @prop {boolean} panel - Whether the right panel is open.
 * @prop {Theme} theme - Active theme object with style string.
 *
 * @cssproperty --sl-color-neutral-0 - Host background color (forwarded from Shoelace).
 * @cssproperty --sl-color-neutral-50 - Divider color (forwarded from Shoelace).
 */
@localized()
export class NeuralNetwork extends LitElementWw {
  /** @internal Localization bundle used by @lit/localize. */
  public localize = LOCALIZE;

  /**
   * Declares reactive properties and attribute reflection.
   */
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

  /**
   * Creates context providers for all data channels and initializes defaults via utility modules.
   * @internal
   */
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

  /** @internal Context providers wired to @lit/context. */
  private setupStatusProvider: ContextProvider<any, NeuralNetwork>
  /** @internal */
  private editableProvider: ContextProvider<any, NeuralNetwork>
  /** @internal */
  private settingsProvider: ContextProvider<any, NeuralNetwork>
  /** @internal */
  private qAndAProvider: ContextProvider<any, NeuralNetwork>
  /** @internal */
  private canvasProvider: ContextProvider<any, NeuralNetwork>
  /** @internal */
  private networkProvider: ContextProvider<any, NeuralNetwork>
  /** @internal */
  private layerConfsProvider: ContextProvider<any, NeuralNetwork>
  /** @internal */
  private layerConnectionConfsProvider: ContextProvider<any, NeuralNetwork>
  /** @internal */
  private dataSetProvider: ContextProvider<any, NeuralNetwork>
  /** @internal */
  private availableDataSetsProvider: ContextProvider<any, NeuralNetwork>
  /** @internal */
  private trainOptionsProvider: ContextProvider<any, NeuralNetwork>
  /** @internal */
  private modelConfProvider: ContextProvider<any, NeuralNetwork>
  /** @internal */
  private selectedProvider: ContextProvider<any, NeuralNetwork>
  /** @internal */
  private selectedEleProvider: ContextProvider<any, NeuralNetwork>
  /** @internal */
  private panelProvider: ContextProvider<any, NeuralNetwork>
  /** @internal */
  private themeProvider: ContextProvider<any, NeuralNetwork>

  /**
   * Lit lifecycle hook. Attaches a ContextRoot to the document body to enable
   * using context outside the component tree when necessary.
   * @internal
   */
  connectedCallback(): void {
    super.connectedCallback()
    const root = new ContextRoot();
    root.attach(document.body);
  }

  /**
   * Whether the editor is in fullscreen mode.
   * @internal
   */
  private get isFullscreen(): boolean {
      return this.ownerDocument.fullscreenElement === this;
  }

  /**
   * Toggles fullscreen mode using the Fullscreen API and requests a re-render afterwards.
   * @internal
   */
  private async _onFullscreenToggle() {
    if (this.isFullscreen) {
      await this.ownerDocument.exitFullscreen();
      this.style.height = "500px"
      this.style.width = "min(100%,796px)"
      this.requestUpdate()
    } else {
      try {
          await this.requestFullscreen();
          this.style.height = "100%"
          this.style.width = "100%"
          this.requestUpdate()
      } catch (error) {
          console.error(msg("Failed to enter fullscreen mode."));
      }
    }
  }

  /**
   * Lit lifecycle hook: invoked after the component's DOM is first rendered.
   * Adjusts host dimensions based on its bounding client rect to account for borders.
   * @internal
   */
  protected firstUpdated(_changedProperties: PropertyValues): void {
      super.firstUpdated(_changedProperties)
      setTimeout(() => {
        const dim: DOMRect = this.getBoundingClientRect()
        this.style.height = Math.max(dim.height - 4, 500) +"px"
        this.style.width = "min(100%," + (dim.width - 4) + "px)"
      });
  }

  /**
   * Scoped element registry for child components used by this widget.
   */
  static scopedElements = {
    "canvas-area": CCanvasArea,
    "menu-area": MenuArea,
    "c-network": CNetwork,
    "theme-switch": ThemeSwitch
  }

  // DATA PROVIDERS AND CONTROLLERS  - - - - - - - - - - - - - - - - - - - - - -

  /** @internal Global configuration controller for the widget. */
  configurationController = new ConfigurationController(this)

  // -> SETUP STATUS -----------------------------------------------------------

  /**
   * Setup status of the widget.
   */
  get setupStatus(): SetupStatus {
    return this.setupStatusProvider.value
  }
  set setupStatus(value: SetupStatus) {
    this.setupStatusProvider.setValue(value)
    this.requestUpdate("setupStatus")
  }
  /** @internal Controller handling setup lifecycle and transitions. */
  setupController = new SetupController(this)

  // -> EDITABLE ---------------------------------------------------------------

  /**
   * Whether editing is enabled.
   */
  get editable(): boolean {
    return this.editableProvider.value
  }
  set editable(value: boolean) {
    this.editableProvider.setValue(value)
    this.requestUpdate("editable")
  }

  // -> SETTINGS ---------------------------------------------------------------

  /**
   * Application settings.
   */
  get settings(): Settings {
    return this.settingsProvider.value
  }
  set settings(value: Settings) {
    this.settingsProvider.setValue(value)
    this.requestUpdate("settings")
  }
  /** @internal Controller for reading/updating settings. */
  settingsController = new SettingsController(this)

  // -> HELP -------------------------------------------------------------------

  /**
   * Help/Q&A content.
   */
  get qAndA(): QAndAEntry[] {
    return this.qAndAProvider.value
  }
  set qAndA(value: QAndAEntry[]) {
    this.qAndAProvider.setValue(value)
    this.requestUpdate("qAndA")
  }
  /** @internal Controller for maintaining Q&A content. */
  qAndAController = new QAndAController(this)

  // -> CANVAS -----------------------------------------------------------------

  /**
   * Canvas instance created by the canvas-area child component.
   */
  get canvas(): CCanvas | undefined {
    return this.canvasProvider.value
  }
  set canvas(value: CCanvas | undefined) {
    this.canvasProvider.setValue(value)
    this.requestUpdate("canvas")
  }

  // -> NETWORK ----------------------------------------------------------------

  /**
   * Network instance used for neural network structure visualization.
   */
  get network(): CNetwork | undefined {
    return this.networkProvider.value
  }
  set network(value: CNetwork | undefined) {
    this.networkProvider.setValue(value)
    this.requestUpdate("network")
  }

  /**
   * Layer configuration list.
   */
  get layerConfs(): CLayerConf[] {
    return this.layerConfsProvider.value
  }
  set layerConfs(value: CLayerConf[]) {
    this.layerConfsProvider.setValue(value)
    this.requestUpdate("layerConfs")
  }

  /**
   * Layer connection configuration list between layers.
   */
  get layerConnectionConfs(): CLayerConnectionConf[] {
    return this.layerConnectionConfsProvider.value
  }
  set layerConnectionConfs(value: CLayerConnectionConf[]) {
    this.layerConnectionConfsProvider.setValue(value)
    this.requestUpdate("layerConnectionConfs")
  }

  /** @internal Controller handling network operations and mutations. */
  networkController = new NetworkController(this)

  // -> DATA SET ---------------------------------------------------------------

  /**
   * Active dataset.
   */
  get dataSet(): DataSet {
    return this.dataSetProvider.value
  }
  set dataSet(value: DataSet) {
    this.dataSetProvider.setValue(value)
    this.requestUpdate("dataSet")
  }

  /**
   * Available datasets.
   */
  get availableDataSets(): DataSet[] {
    return this.availableDataSetsProvider.value
  }
  set availableDataSets(value: DataSet[]) {
    this.availableDataSetsProvider.setValue(value)
    this.requestUpdate("availableDataSets")
  }

  /** @internal Controller for dataset loading/validation and selection. */
  dataSetController = new DataSetController(this)

  // -> MODEL ------------------------------------------------------------------

  /**
   * Training options.
   */
  get trainOptions(): TrainOptions {
    return this.trainOptionsProvider.value
  }
  set trainOptions(value: TrainOptions) {
    this.trainOptionsProvider.setValue(value)
    this.requestUpdate("trainOptions")
  }

  /**
   * Model configuration.
   */
  get modelConf(): ModelConf {
    return this.modelConfProvider.value
  }
  set modelConf(value: ModelConf) {
    this.modelConfProvider.setValue(value)
    this.requestUpdate("modelConf")
  }

  /** @internal Container reference for displaying training metrics. */
  trainMetricsContainer: HTMLDivElement
  /** @internal Controller for model lifecycle and training orchestration. */
  modelController = new ModelController(this)

  // -> SELECTED ---------------------------------------------------------------

  /**
   * Current selection state.
   */
  get selected(): Selected {
    return this.selectedProvider.value
  }
  set selected(value: Selected) {
    this.selectedProvider.setValue(value)
    this.requestUpdate("selected")
  }

  /**
   * Currently selected element.
   */
  get selectedEle(): SelectedEle {
    return this.selectedEleProvider.value
  }
  set selectedEle(value: SelectedEle) {
    this.selectedEleProvider.setValue(value)
    this.requestUpdate("selectedEle")
  }

  /** @internal Controller handling selection logic and events. */
  selectionController = new SelectionController(this)

  // -> PANELS -----------------------------------------------------------------

  /**
   * Whether the right panel is shown.
   */
  get panel(): boolean {
    return this.panelProvider.value
  }
  set panel(value: boolean) {
    this.panelProvider.setValue(value)
    this.requestUpdate("panel")
  }

  /** @internal Controller for panel state and interactions. */
  panelController = new PanelController(this)

  // -> THEME ------------------------------------------------------------------

  /**
   * Active theme object.
   */
  get theme(): Theme {
    return this.themeProvider.value
  }
  set theme(value: Theme) {
    this.themeProvider.setValue(value)
    this.requestUpdate("theme")
  }

  /** @internal Controller for theme switching and persistence. */
  themeController = new ThemeController(this)

  // STYLES --------------------------------------------------------------------

  /**
   * Styles for the host layout, canvas/menu areas, divider, and theme switch.
   */
  static styles: CSSResult[] = [
    globalStyles,
    css`
      :host {
        display: flex!important;
        flex-direction: row;
        overflow: hidden;
        background-color: var(--sl-color-neutral-0);
        height: 100%;
      }

      :host.embedded {
        /* min-height: 400px;
        height: 100%; */
        display: flex!important;
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
        width: calc(100% - 435px);
        height: 100%;
      }

      canvas-area.right-collapsed {
        width: 100%;
      }

      menu-area {
        width: 100%;
      }

      menu-area.right-collapsed {
        width: 0;
      }

      #divider {
        position: absolute;
        right: 435px;
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

  // RENDER --------------------------------------------------------------------

  /**
   * Rendering
   * 
   * @returns An array of TemplateResult parts composing the UI.
   */
  render(): TemplateResult<1>[] {
    const renderedHTML: TemplateResult<1>[] = []
    /* renderedHTML.push(html`<div class="sl-toast-stack"></div>`) */

    renderedHTML.push(
      html`<style>
        ${(this.theme as any).styles}
        :host{
          border-width: 2px;
          border-style: solid;
          border-radius: 5px;
          border-color: #6a6a6a;
        }
      </style>`
    )
    renderedHTML.push(html` <canvas-area
      class="${!this.panel ? 'right-collapsed' : ''}"
      @click=${()=>{this.dispatchEvent(new Event("focus"))}}
      @canvas-created="${(e: CustomEvent<CCanvas>) => {
        this.canvas = e.detail
      }}"
      .fullscreen=${this.isFullscreen}
      @toggle-fullscreen="${this._onFullscreenToggle}"
    >
    </canvas-area>`)
    if ((this.setupStatus as any).loading) {
      renderedHTML.push(html`
        <div id="loadingPage">
          <div id="loadingDiv">
            <h1>${msg("Loading")}</h1>
            <sl-spinner style="font-size: 3rem;"></sl-spinner>
          </div>
        </div>
      `)
    } else {
      renderedHTML.push(html`
        <div id="divider" class="${!this.panel ? 'hidden' : ''}"></div>

        <menu-area
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