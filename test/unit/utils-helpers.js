const expect = require('chai').expect;

const _ = require('../../src/utils/helpers');

describe('_.uniq', () => {
  describe('when array contain duplicates', () => {
    it('should return an array duplicates-free', () => {
      expect(_.uniq([1, 1, 'a', 3, 4, 5, 5, 6, 'b', 'a'])).to.deep.equal([
        '1',
        '3',
        '4',
        '5',
        '6',
        'a',
        'b'
      ]);
    });
  });
});

describe('_.pick', () => {
  describe('when an object contain values that do not match a predicate', () => {
    it('should return an new object only containing the matching values', () => {
      expect(
        _.pick({ a: 'something', b: null, c: undefined, d: NaN }, Boolean)
      ).to.deep.equal({ a: 'something' });
    });
  });
});
