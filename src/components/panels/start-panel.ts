import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html } from 'lit'
import { consume } from '@lit/context'

import { editableContext } from '../contexts'
import type { Settings } from '../../model/app-types'
import { settingsContext } from '../contexts'
import type { ModelConf } from '../../model/network-types'
import { modelConfContext } from '../contexts'

import { CPanel } from '../reusables/c-panel'
import { CoreModelFeaturesUnavailableCard } from '../cards/core-model-features-unavailable-card'
import { StartExportCard } from '../cards/start-export-card'
import { GetStartedCard } from '../cards/start-get-started-card'
import { HelpKeyboardShortcutsCard } from '../cards/help-keyboard-shortcuts-card'

export class StartPanel extends LitElementWw {

  static scopedElements = {
    "c-panel": CPanel,
    "core-model-features-unavailable-card": CoreModelFeaturesUnavailableCard,
    "start-export-card": StartExportCard,
    "start-get-started-card": GetStartedCard,
    "help-keyboard-shortcuts-card": HelpKeyboardShortcutsCard
  }

  @consume({ context: editableContext, subscribe: true })
  accessor editable: boolean = false

  @consume({ context: settingsContext, subscribe: true })
  accessor settings: Settings

  @consume({ context: modelConfContext, subscribe: true })
  accessor modelConf: ModelConf

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-panel name="start">
        ${this.modelConf.model && (this.editable || this.settings.mayImport)
          ? html`<core-model-features-unavailable-card></core-model-features-unavailable-card>`
          : html``}
        ${!this.modelConf.model && (this.editable || this.settings.mayImport)
          ? html` <start-get-started-card></start-get-started-card> `
          : html``}
        ${this.editable || this.settings.mayExport
          ? html` <start-export-card></start-export-card> `
          : html``}
        <help-keyboard-shortcuts-card></help-keyboard-shortcuts-card>
      </c-panel>
    `
  }
}
