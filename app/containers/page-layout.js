import _ from 'lodash'
import React, { PropTypes, Component } from 'react'
import DeviceIcon from 'zooid-device-icon'
import ErrorState from 'zooid-error-state'
import {
  Spinner,
  Page,
  PageHeader,
  PageTitle,
} from 'zooid-ui'

import '../styles/page-layout.css'

const propTypes = {
  title: PropTypes.string,
  type: PropTypes.string,
}

const defaultProps = {
  actions: null,
}

class PageLayout extends Component {
  getIcon() {
    const { type } = this.props
    if (!type) return null
    return <DeviceIcon className="ConnectorIcon PageLayout--Icon" type={type} />
  }

  getTitle() {
    const { title } = this.props
    if (!title) return null
    return <PageTitle>{title}</PageTitle>
  }

  renderPage(content) {
    return (
      <div>
        <Page className="PageLayout">
          <PageHeader>
            {this.getIcon()}
            {this.getTitle()}
          </PageHeader>
          {content}
        </Page>
      </div>
    )
  }

  render() {
    const { children, fetchingCount, error } = this.props

    if (fetchingCount > 0) {
      return this.renderPage(<div className="PageLayout--Loading"><Spinner size="large" /></div>)
    }

    if (error) {
      const message = _.isString(error) ? error : error.message
      return this.renderPage(<ErrorState title={message} />)
    }

    if (!children) {
      return this.renderPage(<div />)
    }

    return this.renderPage(children)
  }
}

PageLayout.propTypes = propTypes
PageLayout.defaultProps = defaultProps

export default PageLayout
