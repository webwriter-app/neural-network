import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import type { Settings } from '@/types/settings'
import { settingsContext } from '@/contexts/settings_context'
import { SettingsUtils } from '@/utils/settings_utils'

@customElement('settings-card')
export class SettingsCard extends LitElementWw {
  @consume({ context: settingsContext, subscribe: true })
  settings: Settings

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  resetSettings() {
    this.dispatchEvent(
      new CustomEvent<Settings>('set-settings', {
        detail: <Settings>(
          JSON.parse(JSON.stringify(SettingsUtils.defaultSettings))
        ),
        composed: true,
        bubbles: true,
      })
    )
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult = globalStyles

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Settings</div>
        <div slot="content">
          <p>
            Configure which options the users of this widget are allowed to view
            and edit
          </p>

          <div class="button-group">
            <sl-button @click="${(_e: MouseEvent) => this.resetSettings()}">
              <sl-icon name="arrow-counterclockwise" label="Reset"></sl-icon>
              Set to default
            </sl-button>
          </div>

          <h2>Start</h2>
          <c-setting
            name="mayImport"
            description="Allow importing configurations"
          >
            <c-setting
              name="showDefaultConfs"
              description="Show recommendations"
            >
            </c-setting>
          </c-setting>
          <c-setting
            name="mayExport"
            description="Allow exporting configurations"
          >
          </c-setting>

          <h2>Network</h2>
          Restrict layer types
          <c-setting name="allowDenseLayers" description="Allow dense layers">
          </c-setting>
          Editing
          <c-setting
            name="mayAddAndRemoveLayers"
            description="Allow adding and removing layers"
          >
          </c-setting>
          <c-setting name="mayEditLayers" description="Allow editing layers">
            <c-setting
              name="maySelectDataOnInputLayer"
              description="Allow selecting the data flowing into input layers"
            >
            </c-setting>
            <c-setting
              name="mayChangeNeurons"
              description="Allow editing the number of neurons"
            >
            </c-setting>
            <c-setting
              name="mayChangeActivationFunction"
              description="Allow changing the activation function"
            >
            </c-setting>
          </c-setting>
          <c-setting
            name="mayChangeLayerConnections"
            description="Allow reconnecting the layers with each other"
          >
          </c-setting>

          <h2>Data set</h2>
          <c-setting
            name="maySelectDataSet"
            description="Allow selecting a different data set"
          >
            <c-setting
              name="mayManageDataSets"
              description="Allow managing (creating new and deleting) data sets"
            >
            </c-setting>
          </c-setting>
          <c-setting name="showPlots" description="Show plots"></c-setting>
          <h2>Training</h2>
          <c-setting
            name="mayEditHyperparameters"
            description="Allow editing hyperparameters"
          >
            <c-setting
              name="mayEditBatchSize"
              description="Allow editing the batch size"
            >
            </c-setting>
            <c-setting
              name="mayEditLearningRate"
              description="Allow editing the learning rate"
            >
            </c-setting>
            <c-setting
              name="mayEditDropoutRate"
              description="Allow editing the dropout rate"
            >
            </c-setting>
          </c-setting>
        </div>
      </c-card>
    `
  }
}
