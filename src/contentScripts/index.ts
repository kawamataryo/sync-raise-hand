/* eslint-disable no-console */
import { CHANGE_TRACK_STATUS, CHECK_TRACK_STATUS } from '~/utils/constants'
import { initialize, startTracking, stopTracking } from '~/contentScripts/handtrack'
import './index.css'

let isTracking = false

chrome.runtime.onMessage.addListener(async(request: Record<string, any>, _sender: unknown, sendResponse: (arg: any) => void) => {
  if (request.type === CHECK_TRACK_STATUS) {
    console.log('check track status')
    sendResponse(isTracking)
  }
  if (request.type === CHANGE_TRACK_STATUS) {
    console.log(`change status to ${request.value}`)
    isTracking = request.value
    if (isTracking)
      await startTracking()
    else
      await stopTracking()
  }
})

initialize()
