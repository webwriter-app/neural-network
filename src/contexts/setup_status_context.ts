import { createContext } from '@lit/context'
import type { SetupStatus } from '@/types/setup_status'

export const setupStatusContext = createContext<SetupStatus>('setup-status')
