import React from 'react';
import { browserHistory, Route, Router, IndexRoute } from 'react-router';
import AppLayout from '../containers/app-layout';
import InputKey from '../containers/input-key';
import ServiceContainer from '../containers/service-container';
import Installer from '../containers/installer';
import NoMatch from '../components/no-match';
import GetOTPKey from '../services/get-otp-key'

const checkIfPrivileged = (callback) => {
  const { platform } = process
  callback(null, false)
}

const platformHome = (nextState, replace, callback) => {
  const { platform } = process
  const { otpKey } = nextState.location.query
  let pathname
  checkIfPrivileged((error, admin) => {
    if (error) return callback(error)
    if (admin) {
      if (platform === 'darwin') pathname = '/service/darwin/service'
      if (platform === 'win32') pathname = '/service/win32/service'
      if (platform === 'linux') pathname = '/service/linux/service'
    } else {
      if (platform === 'darwin') pathname = '/service/darwin/user-service'
      if (platform === 'win32') pathname = '/service/win32/user-login'
      if (platform === 'linux') pathname = '/service/linux/user-service'
    }
    replace({
      pathname,
      query: {otpKey},
    })
    callback()
  })
}

const needOTP = (nextState, replace, callback) => {
  new GetOTPKey().getKey((error, response) => {
    const { otpKey } = response
    if (otpKey) {
      replace({
        pathname: '/service-types',
        query: {otpKey},
      })
    } else {
      replace('/input-key')
    }
    callback()
  })
}

export default (
  <Route path="/" component={AppLayout} >
    <IndexRoute onEnter={needOTP} />
    <Route path="input-key" component={InputKey} />
    <Route path="install" component={Installer} />
    <Route path="service-types" onEnter={platformHome} />
    <Route path="service/:platform/:serviceType" component={ServiceContainer} />
    <Route path="*" status={404} component={NoMatch} />
  </Route>
);
