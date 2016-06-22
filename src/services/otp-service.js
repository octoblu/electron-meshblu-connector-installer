import request from 'request';

const OTP_SERVICE_URL = 'https://meshblu-otp.octoblu.com';

export function retrieveOTP({ key }, callback) {
  if (process.env.NODE_ENV === 'development') {
    fakeRetrieveOTP({ key }, callback);
    return;
  }
  request({
    baseUrl: OTP_SERVICE_URL,
    uri: `/retrieve/${key}`,
    json: true,
  }, (error, response, body) => {
    if (error) return callback(error);
    if (response.statusCode !== 200) return callback(new Error(body.error));
    callback(null, body);
  });
}

export function expireOTP({ key }, callback) {
  if (process.env.NODE_ENV === 'development') {
    fakeExpireOTP({ key }, callback);
    return;
  }
  request({
    baseUrl: OTP_SERVICE_URL,
    uri: `/expire/${key}`,
    json: true,
  }, (error, response, body) => {
    if (error) return callback(error);
    if (response.statusCode !== 200) return callback(new Error(body.error));
    callback();
  });
}

function fakeExpireOTP({ key }, callback) {
  callback()
}

function fakeRetrieveOTP({ key }, callback) {
  callback(null, {
    uuid: 'c7097087-bed4-4272-8692-3b07277ec281',
    token: 'a7702204e157e51fd63c924a7b77db00121a0d5d',
    metadata: {
      githubSlug: 'octoblu/meshblu-connector-say-hello',
      connectorAssemblerVersion: 'v13.0.0',
      dependencyManagerVersion: 'v3.0.2',
      ignitionVersion: 'v6.0.0',
      connector: 'say-hello',
      tag: 'v6.0.0',
    },
  });
}
