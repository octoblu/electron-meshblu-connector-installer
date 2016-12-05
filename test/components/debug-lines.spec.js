/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import React from 'react';
import { render } from 'enzyme';
import DebugLines from '../../app/components/debug-lines';


describe('DebugLines component', () => {
  it('should be able to render', () => {
    const sut = render(<DebugLines lines={[]} />)
    expect(sut.find('.DebugLines')).to.exist
  });
});
