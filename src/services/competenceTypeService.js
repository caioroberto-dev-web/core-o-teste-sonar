import { api } from 'boot/axios'

const getAllCompetenceType = async () => {
  const { data } = await api.get('/competences/types')
  const { competenceTypes } = data
  return competenceTypes
}

export {
  getAllCompetenceType
}
