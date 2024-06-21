import { ref } from 'vue'
import { Notify } from 'quasar'

export function validationHelper () {
  const errors = ref([])

  const getValidationErrorMessages = (field) => {
    if (!errors.value) {
      return []
    }
    const keys = Object.keys(errors.value)
    const key = keys.find(element => element.toLowerCase() === field.toLowerCase())
    if (errors.value[key]) {
      return errors.value[key]
    }
    return []
  }

  const getValidationErrors = (field) => {
    const errors = getValidationErrorMessages(field)
    if (errors.length !== 0) {
      return errors.join('\r\n')
    }
    return ''
  }

  const hasValidationErrors = (field) => {
    if (getValidationErrorMessages(field).length !== 0) {
      return true
    }
    return false
  }

  const setValidationErrors = (payload) => {
    errors.value = payload
  }

  const showValidationError = () => {
    Notify.create({
      type: 'negative',
      message: 'Falha na validação',
      caption: 'Por favor verifique os campos.'
    })
  }

  return {
    showValidationError,
    setValidationErrors,
    getValidationErrors,
    hasValidationErrors
  }
}
