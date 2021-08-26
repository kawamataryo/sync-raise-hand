import * as handTrack from 'handtrackjs'
import { getRaiseHandButton } from '~/contentScripts/src/utils'

let model: any = null
let timerID: any = null
let videoEl: HTMLVideoElement | null = null
let isRaiseHand = false

const OPTIONS = {
  flipHorizontal: false,
  outputStride: 16,
  imageScaleFactor: 1,
  iouThreshold: 0.2,
  scoreThreshold: 0.8,
  modelType: 'ssd320fpnlite',
  modelSize: 'large',
}

const RAISE_BUTTON_RAISED_CLASS = 'raise-hand-button--raised'
const RAISE_BUTTON_CLASS = 'raise-hand-button'

export const initialize = async() => {
  model = await handTrack.load(OPTIONS)
  videoEl = document.createElement('video')
}

const toggleRiseHandButton = (predictions: { label: string }[]) => {
  const raiseHandButton = getRaiseHandButton()
  raiseHandButton?.closest('span')?.classList.add(RAISE_BUTTON_CLASS)

  if (predictions.some((p: any) => p.label === 'open')) {
    if (!isRaiseHand) {
      isRaiseHand = true
      raiseHandButton?.closest('span')?.classList.add(RAISE_BUTTON_RAISED_CLASS)
      raiseHandButton?.click()
    }
  }
  else {
    if (isRaiseHand) {
      isRaiseHand = false
      raiseHandButton?.closest('span')?.classList.remove(RAISE_BUTTON_RAISED_CLASS)
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
