import './index.css'
import { createController } from './src/createController'
import { getRaiseHandButton } from '~/contentScripts/src/utils'

const main = async() => {
  const checkTimer = setInterval(jsLoaded, 100)

  async function jsLoaded() {
    if (getRaiseHandButton()) {
      clearInterval(checkTimer)
      try {
        await createController()
      }
      catch (e) {
        console.error(e)
      }
    }
  }
}

window.addEventListener('load', main, false)
