import { widgetMsg } from '@webwriter/lit/localize'
import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html } from 'lit'
import { consume } from '@lit/context'

import { globalStyles } from '../global-styles'

import { editableContext } from '../contexts'
import type { Settings } from '../../model/app-types'
import { settingsContext } from '../contexts'
import { CCard } from '../reusables/c-card'

import SlTag from '@shoelace-style/shoelace/dist/components/tag/tag.component.js'

export class HelpKeyboardShortcutsCard extends LitElementWw {
  private readonly msg = widgetMsg(this);
  static scopedElements = {
    'c-card': CCard,
    'sl-tag': SlTag,
  }

  @consume({ context: editableContext, subscribe: true })
  accessor editable: boolean = false

  @consume({ context: settingsContext, subscribe: true })
  accessor settings: Settings

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles = globalStyles

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">${this.msg('Keyboard shortcuts')}</div>
        <div slot="content">
          <h2>${this.msg('Layer')}</h2>
          ${this.editable || this.settings.mayAddAndRemoveLayers
            ? html`<div class="tag-group">
                <sl-tag pill variant="primary">CTRL + SHIFT + BACKSPACE</sl-tag
                >${this.msg('Deletes the currently selected layer')}
              </div>`
            : html``}
          ${this.editable || this.settings.mayAddAndRemoveLayers
            ? html`<div class="tag-group">
                <sl-tag pill variant="primary">CTRL + SHIFT + K</sl-tag>${this.msg(
                  'Duplicates the currently selected layer',
                )}
              </div>`
            : html``}
          <div class="tag-group">
            <sl-tag pill variant="primary">CTRL + SHIFT + ARROW</sl-tag>${this.msg(
              'Moves the currently selected layer',
            )}
          </div>
        </div>
      </c-card>
    `
  }
}
