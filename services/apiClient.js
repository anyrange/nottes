let client

export const setClient = (newclient) => {
  client = newclient
}

const reqMethods = ['request', 'delete', 'head', 'options', 'get', 'post', 'put', 'patch']

const service = {}

reqMethods.forEach((method) => {
  service[method] = function () {
    if (!client) throw new Error('apiClient not installed')
    return client[method].apply(null, arguments)
  }
})

export default service
