import { RAISE_HAND_ICON_SELECTOR } from './constants'

// Google's html class name is about to change, so I'm referring to the button from icon.
export const getRaiseHandButton = () => document.querySelector<HTMLElement>(RAISE_HAND_ICON_SELECTOR)?.closest('button')
