import { createContext } from '@lit-labs/context'
import type { ModelConf } from '@/types/model_conf'

export const modelConfContext = createContext<ModelConf>('model-conf')
