import { createStore } from 'jotai'

type Store = ReturnType<typeof createStore>

// @ts-ignore
export const store: Store = createStore()
