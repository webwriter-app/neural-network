import type { SetupStatus } from '@/types/setup_status'

export class SetupUtils {
  static defaultSetupStatus: SetupStatus = {
    canvasCompleted: false,
    loading: true,
  }
}
