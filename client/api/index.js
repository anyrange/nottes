import api from '@/services/apiClient'

export const checkAuth = () => {
  return api.get('/auth/check')
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

export const getUserProfile = () => {
  return api.get('/profile')
}

export const changeProfilePassword = ({ password, prevPassword }) => {
  return api.post('/profile/password', { password, prevPassword })
}

export const changeProfileEmail = ({ password, email }) => {
  return api.post('/profile/email', { password, email })
}

export const changeProfileUsername = (username) => {
  return api.post('/profile/username', { username })
}

export const getUserPage = (username) => {
  return api.get(`/users/${username}`)
}

export const getRecentPastes = ({ range }) => {
  return api.get('/pastes/recent', {
    range,
  })
}

export const getUserRecentPastes = ({ range }) => {
  return api.get('/pastes/me', {
    params: {
      range,
    },
  })
}

export const createPaste = (paste) => {
  return api.post('/pastes', paste)
}

export const forkPaste = (id) => {
  return api.post(`/pastes/${id}`)
}

export const editPaste = ({ id, paste }) => {
  return api.put(`/pastes/${id}`, paste)
}

export const deletePaste = (id) => {
  return api.delete(`/pastes/${id}`)
}

export const getPaste = ({ id, password = '' }) => {
  return api.get(`/pastes/${id}`, {
    params: {
      password,
    },
  })
}

export const getArchive = ({ page, range, search, sort }) => {
  return api.get('/pastes', {
    params: {
      page,
      range,
      search,
      sort,
    },
  })
}

export const getUserPastes = (username, { page, range, search, sort }) => {
  return api.get(`/users/${username}/pastes`, {
    params: {
      page,
      range,
      search,
      sort,
    },
  })
}
