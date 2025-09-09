import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { consume } from '@lit/context'

import { globalStyles } from '@/global_styles'

import type { Settings } from '@/types/settings'
import { settingsContext } from '@/contexts/settings_context'
import { SettingsUtils } from '@/utils/settings_utils'
import { CCard } from '../reusables/c-card'
import { CSetting } from '../reusables/c-setting'

import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon.component.js'
import SlButton from '@shoelace-style/shoelace/dist/components/button/button.component.js'
import IconArrowCounterclockwise from 'bootstrap-icons/icons/arrow-counterclockwise.svg'
import { msg } from '@lit/localize'

export class SettingsCard extends LitElementWw {
  static scopedElements = {
    'c-card': CCard,
    'c-setting': CSetting,
    'sl-button': SlButton,
    'sl-icon': SlIcon,
  }

  @consume({ context: settingsContext, subscribe: true })
  accessor settings: Settings

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  resetSettings() {
    this.dispatchEvent(
      new CustomEvent<Settings>('set-settings', {
        detail: <Settings>(
          JSON.parse(JSON.stringify(SettingsUtils.defaultSettings))
        ),
        composed: true,
        bubbles: true,
      }),
    )
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult = globalStyles

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">${msg('Settings')}</div>
        <div slot="content">
          <p>
            ${msg(
              'Configure which options the users of this widget are allowed to view and edit',
            )}
          </p>

          <div class="button-group">
            <sl-button @click="${(_e: MouseEvent) => this.resetSettings()}">
              <sl-icon src=${IconArrowCounterclockwise} label=${msg('Reset')}></sl-icon>
              ${msg('Set to default')}
            </sl-button>
          </div>

          <h2>Start</h2>
          <c-setting
            name="mayImport"
            description=${msg('Allow importing configurations')}
          >
            <c-setting
              name="showDefaultConfs"
              description=${msg('Show recommendations')}
            >
            </c-setting>
          </c-setting>
          <c-setting
            name="mayExport"
            description=${msg('Allow exporting configurations')}
          >
          </c-setting>

          <h2>${msg('Network')}</h2>
          ${msg('Restrict layer types')}
          <c-setting
            name="allowDenseLayers"
            description=${msg('Allow dense layers')}
          >
          </c-setting>
          ${msg('Editing')}
          <c-setting
            name="mayAddAndRemoveLayers"
            description=${msg('Allow adding and removing layers')}
          >
          </c-setting>
          <c-setting
            name="mayEditLayers"
            description=${msg('Allow editing layers')}
          >
            <c-setting
              name="maySelectDataOnInputLayer"
              description=${msg(
                'Allow selecting the data flowing into input layers',
              )}
            >
            </c-setting>
            <c-setting
              name="mayChangeNeurons"
              description=${msg('Allow editing the number of neurons')}
            >
            </c-setting>
            <c-setting
              name="mayChangeActivationFunction"
              description=${msg('Allow changing the activation function')}
            >
            </c-setting>
          </c-setting>
          <c-setting
            name="mayChangeLayerConnections"
            description=${msg('Allow reconnecting the layers with each other')}
          >
          </c-setting>

          <h2>${msg('Data set')}</h2>
          <c-setting
            name="maySelectDataSet"
            description=${msg('Allow selecting a different data set')}
          >
            <c-setting
              name="mayManageDataSets"
              description=${msg(
                'Allow managing (creating new and deleting) data sets',
              )}
            >
            </c-setting>
          </c-setting>
          <c-setting
            name="showPlots"
            description=${msg('Show plots')}
          ></c-setting>
          <h2>${msg('Training')}</h2>
          <c-setting
            name="mayEditHyperparameters"
            description=${msg('Allow editing hyperparameters')}
          >
            <c-setting
              name="mayEditBatchSize"
              description=${msg('Allow editing the batch size')}
            >
            </c-setting>
            <c-setting
              name="mayEditLearningRate"
              description=${msg('Allow editing the learning rate')}
            >
            </c-setting>
            <c-setting
              name="mayEditDropoutRate"
              description=${msg('Allow editing the dropout rate')}
            >
            </c-setting>
          </c-setting>
        </div>
      </c-card>
    `
  }
}
