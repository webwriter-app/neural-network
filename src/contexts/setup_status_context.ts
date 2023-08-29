import { createContext } from '@lit-labs/context'
import type { SetupStatus } from '@/types/setup_status'

export const setupStatusContext = createContext<SetupStatus>('setup-status')
