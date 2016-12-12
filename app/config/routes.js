/* eslint-disable no-console */
import _ from 'lodash'
import React from 'react'
import { Route, IndexRoute } from 'react-router'
import AppLayout from '../containers/app-layout'
import InputKey from '../containers/input-key'
import ServiceContainer from '../containers/service-container'
import Installer from '../containers/installer'
import NoMatch from '../components/no-match'
import GetOTPKey from '../services/get-otp-key'

const needOTP = (nextState, replace, callback) => {
  let otpKey = _.get(nextState, 'otpKey', _.get(nextState, 'location.query.otpKey'))
  if (_.startsWith(_.get(nextState, 'location.hash'), '#/input-key')) {
    replace({
      pathname: '/input-key',
      query: { otpKey }
    })
    callback()
    return
  }
  if (otpKey) {
    return callback()
  }
  new GetOTPKey().getKey((error, response) => {
    if (error) {
      console.error('Get OTP error in routes.js', error)
    }
    otpKey = _.get(response, 'otpKey')
    if (otpKey) {
      console.log('found otp', otpKey)
      replace({
        pathname: '/service-types',
        query: { otpKey },
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
    <Route path="service-types" component={ServiceContainer} />
    <Route path="*" status={404} component={NoMatch} />
  </Route>
)
