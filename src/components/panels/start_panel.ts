import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { consume } from '@lit/context'

import { editableContext } from '@/contexts/editable_context'
import type { Settings } from '@/types/settings'
import { settingsContext } from '@/contexts/settings_context'
import type { ModelConf } from '@/types/model_conf'
import { modelConfContext } from '@/contexts/model_conf_context'

import { CPanel } from '../reusables/c-panel'
import { CoreModelFeaturesUnavailableCard } from '@/components/cards/core_model_features_unavailable_card'
import { StartExportCard } from '@/components/cards/start_export_card'
import { GetStartedCard } from '@/components/cards/start_get_started_card'
import { HelpKeyboardShortcutsCard } from '../cards/help_keyboard_shortcuts_card'

export class StartPanel extends LitElementWw {

  static scopedElements = {
    "c-panel": CPanel,
    "core-model-features-unavailable-card": CoreModelFeaturesUnavailableCard,
    "start-export-card": StartExportCard,
    "start-get-started-card": GetStartedCard,
    "help-keyboard-shortcuts-card": HelpKeyboardShortcutsCard
  }

  @consume({ context: editableContext, subscribe: true })
  accessor editable: boolean

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
