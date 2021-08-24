import i18next from 'i18next'
import { initialize, startTracking, stopTracking } from './handtrack'
import { getCallEndButton } from '~/contentScripts/src/utils'
import { initializeI18n } from '~/contentScripts/src/i18n'

const CONTROLLER_ELEMENT_ID = 'sync-raise-a-hand__controller'
const SWITCH_ELEMENT_WRAPPER_ID = 'sync-raise-a-hand__controller__switch-wrapper'
const INPUT_ELEMENT_ID = 'sync-raise-a-hand__controller__switch-input'
const SWITCH_ELEMENT_ID = 'sync-raise-a-hand__controller__switch'

const createElements = () => {
  document.body.insertAdjacentHTML('beforeend', `
  <div id=${CONTROLLER_ELEMENT_ID} draggable="true">
    <div>
      ${i18next.t('controllerMessage')} ✋
    </div>
    <div id=${SWITCH_ELEMENT_WRAPPER_ID}>
      <label id=${SWITCH_ELEMENT_ID}>
        <input type="checkbox" id=${INPUT_ELEMENT_ID}>
        <span></span>
      </label>
    </div>
  </div>
  `)
}

const setCheckedEvent = () => {
  const controllerInput = document.querySelector<HTMLInputElement>(`#${INPUT_ELEMENT_ID}`)
  if (controllerInput) {
    controllerInput.addEventListener('change', async(event) => {
      if ((event as any).target.checked)
        await startTracking()
      else
        await stopTracking()
    })
  }
}

const setDragEvent = () => {
  const controllerWrapperEl = document.querySelector<HTMLDivElement>(`#${CONTROLLER_ELEMENT_ID}`)
  if (controllerWrapperEl) {
    controllerWrapperEl.ondragstart = () => {
      return false
    }

    const moveAt = (pageX: number, pageY: number) => {
      controllerWrapperEl!.style.left = `${pageX - controllerWrapperEl!.offsetWidth / 2}px`
      controllerWrapperEl!.style.top = `${pageY - controllerWrapperEl!.offsetHeight / 2}px`
    }

    const onMouseMove = (event: MouseEvent) => {
      moveAt(event.pageX, event.pageY)
    }

    controllerWrapperEl.onmousedown = (event) => {
      moveAt(event.pageX, event.pageY)

      document.addEventListener('mousemove', onMouseMove)

      controllerWrapperEl.onmouseup = () => {
        document.removeEventListener('mousemove', onMouseMove)
        controllerWrapperEl.onmouseup = null
      }
    }
  }

  const inputWrapperEl = document.querySelector<HTMLDivElement>(`#${SWITCH_ELEMENT_WRAPPER_ID}`)
  if (inputWrapperEl) {
    inputWrapperEl.onmousedown = (event: Event) => {
      event.stopPropagation()
      event.preventDefault()
    }
    inputWrapperEl.ondragstart = (event: Event) => {
      event.stopPropagation()
      event.preventDefault()
    }
  }
}

const setHideControllerEvent = () => {
  const callEndButtonEl = getCallEndButton()
  if (callEndButtonEl) {
    callEndButtonEl.addEventListener('click', () => {
      document.querySelector(`#${CONTROLLER_ELEMENT_ID}`)?.setAttribute('style', 'display: none')
    })
  }
}

export const createController = async() => {
  await initialize()
  await initializeI18n()
  createElements()
  setCheckedEvent()
  setDragEvent()
  setHideControllerEvent()
}
