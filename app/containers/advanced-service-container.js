import _ from "lodash"
import React, { Component } from "react"
import AdvancedService from "../components/advanced-service"
import PageLayout from "./page-layout"

export default class AdvancedServiceContainer extends Component {
  render() {
    const otpKey = _.get(this.props, "location.query.otpKey")
    const errorMessage = _.get(this.props, "location.query.errorMessage")
    return (
      <PageLayout>
        <AdvancedService otpKey={otpKey} errorMessage={errorMessage} />
      </PageLayout>
    )
  }
}
