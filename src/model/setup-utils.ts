import type { SetupStatus } from './app-types'

// The DataSetUtils class provides the static default setup status.
export class SetupUtils {
  static defaultSetupStatus: SetupStatus = {
    canvasCompleted: false,
    loading: true,
  }
}
