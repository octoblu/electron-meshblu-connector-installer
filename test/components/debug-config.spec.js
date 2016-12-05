/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import React from 'react';
import { render } from 'enzyme';
import DebugConfig from '../../app/components/debug-config';


describe('DebugConfig component', () => {
  it('should be able to render', () => {
    const sut = render(<DebugConfig config={{}} />)
    expect(sut.find('.DebugConfig').text()).to.exist
  });
});
