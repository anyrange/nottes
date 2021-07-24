import api from '@/services/apiClient'

let pastes = []

const RECONNECTION_DELAY = 1000

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

export const getPaste = ({ id, password }) => {
  return api.get(`/pastes/${id}?password=${password}`)
}

export const getRecentPastes = () => {
  return pastes
}

const connectToWs = () => {
  const wsProtocol = window.location.protocol.includes('https') ? 'wss' : 'ws'
  const socket = new WebSocket(`${wsProtocol}://${window.location.host}/api/pastes/recent`)

  socket.onopen = (event) => {
    console.log('WebSocket is open now.', event)
  }

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data)
    switch (message.event) {
      case 'insert':
        pastes.unshift(message.paste)
        if (pastes.length > 10) pastes.pop()
        break
      case 'delete':
        pastes = pastes.filter((el) => el._id !== message.paste._id)
        break
      default:
        break
    }
  }

  socket.onerror = (err) => {
    console.error('Socket encountered error: ', err.message, 'Closing socket')
    socket.close()
  }

  socket.onclose = (event) => {
    setTimeout(() => {
      connectToWs()
    }, RECONNECTION_DELAY)
    console.log('WebSocket error observed:', event)
  }
}

if (!process.server) connectToWs()
