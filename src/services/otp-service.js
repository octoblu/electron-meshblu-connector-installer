import request from 'request';

const OTP_SERVICE_URL = 'https://meshblu-otp.octoblu.com';

export function exchange({ key }, callback) {
  request({
    baseUrl: OTP_SERVICE_URL,
    uri: `/exchange/${key}`,
    json: true
  }, (error, response, body) => {
    if (error) return callback(error);
    if (response.statusCode !== 200) return callback(new Error(body.error));
    callback(null, body);
  });
}

export function fakeExchange({ key }, callback) {
  callback(null, {
    uuid: 'c7097087-bed4-4272-8692-3b07277ec281',
    token: 'a7702204e157e51fd63c924a7b77db00121a0d5d',
    metadata: {
      legacy: true,
      connector: 'shell',
      tag: 'v3.0.10',
    }
  });
}
