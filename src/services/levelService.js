import { api } from 'boot/axios'

const getAllLevels = async () => {
  const { data } = await api.get('/levels')
  const { levels } = data
  return levels
}

export { getAllLevels }
