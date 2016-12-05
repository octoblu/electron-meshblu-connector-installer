/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import React from 'react';
import { render } from 'enzyme';
import ErrorState from '../../app/components/error-state';


describe('ErrorState component', () => {
  it('should be able to render', () => {
    const sut = render(<ErrorState message="cheese burger" />)
    expect(sut.find('.ErrorState--message').text()).to.equal('cheese burger')
  });
});
