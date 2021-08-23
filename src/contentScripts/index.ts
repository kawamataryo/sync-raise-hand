import './index.css'
import { createController } from './src/createController'
import { getRaiseHandButton } from '~/contentScripts/src/utils'

const main = () => {
  const checkTimer = setInterval(jsLoaded, 300)

  function jsLoaded() {
    if (getRaiseHandButton()) {
      clearInterval(checkTimer)
      createController()
    }
  }
}

window.addEventListener('load', main, false)
