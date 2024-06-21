import { api } from 'boot/axios'

const getProfessionalByUser = async () => {
  const { data } = await api.get('/professionals/me')
  return data
}

const putProfessionalByUser = async (professional) => {
  const { data } = await api.put('/professionals/me', professional)
  return data
}

export {
  getProfessionalByUser,
  putProfessionalByUser
}
