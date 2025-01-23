import { atom } from 'jotai'

export type Step = 'INPUT' | 'TRANSCRIBE'

export const stepAtom = atom<Step>('INPUT')
