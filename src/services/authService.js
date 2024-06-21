import { api } from 'boot/axios'

const registerUser = async (user) => {
  const { data } = await api.post('/register', user)
  return data
}

const loginUser = async (user) => {
  const { data } = await api.post('/login', user)
  return data
}

export {
  registerUser,
  loginUser
}
