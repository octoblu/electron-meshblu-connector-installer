import request from 'request'

const OTP_SERVICE_URL = 'https://meshblu-otp.octoblu.com'

export function retrieveOTP({ otpKey }, callback) {
  request({
    baseUrl: OTP_SERVICE_URL,
    uri: `/retrieve/${otpKey}`,
    json: true,
  }, (error, response, body) => {
    if (error) return callback(error)
    if (response.statusCode !== 200) return callback(new Error(body.error))
    callback(null, body)
  })
}
