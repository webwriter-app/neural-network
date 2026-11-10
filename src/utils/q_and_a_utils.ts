import type { MsgFn } from '@lit/localize'
import { sourceMsg as msg } from '../../localization/localizer'
import type { QAndAEntry } from '@/types/q_and_a_entry'

// The QAndAUtils class provides the static default configuration for the Q&A
// property of the app
export class QAndAUtils {
  static defaultQAndA = [
    {
      title: msg('Why are some important options not editable or completely missing?'),
      description: msg(
        'Many options are uneditable after you started a training to make sure what you see is actually what got translated into the model. To be able to edit everything again, just use the option to reset the model. After you performed your desired changes, you can then train a new model that respects them. If there is no trained model and you are missing options, most likely your teacher has disabled them for you.',
      ),
    },
  ]

  static localizeEntry(entry: QAndAEntry, msg: MsgFn): QAndAEntry {
    const [example] = this.defaultQAndA
    const translate = msg as (text: string) => string
    return {
      title: entry.title === example.title ? translate(example.title) : entry.title,
      description: entry.description === example.description ? translate(example.description) : entry.description,
    }
  }
}
