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
