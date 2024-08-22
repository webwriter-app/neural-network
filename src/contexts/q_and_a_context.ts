import { createContext } from '@lit/context'
import type { QAndAEntry } from '@/types/q_and_a_entry'

export const qAndAContext = createContext<QAndAEntry[]>('q-and-a')
