const expect = require('chai').expect;

const _ = require('../../src/utils/helpers');

describe('_.uniqTemplates', () => {
  describe('when array contain duplicates templates', () => {
    it('should return an array duplicates-free with the correct order', () => {
      const templates = [
        {
          getInfo() {
            return { type: 'oc-template-x', version: 2 };
          }
        },
        {
          getInfo() {
            return { type: 'oc-template-x', version: 1 };
          }
        },
        {
          getInfo() {
            return { type: 'oc-template-x', version: 3 };
          }
        },
        {
          getInfo() {
            return { type: 'oc-template-x', version: 4 };
          }
        },
        {
          getInfo() {
            return { type: 'oc-template-y', version: 10 };
          }
        }
      ];
      const uniqTemplates = _.uniqTemplates(templates);
      expect(uniqTemplates.length).to.equal(2);
      expect(uniqTemplates[0].getInfo()).to.deep.equal({
        type: 'oc-template-x',
        version: 2
      });
      expect(uniqTemplates[1].getInfo()).to.deep.equal({
        type: 'oc-template-y',
        version: 10
      });
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
