import { api } from 'boot/axios'

const getAllCompetence = async () => {
  const { data } = await api.get('/competences')
  const { competences } = data
  return competences
}

const postCompetence = async (competence) => {
  const { data } = await api.post('/competences', competence)
  return data
}

const putCompetence = async (id, competence) => {
  const { data } = await api.put(`/competences/${id}`, competence)
  return data
}

const getCompetenceById = async (id) => {
  const { data } = await api.get(`/competences/${id}`)
  return data
}

const DeleteCompetenceById = async (id) => {
  await api.delete(`/competences/${id}`)
}

export {
  getAllCompetence,
  postCompetence,
  putCompetence,
  getCompetenceById,
  DeleteCompetenceById
}
