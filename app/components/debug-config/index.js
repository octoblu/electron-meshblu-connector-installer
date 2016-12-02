import React, { PropTypes } from 'react'
import _ from 'lodash'
import './index.css'

const DebugConfig = ({ config }) => {
  function convertObject(obj, prefix) {
    return _.map(obj, (value, key) => {
      if (key === 'coreDependencies') return null
      if (_.isPlainObject(value)) {
        return convertObject(value, `${prefix}${key}.`)
      }
      let valueStr = value
      if (_.isBoolean(valueStr)) {
        valueStr = valueStr ? 'true' : 'false'
      }
      const theKey = `${prefix}${key}`
      return <li key={theKey}><span className="DebugConfig--key">{theKey}</span>: {valueStr}</li>
    })
  }
  const items = convertObject(config, '')
  return (<div className="DebugConfig">
    <h3>Installer Information:</h3>
    <ul className="DebugConfig--list">
      {items}
    </ul>
  </div>)
}

DebugConfig.propTypes = {
  config: PropTypes.object.isRequired,
}

export default DebugConfig
