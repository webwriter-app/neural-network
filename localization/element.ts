import { LitElementWw as WebWriterElement } from '@webwriter/lit'
import { effectiveLanguage, nativeLanguageAttributes } from './localizer'

export class LitElementWw extends WebWriterElement {
  static override get observedAttributes() {
    return nativeLanguageAttributes(this, super.observedAttributes)
  }

  protected static override finalize() {
    super.finalize()
    this.elementProperties.set('lang', { attribute: false, noAccessor: true })
  }

  override get lang(): string {
    return effectiveLanguage(this)
  }

  override set lang(value: string) {
    this.setAttribute('lang', value)
  }
}
