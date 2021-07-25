import api from '@/services/apiClient'

export const checkAuth = () => {
  return api.get('/users/me')
}

export const refreshToken = () => {
  return api.get('/auth/refreshToken')
}

export const login = (credentials) => {
  return api.post('/auth/login', credentials)
}

export const signup = (credentials) => {
  return api.post('/auth/signup', credentials)
}

export const logout = () => {
  return api.delete('/auth/logout')
}

export const createPaste = (paste) => {
  return api.post('/pastes', paste)
}

export const deletePaste = (id) => {
  return api.delete(`/pastes/${id}`)
}

export const getPaste = ({ id, password }) => {
  return api.get(`/pastes/${id}?password=${password || ''}`)
}
