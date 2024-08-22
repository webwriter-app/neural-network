import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { consume } from '@lit/context'

import { globalStyles } from '@/global_styles'

import { editableContext } from '@/contexts/editable_context'
import type { Settings } from '@/types/settings'
import { settingsContext } from '@/contexts/settings_context'

export @customElement('help-keyboard-shortcuts-card') class HelpKeyboardShortcutsCard extends LitElementWw {
  @consume({ context: editableContext, subscribe: true })
  accessor editable: boolean

  @consume({ context: settingsContext, subscribe: true })
  accessor settings: Settings

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles = globalStyles

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Keyboard shortcuts</div>
        <div slot="content">
          <h2>Layer</h2>
          ${this.editable || this.settings.mayAddAndRemoveLayers
            ? html`<div class="tag-group">
                <sl-tag pill variant="primary">CTRL + SHIFT + BACKSPACE</sl-tag
                >Deletes the currently selected layer
              </div>`
            : html``}
          ${this.editable || this.settings.mayAddAndRemoveLayers
            ? html`<div class="tag-group">
                <sl-tag pill variant="primary">CTRL + SHIFT + K</sl-tag
                >Duplicates the currently selected layer
              </div>`
            : html``}
          <div class="tag-group">
            <sl-tag pill variant="primary">CTRL + SHIFT + ARROW</sl-tag>Moves
            the currently selected layer
          </div>
        </div>
      </c-card>
    `
  }
}
