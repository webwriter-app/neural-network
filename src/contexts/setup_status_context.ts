import { createContext } from '@lit-labs/context'
import type { WwDeepLearning } from '@/app'

export interface SetupStatus {
  canvasCompleted: boolean
  loading: boolean
}

export const setupStatusContext = createContext<SetupStatus>('setup-status')

export const defaultSetupStatus: SetupStatus = {
  canvasCompleted: false,
  loading: true,
}

export function setupCompleted(name: string): void {
  ;(<WwDeepLearning>this).setupStatus[`${name}Completed`] = true
  ;(<WwDeepLearning>this).setupStatus = {
    ...(<WwDeepLearning>this).setupStatus,
  }
  ;(<WwDeepLearning>this).checkLoading()
}

export function checkLoading(): void {
  if (
    !Object.values((<WwDeepLearning>this).setupStatus).some(
      (value) => value == false
    )
  ) {
    ;(<WwDeepLearning>this).setupStatus.loading = false
    ;(<WwDeepLearning>this).setupStatus = {
      ...(<WwDeepLearning>this).setupStatus,
    }
  }
}
