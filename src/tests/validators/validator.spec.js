import { expect } from 'chai';
import Validator from '../../validators/pagination.validator';

describe('pageMetaData', () => {
  it('covers default case', () => {
    const result = Validator.validator({}, {}, () => {})('fakeRoute');
    expect(result).to.deep.equals([]);
  });
});
