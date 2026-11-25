import type { MsgFn } from "@lit/localize";
import { localizer } from '@webwriter/lit/localize'
import { jsonData } from '@webwriter/lit/data'
import { sourceLocale, targetLocales } from "../../localization/generated/locale-codes.js";
import '../model/tf-quiet-load'

import { LitElementWw, computed, signal } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, PropertyDeclarations } from 'lit'
import { customElement } from 'lit/decorators.js'
import { ContextRoot } from '@lit/context'

import shoelaceLightStyles from '@shoelace-style/shoelace/dist/themes/light.styles.js'

import { globalStyles } from '../components/global-styles'
import { neuralNetworkStyles } from '../components/neural-network.styles'

import { ConfigurationController } from '../components/configuration-controller'

import type { SetupStatus, Settings, QAndAEntry, Selected, SelectedEle } from '../model/app-types'
import { setupStatusContext, editableContext, settingsContext, qAndAContext, canvasContext, networkContext, layerConfsContext, layerConnectionConfsContext, dataSetContext, availableDataSetsContext, trainOptionsContext, modelConfContext, selectedContext, selectedEleContext, panelContext } from '../components/contexts'
import { SetupController } from '../components/setup-controller'
import { SetupUtils } from '../model/setup-utils'

import { SettingsController } from '../components/settings-controller'
import { SettingsUtils } from '../model/settings-utils'

import { QAndAController } from '../components/q-and-a-controller'
import { QAndAUtils } from '../components/q-and-a-utils'

import type { CCanvas } from '../components/canvas'

import type { CLayerConf, CLayerConnectionConf, TrainOptions, ModelConf } from '../model/network-types'
import { CNetwork } from '../components/network/network'
import { NetworkController } from '../components/network/network-controller'

import type { DataSet } from '../model/data-types'
import { historyTable } from '../model/csv-data'
import type { Table } from '../model/csv-data'
import { DataSetController } from '../components/data-set-controller'
import { DataSetUtils } from '../components/data-sets/data-set-utils'

import { ModelController } from '../components/model-controller'
import { ModelUtils } from '../model/model-utils'

import { SelectionController } from '../components/selection-controller'

import { PanelController } from '../components/panel-controller'

import { CCanvasArea } from '../components/canvas-area'
import { MenuArea } from '../components/menu-area'
import { ContextProvider } from '@lit/context'

// the width below which the menu is below the canvas (see the styles)
const STACK_WIDTH = 640

type ConfigurationData = {
  settings: Settings
  qAndA: QAndAEntry[]
  layerConfs: CLayerConf[]
  layerConnectionConfs: CLayerConnectionConf[]
  dataSet: DataSet
  availableDataSets: DataSet[]
  trainOptions: TrainOptions
}

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
 * @prop {string} panel - Name of the open right panel, if any.
 *
 * @part canvas - The drawing area with the network.
 * @part menu - The side menu with the panels.
 *
 * ## Files
 *
 * Import: a `.csv` file becomes a new data set that is selected (a header row names the columns,
 * the last column is the label; labels 0 to k-1 make a classification data set, others a regression
 * data set) and a `.json` config file replaces the network and data sets. Export: `text/csv` writes the
 * active data set (class descriptions are not part of CSV); `application/json` writes the config
 * and, once trained, the weights and biases of each layer under `weights`. The import of a `.json`
 * file reads the config only and ignores `weights`, so a trained model is not restored.
 *
 * ## Signals
 *
 * - `history`: table of the training history, columns `epoch`, `loss`, `val_loss`, `acc`, `val_acc`
 *   (only the logged ones), one row per epoch. Empty before training.
 * - `loss`: number, the training loss of the last epoch, or null before training.
 *
 * The widget has no effects: nothing from another widget fits a network.
 *
 * @cssproperty --ww-text-color - Text color of the widget and the network labels.
 * @cssproperty --ww-font-family - Font family of the widget.
 * @cssproperty --ww-theme-accent-1 - Color of the layers, neurons and edges of the network.
 * @cssproperty --ww-theme-accent-2 - Color of the selected layer, neuron or edge.
 * @cssproperty --sl-color-neutral-0 - Host background color (forwarded from Shoelace).
 * @cssproperty --sl-color-neutral-50 - Divider color (forwarded from Shoelace).
 */
@customElement("webwriter-neural-network")
export class WebwriterNeuralNetwork extends LitElementWw {
  /** Styles for the host layout, canvas/menu areas and divider. */
  static styles: CSSResult[] = [
    shoelaceLightStyles,
    globalStyles,
    neuralNetworkStyles,
  ]

  /** Scoped element registry for child components used by this widget. */
  static scopedElements = {
    "canvas-area": CCanvasArea,
    "menu-area": MenuArea,
    "c-network": CNetwork
  }

  static convertFrom = { '.csv': 'importCsv', '.json': 'importJson' }
  static convertTo = { 'text/csv': 'exportCsv', 'application/json': 'exportJson' }

  static options = {
    editable: { type: Boolean, label: (widget: {msg: MsgFn}) => widget.msg("Allow editing") },
  }

  /** Declares reactive properties and attribute reflection. */
  static properties: PropertyDeclarations = {
    setupStatus: { attribute: false },
    editable: { attribute: true, type: Boolean, reflect: true },
    settings: { attribute: false },
    qAndA: { attribute: false },
    canvas: {attribute: false},
    network: {attribute: false},
    layerConfs: { attribute: false },
    layerConnectionConfs: { attribute: false },
    dataSet: { attribute: false },
    availableDataSets: { attribute: false },
    trainOptions: { attribute: false },
    modelConf: { attribute: false },
    selected: { attribute: false },
    selectedEle: { attribute: false },
    panel: { attribute: false }
  }

  protected localize = localizer(this, {
    sourceLocale,
    targetLocales,
    load: (locale) => import(`../../localization/generated/${locale}.ts`),
    drawer: true,
  })
  public readonly msg = this.localize.msg

  // The configuration lives in the widget's JSON data block, one key per entry.
  private restoringConfiguration = false
  #data = jsonData<ConfigurationData>(this, {
    defaults: {
      settings: structuredClone(SettingsUtils.defaultSettings),
      qAndA: [...QAndAUtils.defaultQAndA],
      layerConfs: [],
      layerConnectionConfs: [],
      dataSet: DataSetUtils.defaultDataSet,
      availableDataSets: DataSetUtils.defaultAvailableDataSets,
      trainOptions: structuredClone(ModelUtils.defaultTrainOptions),
    },
    changed: (saved) => this.restoreConfiguration(saved),
  })

  #history = signal<Table>(historyTable([]))
  #historySource: unknown

  /** Read-only signals for other widgets: the training history and its last loss. */
  signals = {
    history: computed(() => this.#history.get()),
    loss: computed(() => {
      const { columns, rows } = this.#history.get()
      const at = columns.indexOf('loss')
      return rows.length && at > 0 ? (rows[rows.length - 1][at] as number | null) : null
    }),
  }

  // CONTROLLERS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  /** @internal Global configuration controller for the widget. */
  private configurationController = new ConfigurationController(this)

  /** @internal Controller handling setup lifecycle and transitions. */
  private setupController = new SetupController(this)

  /** @internal Controller for reading/updating settings. */
  private settingsController = new SettingsController(this)

  /** @internal Controller for maintaining Q&A content. */
  private qAndAController = new QAndAController(this)

  /** @internal Controller handling network operations and mutations. */
  networkController = new NetworkController(this)

  /** @internal Controller for dataset loading/validation and selection. */
  private dataSetController = new DataSetController(this)

  /** @internal Controller for model lifecycle and training orchestration. */
  modelController = new ModelController(this)

  /** @internal Controller handling selection logic and events. */
  selectionController = new SelectionController(this)

  /** @internal Controller for panel state and interactions. */
  private panelController = new PanelController(this)

  // PROPERTIES - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  /** Setup status of the widget. */
  get setupStatus(): SetupStatus {
    return this.setupStatusProvider.value
  }
  set setupStatus(value: SetupStatus) {
    this.setupStatusProvider.setValue(value)
    this.requestUpdate("setupStatus")
  }
  /** Whether editing is enabled. */
  get editable(): boolean {
    return this.editableProvider.value
  }
  set editable(value: boolean) {
    this.editableProvider.setValue(value)
    this.requestUpdate("editable")
  }

  /** Application settings. */
  get settings(): Settings {
    return this.settingsProvider.value
  }
  set settings(value: Settings) {
    this.settingsProvider.setValue(value)
    this.persistConfiguration("settings", value)
    this.requestUpdate("settings")
  }
  /** Help/Q&A content. */
  get qAndA(): QAndAEntry[] {
    return this.qAndAProvider.value
  }
  set qAndA(value: QAndAEntry[]) {
    this.qAndAProvider.setValue(value)
    this.persistConfiguration("qAndA", value)
    this.requestUpdate("qAndA")
  }
  /** Canvas instance created by the canvas-area child component. */
  get canvas(): CCanvas | undefined {
    return this.canvasProvider.value
  }
  set canvas(value: CCanvas | undefined) {
    this.canvasProvider.setValue(value)
    this.requestUpdate("canvas")
  }

  /** Network instance used for neural network structure visualization. */
  get network(): CNetwork | undefined {
    return this.networkProvider.value
  }
  set network(value: CNetwork | undefined) {
    this.networkProvider.setValue(value)
    this.requestUpdate("network")
  }

  /** Layer configuration list. */
  get layerConfs(): CLayerConf[] {
    return this.layerConfsProvider.value
  }
  set layerConfs(value: CLayerConf[]) {
    this.layerConfsProvider.setValue(value)
    this.persistConfiguration("layerConfs", value)
    this.requestUpdate("layerConfs")
  }

  /** Layer connection configuration list between layers. */
  get layerConnectionConfs(): CLayerConnectionConf[] {
    return this.layerConnectionConfsProvider.value
  }
  set layerConnectionConfs(value: CLayerConnectionConf[]) {
    this.layerConnectionConfsProvider.setValue(value)
    this.persistConfiguration("layerConnectionConfs", value)
    this.requestUpdate("layerConnectionConfs")
  }

  /** Active dataset. */
  get dataSet(): DataSet {
    return this.dataSetProvider.value
  }
  set dataSet(value: DataSet) {
    this.dataSetProvider.setValue(value)
    this.persistConfiguration("dataSet", value)
    this.requestUpdate("dataSet")
  }

  /** Available datasets. */
  get availableDataSets(): DataSet[] {
    return this.availableDataSetsProvider.value
  }
  set availableDataSets(value: DataSet[]) {
    this.availableDataSetsProvider.setValue(value)
    this.persistConfiguration("availableDataSets", value)
    this.requestUpdate("availableDataSets")
  }

  /** Training options. */
  get trainOptions(): TrainOptions {
    return this.trainOptionsProvider.value
  }
  set trainOptions(value: TrainOptions) {
    this.trainOptionsProvider.setValue(value)
    this.persistConfiguration("trainOptions", value)
    this.requestUpdate("trainOptions")
  }

  /** Model configuration. */
  get modelConf(): ModelConf {
    return this.modelConfProvider.value
  }
  set modelConf(value: ModelConf) {
    this.modelConfProvider.setValue(value)
    // the model changes on every batch, the history only after an epoch
    // (the epochs are pushed into the same array, a restored model brings a new one)
    if (value.history !== this.#historySource || value.history.length !== this.#history.get().rows.length) {
      this.#historySource = value.history
      this.#history.set(historyTable(value.history))
    }
    this.requestUpdate("modelConf")
  }

  /** Current selection state. */
  get selected(): Selected {
    return this.selectedProvider.value
  }
  set selected(value: Selected) {
    this.selectedProvider.setValue(value)
    this.requestUpdate("selected")
  }

  /** Currently selected element. */
  get selectedEle(): SelectedEle | undefined {
    return this.selectedEleProvider.value
  }
  set selectedEle(value: SelectedEle | undefined) {
    this.selectedEleProvider.setValue(value)
    this.requestUpdate("selectedEle")
  }

  /** Name of the panel currently shown on the right, or undefined if none is open. */
  get panel(): string | undefined {
    return this.panelProvider.value
  }
  set panel(value: string | undefined) {
    this.panelProvider.setValue(value)
    this.requestUpdate("panel")
  }

  // INTERNAL STATE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  /** @internal Container reference for displaying training metrics. */
  trainMetricsContainer: HTMLDivElement

  protected setupStatusProvider: ContextProvider<typeof setupStatusContext, WebwriterNeuralNetwork>
  protected editableProvider: ContextProvider<typeof editableContext, WebwriterNeuralNetwork>
  protected settingsProvider: ContextProvider<typeof settingsContext, WebwriterNeuralNetwork>
  protected qAndAProvider: ContextProvider<typeof qAndAContext, WebwriterNeuralNetwork>
  protected canvasProvider: ContextProvider<typeof canvasContext, WebwriterNeuralNetwork>
  protected networkProvider: ContextProvider<typeof networkContext, WebwriterNeuralNetwork>
  protected layerConfsProvider: ContextProvider<typeof layerConfsContext, WebwriterNeuralNetwork>
  protected layerConnectionConfsProvider: ContextProvider<typeof layerConnectionConfsContext, WebwriterNeuralNetwork>
  protected dataSetProvider: ContextProvider<typeof dataSetContext, WebwriterNeuralNetwork>
  protected availableDataSetsProvider: ContextProvider<typeof availableDataSetsContext, WebwriterNeuralNetwork>
  protected trainOptionsProvider: ContextProvider<typeof trainOptionsContext, WebwriterNeuralNetwork>
  protected modelConfProvider: ContextProvider<typeof modelConfContext, WebwriterNeuralNetwork>
  protected selectedProvider: ContextProvider<typeof selectedContext, WebwriterNeuralNetwork>
  protected selectedEleProvider: ContextProvider<typeof selectedEleContext, WebwriterNeuralNetwork>
  protected panelProvider: ContextProvider<typeof panelContext, WebwriterNeuralNetwork>

  /** @internal Lets context consumers outside the component tree reach the providers. */
  private contextRoot?: ContextRoot

  /** @internal Observes the host's size so we can detect fullscreen changes. */
  private resizeObserver?: ResizeObserver

  /** @internal Last observed fullscreen state, used to detect changes from the ResizeObserver. */
  private wasFullscreen = false

  /** @internal Whether the menu was below the canvas at the last observed size. */
  private wasStacked = false

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

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
  }

  /**
   * Lit lifecycle hook. Attaches a ContextRoot to the document body to enable
   * using context outside the component tree when necessary.
   * @internal
   */
  connectedCallback(): void {
    super.connectedCallback()
    this.contextRoot = new ContextRoot()
    this.contextRoot.attach(document.body)

    this.wasFullscreen = this.isFullscreen
    this.wasStacked = this.clientWidth < STACK_WIDTH
    this.resizeObserver = new ResizeObserver(() => {
      // the canvas changes its shape when the menu moves below it
      const stacked = this.clientWidth < STACK_WIDTH
      if (stacked !== this.wasStacked) {
        this.wasStacked = stacked
        requestAnimationFrame(() => this.canvas?.fit())
      }
      const isFullscreen = this.isFullscreen
      if (isFullscreen !== this.wasFullscreen) {
        this.wasFullscreen = isFullscreen
        this.requestUpdate()
      }
    })
    this.resizeObserver.observe(this)
    void this.useDataSet(this.dataSet)
  }

  /**
   * Lit lifecycle hook. Disconnects the fullscreen resize observer.
   * @internal
   */
  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.resizeObserver?.disconnect()
    this.contextRoot?.detach(document.body)
  }

  // FILES - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  importCsv(file: File) { return this.configurationController.prepareCsvFile(file) }
  importJson(file: File) { return this.configurationController.prepareConfigFile(file) }
  exportCsv() { return this.configurationController.exportCsvFile() }
  exportJson() { return this.configurationController.exportModelFile() }

  // ACTIONS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  private persistConfiguration<K extends keyof ConfigurationData>(key: K, value: ConfigurationData[K]) {
    if (this.restoringConfiguration || !this.isConnected) return
    // the block keeps its own copy, because the widget changes its arrays in place
    this.#data.set({[key]: JSON.parse(JSON.stringify(value))})
  }

  /**
   * Makes a data set the active one after loading the rows of a built-in
   * data set. The rows are not written to the data block.
   * @internal
   */
  async useDataSet(dataSet: DataSet): Promise<void> {
    const loaded = await DataSetUtils.loadData(dataSet)
    if (loaded === dataSet && loaded === this.dataSet) return
    this.restoringConfiguration = loaded !== dataSet
    try {
      if (loaded !== dataSet) {
        this.availableDataSets = this.availableDataSets.map((entry) => (entry === dataSet ? loaded : entry))
      }
      this.dataSet = loaded
    } finally {
      this.restoringConfiguration = false
    }
  }

  private restoreConfiguration(saved: ConfigurationData) {
    this.restoringConfiguration = true
    try {
      this.settings = structuredClone(saved.settings)
      this.qAndA = structuredClone(saved.qAndA)
      this.layerConfs = structuredClone(saved.layerConfs)
      this.layerConnectionConfs = structuredClone(saved.layerConnectionConfs)
      this.dataSet = structuredClone(saved.dataSet)
      this.availableDataSets = structuredClone(saved.availableDataSets)
      this.trainOptions = structuredClone(saved.trainOptions)
    } finally {
      this.restoringConfiguration = false
    }
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
      this.wasFullscreen = false
      this.requestUpdate()
    } else {
      try {
          await this.requestFullscreen();
          this.wasFullscreen = true
          this.requestUpdate()
      } catch (error) {
          console.error(this.msg("Failed to enter fullscreen mode."));
      }
    }
  }

  // RENDER --------------------------------------------------------------------

  /**
   * Rendering
   * 
   * @returns An array of TemplateResult parts composing the UI.
   */
  render(): TemplateResult<1>[] {
    const renderedHTML: TemplateResult<1>[] = []
    renderedHTML.push(html` <canvas-area
      part="canvas"
      class="${!this.panel ? 'right-collapsed' : ''}"
      @click=${()=>{this.dispatchEvent(new Event("focus"))}}
      @canvas-created="${(e: CustomEvent<CCanvas>) => {
        this.canvas = e.detail
      }}"
      .fullscreen=${this.isFullscreen}
      @toggle-fullscreen="${this._onFullscreenToggle}"
    >
    </canvas-area>`)
    if (this.setupStatus.loading) {
      renderedHTML.push(html`
        <div id="loadingPage">
          <div id="loadingDiv">
            <h1>${this.msg("Loading")}</h1>
            <sl-spinner style="font-size: 3rem;"></sl-spinner>
          </div>
        </div>
      `)
    } else {
      renderedHTML.push(html`
        <div id="divider" class="${!this.panel ? 'hidden' : ''}"></div>

        <menu-area
          part="menu"
          class="${!this.panel ? 'right-collapsed' : ''}"
          @set-train-metrics-container="${(e: CustomEvent<HTMLDivElement>) =>
            this.modelController.setTrainMetricsContainer(e.detail)}"
        ></menu-area>

        <c-network @tensor-confs-updated=${() => this.canvas?.requestUpdate()}></c-network>
      `)
    }
    return [html`<div id="shell">${renderedHTML}</div>`]
  }
}
