import { initialize, startTracking, stopTracking } from './handtrack'

export const createController = async() => {
  await initialize()

  document.body.insertAdjacentHTML('beforeend', `
  <div id="sync-raise-a-hand__controller" draggable="true" clickable="true">
    <div class="sync-raise-a-hand__controller__label">
      Sync raise a hand ✋
    </div>
    <div class="sync-raise-a-hand__controller__switch-wrapper">
      <label class="sync-raise-a-hand__controller__switch">
        <input type="checkbox" id="sync-raise-a-hand__controller__switch-input" clickable="true">
        <span></span>
      </label>
    </div>
  </div>
  `)

  const controllerInput = document.querySelector<HTMLInputElement>('#sync-raise-a-hand__controller__switch-input')
  if (controllerInput) {
    controllerInput.addEventListener('change', async(event) => {
      if ((event as any).target.checked)
        await startTracking()
      else
        await stopTracking()
    })
  }

  const inputWrapperEl = document.querySelector<HTMLDivElement>('.sync-raise-a-hand__controller__switch-wrapper')
  if (inputWrapperEl) {
    inputWrapperEl.onmousedown = (event: any) => {
      event.stopPropagation()
      event.preventDefault()
    }
    inputWrapperEl.ondragstart = (event: any) => {
      event.stopPropagation()
      event.preventDefault()
    }
  }

  const controllerWrapperEl = document.querySelector<HTMLDivElement>('#sync-raise-a-hand__controller')
  if (controllerWrapperEl) {
    controllerWrapperEl.ondragstart = () => {
      return false
    }

    controllerWrapperEl.onmousedown = (event) => {
      moveAt(event.pageX, event.pageY)

      function moveAt(pageX: any, pageY: any) {
        controllerWrapperEl!.style.left = `${pageX - controllerWrapperEl!.offsetWidth / 2}px`
        controllerWrapperEl!.style.top = `${pageY - controllerWrapperEl!.offsetHeight / 2}px`
      }

      function onMouseMove(event: any) {
        moveAt(event.pageX, event.pageY)
      }

      document.addEventListener('mousemove', onMouseMove)

      controllerWrapperEl.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove)
        controllerWrapperEl.onmouseup = null
      }
    }
  }
}
