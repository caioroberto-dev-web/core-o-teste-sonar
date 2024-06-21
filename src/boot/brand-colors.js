import { setCssVar } from 'quasar'
import { boot } from 'quasar/wrappers'

export default boot(() => {
  setCssVar('primary', '#009949')
  setCssVar('secondary', '#0168b4')
  setCssVar('positive', '#009949')
  setCssVar('negative', '#ed1b24')
  setCssVar('accent', '#ededed')
  setCssVar('info', 'yellow')
  setCssVar('warning', 'orange')
})
