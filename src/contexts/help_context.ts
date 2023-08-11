import { createContext } from '@lit-labs/context'
import { spawnAlert } from '@/utils/alerts'
import type { WwDeepLearning } from '@/app'

// layer/neuron/edge represent the cyId of the element, ele the actual element
// (which will be added later after first render as selected)
export interface HelpEntry {
  title: string
  description: string
}

export const helpContext = createContext<HelpEntry[]>('help')

export const defaultHelp = [
  {
    title: 'Why are some important options not editable or completely missing?',
    description:
      'Many options or uneditable after you started a training to make sure what you see is actually what got translated into the real machine learning model. To be able to edit everything again, just use the option to reset the model. After you performed your desired changes, you can then train a new model that respects them. If there is no trained model and you are missing options, most likely the distributor of this widget has disabled them for you.',
  },
]

export function addNewHelpEntry(helpEntry: HelpEntry) {
  if (
    !(<WwDeepLearning>this).help.some((entry) => entry.title == helpEntry.title)
  ) {
    ;(<WwDeepLearning>this).help.push(helpEntry)
    ;(<WwDeepLearning>this).help = [...(<WwDeepLearning>this).help]
  } else {
    spawnAlert({
      message: `The help entry could not be created. Another entry with the same name already exists!`,
      variant: 'danger',
      icon: 'x-circle',
    })
  }
}

export function removeHelpEntry(title: string) {
  const index = (<WwDeepLearning>this).help.findIndex(
    (entry) => entry.title == title
  )
  ;(<WwDeepLearning>this).help.splice(index, 1)
  ;(<WwDeepLearning>this).help = [...(<WwDeepLearning>this).help]
}

export function updateHelpEntry(helpEntry: HelpEntry) {
  console.log('update help entry')
  const index = (<WwDeepLearning>this).help.findIndex(
    (entry) => entry.title == helpEntry.title
  )
  ;(<WwDeepLearning>this).help[index].description = helpEntry.description
  ;(<WwDeepLearning>this).help = [...(<WwDeepLearning>this).help]
  spawnAlert({
    message: 'Help entry updated successfull',
    variant: 'success',
    icon: 'check-circle',
  })
}
