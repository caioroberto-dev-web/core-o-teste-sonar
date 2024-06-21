import { api } from 'boot/axios'

const getTypes = async () => {
  const { data } = await api.get('/types')
  return data
}

const getProfessionalElements = async () => {
  const { data } = await api.get('/elements')
  return data
}

const getElementTypes = async () => {
  const { data } = await api.get('/elements/types')
  return data
}

const postElement = async (elementTypeId) => {
  const { data } = await api.post('/elements', { elementTypeId })
  return data
}

const getElementById = async (id) => {
  const { data } = await api.get(`/elements/${id}`)
  return data
}

const putElementById = async (element) => {
  const { data } = await api.put(`/elements/${element.id}`, element)
  return data
}

const deleteElementById = async (id) => {
  const { data } = await api.delete(`/elements/${id}`)
  return data
}

export {
  getTypes,
  getProfessionalElements,
  getElementTypes,
  postElement,
  getElementById,
  putElementById,
  deleteElementById
}
