import React, { Component } from 'react'
import {
  Page,
  PageHeader,
} from 'zooid-ui'

import '../styles/page-layout.css'

class PageLayout extends Component {
  render() {
    return (
      <Page className="PageLayout">
        <PageHeader />
        {this.props.children}
      </Page>
    )
  }
}

export default PageLayout
