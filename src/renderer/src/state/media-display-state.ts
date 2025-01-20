import { atom } from 'jotai'

export const playingAtom = atom(false)
export const currentTimeAtom = atom(0)
export const activeRegionIdAtom = atom<string | null>(null)
