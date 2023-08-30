// The QAndAUtils class provides the static default configuration for the Q&A
// property of the app
export class QAndAUtils {
  static defaultQAndA = [
    {
      title:
        'Why are some important options not editable or completely missing?',
      description:
        'Many options or uneditable after you started a training to make sure what you see is actually what got translated into the real machine learning model. To be able to edit everything again, just use the option to reset the model. After you performed your desired changes, you can then train a new model that respects them. If there is no trained model and you are missing options, most likely the distributor of this widget has disabled them for you.',
    },
  ]
}
