import * as handTrack from 'handtrackjs'
import { RAISE_HAND_ICON_SELECTOR } from '~/utils/constants'

let model: any = null
let timerID: any = null
let videoEl: HTMLVideoElement | null = null
let isRaiseHand = false

const OPTIONS = {
  flipHorizontal: false,
  outputStride: 16,
  imageScaleFactor: 1,
  iouThreshold: 0.2,
  scoreThreshold: 0.9,
  modelType: 'ssd320fpnlite',
  modelSize: 'large',
}

const raiseButtonRaisedClass = 'raise-hand-button--raised'
const raiseButtonClass = 'raise-hand-button'

export const initialize = async() => {
  model = await handTrack.load(OPTIONS)
  videoEl = document.createElement('video')
}

const toggleRiseHandButton = (predictions: { label: string }[]) => {
  // Google's html class name is about to change, so I'm referring to the button from icon.
  const raiseHandButton = document.querySelector<HTMLElement>(RAISE_HAND_ICON_SELECTOR)?.closest('button')
  raiseHandButton?.closest('span')?.classList.add(raiseButtonClass)

  if (predictions.some((p: any) => p.label === 'open')) {
    if (!isRaiseHand) {
      isRaiseHand = true
      raiseHandButton?.closest('span')?.classList.add(raiseButtonRaisedClass)
      raiseHandButton?.click()
    }
  }
  else {
    if (isRaiseHand) {
      isRaiseHand = false
      raiseHandButton?.closest('span')?.classList.remove(raiseButtonRaisedClass)
      raiseHandButton?.click()
    }
  }
}

export const startTracking = async() => {
  const status = await handTrack.startVideo(videoEl)
  timerID = setInterval(async() => {
    if (status) {
      const predictions = await model.detect(videoEl)
      toggleRiseHandButton(predictions)
    }
  }, 1000)
}

export const stopTracking = async() => {
  await handTrack.stopVideo(videoEl)
  clearInterval(timerID)
}
