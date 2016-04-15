import request from 'request'

const OTP_SERVICE_URL="https://meshblu-otp.octoblu.com"

export function exchange({key}, callback) {
  request({
    baseUrl: OTP_SERVICE_URL,
    uri: `/exchange/${key}`,
    json: true
  }, (error, response, body) => {
    if(error) return callback(error)
    if(response.statusCode != 200) return callback(new Error(body.error))
    callback(null, body)
  })
}

export function fakeExchange({key}, callback) {
  callback(null, {
    uuid: 'c044b376-4bfe-4d7b-8221-69f89e3ccfc1',
    token: '63cce0015a8308cf74e9eab02aeb275918adbd90',
    metadata: {
      legacy: false,
      connector: 'bean',
      dependency_manager: 'v1.0.2',
      connector_installer: 'v5.0.1',
      node: 'v5.5.0'
    }
  })
}
