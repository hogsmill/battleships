
import { v4 as uuidv4 } from 'uuid'

const LocalStorage = {

  check: function() {
    let check
    const uuid = uuidv4()
    try {
      localStorage.setItem('agile-simulations-test', uuid)
      if (localStorage.getItem('agile-simulations-test') == uuid) {
        check = 'ok'
      }
      localStorage.removeItem('agile-simulations-test')
    }
    catch(e) {
      check = e
    }
    return check
  },

  clear: function(suffix) {
    const items = [
      'gameName',
      'myName'
    ]
    for (let i = 0; i < items.length; i++) {
      const key = items[i] + '-' + suffix
      localStorage.removeItem(key)
    }
    location.reload()
  }

}

export default LocalStorage
