'use strict';

const expect = require('chai').expect;
const injectr = require('injectr');

describe('client : sanitiser', () => {
  const sanitiser = injectr(
    '../../src/sanitiser.js',
    {
      '../package': {
        version: '1.2.3'
      }
    },
    {
      process: {
        version: 'v0.10.40',
        platform: 'darwin',
        arch: 'x64'
      }
    }
  );

  describe('when sanitising global rendering options', () => {
    describe('when user-agent not already set', () => {
      const config = sanitiser.sanitiseConfiguration();
      const result = sanitiser.sanitiseGlobalRenderOptions({}, config);

      it('should set oc-client user-agent', () => {
        expect(result.headers.templates).to.deep.equal({
          'oc-template-handlebars': require('oc-template-handlebars').getInfo()
            .version,
          'oc-template-jade': require('oc-template-jade').getInfo().version
        });
        expect(result.headers['user-agent']).to.equal(
          'oc-client-1.2.3/v0.10.40-darwin-x64'
        );
      });
    });
  });
});
