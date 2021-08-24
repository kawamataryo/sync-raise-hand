import { CALL_END_ICON_INNER_TEXT, RAISE_HAND_ICON_SELECTOR } from './constants'

// Google's html class name is about to change, so I'm referring to the button from icon.
export const getRaiseHandButton = () => document.querySelector<HTMLElement>(RAISE_HAND_ICON_SELECTOR)?.closest('button')

export const getCallEndButton = () => {
  const icons = document.querySelectorAll<HTMLElement>('i')
  const filteredIcons = Array.from(icons).filter((icon) => {
    return icon?.innerHTML === CALL_END_ICON_INNER_TEXT
  })
  return filteredIcons.length ? filteredIcons[0] : null
}
