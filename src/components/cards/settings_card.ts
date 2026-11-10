import { effectiveLanguage, localizeElement, nativeLanguageAttributes } from "../../../localization/localizer";
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

export class SettingsCard extends LitElementWw {
  static override get observedAttributes() { return nativeLanguageAttributes(this, super.observedAttributes); }

  override get lang(): string { return effectiveLanguage(this); }
  override set lang(value: string) { this.setAttribute("lang", value); }
  private readonly msg = localizeElement(this);
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
        <div slot="title">${this.msg('Settings')}</div>
        <div slot="content">
          <p>
            ${this.msg(
              'Configure which options the users of this widget are allowed to view and edit',
            )}
          </p>

          <div class="button-group">
            <sl-button @click="${(_e: MouseEvent) => this.resetSettings()}">
              <sl-icon src=${IconArrowCounterclockwise} label=${this.msg('Reset')}></sl-icon>
              ${this.msg('Set to default')}
            </sl-button>
          </div>

          <h2>Start</h2>
          <c-setting
            name="mayImport"
            description=${this.msg('Allow importing configurations')}
          >
            <c-setting
              name="showDefaultConfs"
              description=${this.msg('Show recommendations')}
            >
            </c-setting>
          </c-setting>
          <c-setting
            name="mayExport"
            description=${this.msg('Allow exporting configurations')}
          >
          </c-setting>

          <h2>${this.msg('Network')}</h2>
          ${this.msg('Restrict layer types')}
          <c-setting
            name="allowDenseLayers"
            description=${this.msg('Allow dense layers')}
          >
          </c-setting>
          ${this.msg('Editing')}
          <c-setting
            name="mayAddAndRemoveLayers"
            description=${this.msg('Allow adding and removing layers')}
          >
          </c-setting>
          <c-setting
            name="mayEditLayers"
            description=${this.msg('Allow editing layers')}
          >
            <c-setting
              name="maySelectDataOnInputLayer"
              description=${this.msg(
                'Allow selecting the data flowing into input layers',
              )}
            >
            </c-setting>
            <c-setting
              name="mayChangeNeurons"
              description=${this.msg('Allow editing the number of neurons')}
            >
            </c-setting>
            <c-setting
              name="mayChangeActivationFunction"
              description=${this.msg('Allow changing the activation function')}
            >
            </c-setting>
          </c-setting>
          <c-setting
            name="mayChangeLayerConnections"
            description=${this.msg('Allow reconnecting the layers with each other')}
          >
          </c-setting>

          <h2>${this.msg('Data set')}</h2>
          <c-setting
            name="maySelectDataSet"
            description=${this.msg('Allow selecting a different data set')}
          >
            <c-setting
              name="mayManageDataSets"
              description=${this.msg(
                'Allow managing (creating new and deleting) data sets',
              )}
            >
            </c-setting>
          </c-setting>
          <c-setting
            name="showPlots"
            description=${this.msg('Show plots')}
          ></c-setting>
          <h2>${this.msg('Training')}</h2>
          <c-setting
            name="mayEditHyperparameters"
            description=${this.msg('Allow editing hyperparameters')}
          >
            <c-setting
              name="mayEditBatchSize"
              description=${this.msg('Allow editing the batch size')}
            >
            </c-setting>
            <c-setting
              name="mayEditLearningRate"
              description=${this.msg('Allow editing the learning rate')}
            >
            </c-setting>
            <c-setting
              name="mayEditDropoutRate"
              description=${this.msg('Allow editing the dropout rate')}
            >
            </c-setting>
          </c-setting>
        </div>
      </c-card>
    `
  }
}
