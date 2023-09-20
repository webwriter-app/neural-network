import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, css } from 'lit'
import { customElement, property /* , query */, state } from 'lit/decorators.js'
import { provide } from '@lit-labs/context'

import '@/imports'

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
import type { CNetwork } from '@/components/network/network'
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

import '@/components/network/network'
import '@/components/canvas_area'
import '@/components/menu_area'
import '@/components/theme_switch'

@customElement('ww-deep-learning')
export class WwDeepLearning extends LitElementWw {
  // DATA PROVIDERS AND CONTROLLERS  - - - - - - - - - - - - - - - - - - - - - -
  configurationController = new ConfigurationController(this)

  // -> SETUP STATUS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  @provide({ context: setupStatusContext })
  @property({ attribute: false })
  setupStatus: SetupStatus = SetupUtils.defaultSetupStatus

  setupController = new SetupController(this)

  // -> EDITABLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  @provide({ context: editableContext })
  @property({ attribute: true, type: Boolean, reflect: true })
  editable: boolean = false

  // -> SETTINGS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  @provide({ context: settingsContext })
  @property({ attribute: true, type: Object, reflect: true })
  settings: Settings = <Settings>(
    JSON.parse(JSON.stringify(SettingsUtils.defaultSettings))
  )

  settingsController = new SettingsController(this)

  // -> HELP - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  @provide({ context: qAndAContext })
  @property({ attribute: true, type: Object, reflect: true })
  qAndA: QAndAEntry[] = [...QAndAUtils.defaultQAndA]

  qAndAController = new QAndAController(this)

  // -> CANVAS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  @provide({ context: canvasContext })
  @property({ attribute: false })
  canvas: CCanvas

  // -> NETWORK  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  @provide({ context: networkContext })
  @property({ attribute: false })
  network: CNetwork

  @provide({ context: layerConfsContext })
  @property({ attribute: true, type: Array, reflect: true })
  layerConfs: CLayerConf[] = []

  @provide({ context: layerConnectionConfsContext })
  @property({ attribute: true, type: Array, reflect: true })
  layerConnectionConfs: CLayerConnectionConf[] = []

  networkController = new NetworkController(this)

  // -> DATA SET - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  @provide({ context: dataSetContext })
  @property({ attribute: true, type: Object, reflect: true })
  dataSet: DataSet = DataSetUtils.defaultDataSet

  @provide({ context: availableDataSetsContext })
  @property({ attribute: true, type: Array, reflect: true })
  availableDataSets: DataSet[] = DataSetUtils.defaultAvailableDataSets

  dataSetController = new DataSetController(this)

  // -> MODEL  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  @provide({ context: trainOptionsContext })
  @property({ attribute: true, type: Object, reflect: true })
  trainOptions: TrainOptions = <TrainOptions>(
    JSON.parse(JSON.stringify(ModelUtils.defaultTrainOptions))
  )

  // HTML container where metrics like accuracy and loss are plotted into
  @state()
  trainMetricsContainer: HTMLDivElement

  @provide({ context: modelConfContext })
  @property({ attribute: false })
  modelConf: ModelConf = <ModelConf>(
    JSON.parse(JSON.stringify(ModelUtils.defaultModelConf))
  )

  modelController = new ModelController(this)

  // -> SELECTED - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  @provide({ context: selectedContext })
  @property({ attribute: false })
  selected: Selected = {}

  selectionController = new SelectionController(this)

  @provide({ context: selectedEleContext })
  @property({ attribute: false })
  selectedEle: SelectedEle

  // -> PANELS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  @provide({ context: panelContext })
  @property({ attribute: false })
  panel: string

  panelController = new PanelController(this)

  // -> ALERTS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  /* @query('.sl-toast-stack')
  _alertStack

  alertController = new AlertController(this) */

  // -> THEME  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  @provide({ context: themeContext })
  @property({ attribute: false })
  theme: Theme = ThemeUtils.lightTheme

  themeController = new ThemeController(this)

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = [
    globalStyles,
    css`
      :host {
        height: 100vh;
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
        ${this.theme.styles}
      </style>`
    )
    renderedHTML.push(html` <canvas-area
      class="${!this.panel ? 'right-collapsed' : ''}"
      @canvas-created="${(e: CustomEvent<CCanvas>) => {
        this.canvas = e.detail
      }}"
    >
    </canvas-area>`)
    if (this.setupStatus.loading) {
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
          part="action"
          class="${!this.panel ? 'right-collapsed' : ''}"
          @set-train-metrics-container="${(e: CustomEvent<HTMLDivElement>) =>
            this.modelController.setTrainMetricsContainer(e.detail)}"
        ></menu-area>

        <c-network></c-network>
      `)
    }
    renderedHTML.push(html`<theme-switch></theme-switch>`)
    return renderedHTML
  }
}
