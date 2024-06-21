import { api } from 'boot/axios'

const getAllGenres = async () => {
  const { data } = await api.get('/genres')
  return data
}

export {
  getAllGenres
}
