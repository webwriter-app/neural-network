import { effectiveLanguage, localizeElement, nativeLanguageAttributes } from "../../../localization/localizer";
import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { consume } from '@lit/context'

import { globalStyles } from '@/global_styles'

import { editableContext } from '@/contexts/editable_context'
import type { Settings } from '@/types/settings'
import { settingsContext } from '@/contexts/settings_context'
import { CCard } from '../reusables/c-card'

import SlTag from '@shoelace-style/shoelace/dist/components/tag/tag.component.js'

export class HelpKeyboardShortcutsCard extends LitElementWw {
  static override get observedAttributes() { return nativeLanguageAttributes(this, super.observedAttributes); }

  override get lang(): string { return effectiveLanguage(this); }
  override set lang(value: string) { this.setAttribute("lang", value); }
  private readonly msg = localizeElement(this);
  static scopedElements = {
    'c-card': CCard,
    'sl-tag': SlTag,
  }

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
