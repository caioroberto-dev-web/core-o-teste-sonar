import { api } from 'boot/axios'

export default function useApi (url) {
  const post = async (form) => {
    try {
      const { data } = await api.post(url, form)
      return data
    } catch (error) {
      throw new Error(error)
    }
  }

  const update = async (form) => {
    try {
      const { data } = await api.put(`${url}/${form.id}`, form)
      return data
    } catch (error) {
      throw new Error(error)
    }
  }

  const remove = async (id) => {
    try {
      const { data } = await api.delete(`${url}/${id}`)
      return data
    } catch (error) {
      throw new Error(error)
    }
  }

  const getById = async (id) => {
    try {
      const { data } = await api.get(`${url}/${id}`)
      return data
    } catch (error) {
      throw new Error(error)
    }
  }

  const getAll = async () => {
    try {
      const data = await api.get(`${url}`)
      return data
    } catch (error) {
      throw new Error(error)
    }
  }

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
    post,
    update,
    remove,
    getById,
    postCompetencias,
    getCompetenciasById,
    getAll,
    getProfessionalProfile
  }
}
