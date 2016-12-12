import _ from 'lodash'
import React, { PropTypes, Component } from 'react'
import ReactDOM from 'react-dom'
import './index.css'

class DebugLines extends Component {
  static propTypes = {
    lines: PropTypes.array.isRequired,
  }

  updateScroll = () => {
    const { thing } = this.refs
    ReactDOM.findDOMNode(thing).scrollTop = thing.scrollHeight
  }

  render() {
    let { lines } = this.props
    lines = _.sortBy(lines, 'timestamp')
    lines = _.map(lines, ({ line, timestamp, isError }, key) => {
      if (isError) {
        return <li className="DebugLines--error" key={key}>- {line}</li>
      }
      return <li className="DebugLines--debug" key={key}>- {line}</li>
    })

    _.delay(() => {
      this.updateScroll()
    }, 50)

    return (
      <div className="DebugLines">
        <h3>Console:</h3>
        <div ref="thing" className="DebugLines--console">
          <ul>
            {lines}
          </ul>
        </div>
      </div>
    )
  }
}

export default DebugLines
