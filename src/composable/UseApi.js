import { api } from 'boot/axios'

export default function useApi (url) {
  const postCompetencias = async (form) => {
    try {
      const { data } = await api.post(url, form)
      return data
    } catch (error) {
      throw new Error(error)
    }
  }

  const getCompetenciasById = async () => {
    try {
      const { data } = await api.get(`${url}`)
      return data
    } catch (error) {
      throw new Error(error)
    }
  }

  const getProfessionalProfile = async () => {
    try {
      const { data } = await api.get('professionals/me')
      return data
    } catch (error) {
      throw new Error(error)
    }
  }

  return {
    postCompetencias,
    getCompetenciasById,
    getProfessionalProfile
  }
}
