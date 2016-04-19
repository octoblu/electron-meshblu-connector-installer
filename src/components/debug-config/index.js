import React, { PropTypes } from 'react';
import _ from 'lodash';
import './index.css';

const DebugConfig = ({ config }) => {
  function convertObject(obj, prefix) {
    return _.map(obj, (value, key) => {
      if(_.isPlainObject(value)) {
        return convertObject(value, `${prefix}${key}.`);
      }
      const theKey = `${prefix}${key}`
      return <li key={theKey}><span className="DebugConfig--key">{theKey}</span>: {value}</li>
    });
  }
  const items = convertObject(config, '');
  return <div className="DebugConfig">
    {items}
  </div>
};

DebugConfig.propTypes = {
  config: PropTypes.object.isRequired
}

export default DebugConfig
