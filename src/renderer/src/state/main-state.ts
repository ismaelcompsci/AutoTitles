import { atom } from 'jotai'

export type Step = 'INPUT' | 'PROCESS' | 'PREVIEW'

export const stepAtom = atom<Step>('INPUT')
