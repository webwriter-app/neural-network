import { createContext } from '@lit/context'
import type { SelectedEle } from '@/types/selected_ele'

export const selectedEleContext = createContext<SelectedEle>('selected-ele')
