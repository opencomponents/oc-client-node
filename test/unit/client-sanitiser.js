'use strict';

const expect = require('chai').expect;
const injectr = require('injectr');
const ocTemplateEs6 = require('oc-template-es6');
const ocTemplateHandlebars = require('oc-template-handlebars');
const ocTemplateJade = require('oc-template-jade');

describe('client : sanitiser', () => {
  const sanitiser = injectr(
    '../../src/sanitiser.js',
    { '../package': { version: '1.2.3' } },
    { process: { version: 'v0.10.40', platform: 'darwin', arch: 'x64' } }
  );

  const templateVersions = {
    es6: ocTemplateEs6.getInfo().version,
    handlebars: ocTemplateHandlebars.getInfo().version,
    jade: ocTemplateJade.getInfo().version
  };

  describe('when sanitising global rendering options', () => {
    describe('when user-agent not already set', () => {
      const config = sanitiser.sanitiseConfiguration();
      const result = sanitiser.sanitiseGlobalRenderOptions({}, config);

      it('should set oc-client user-agent', () => {
        expect(result.headers.templates).to.equal(
          ['es6', 'handlebars', 'jade']
            .map(t => `oc-template-${t},${templateVersions[t]}`)
            .join(';')
        );

        expect(result.headers['user-agent']).to.equal(
          'oc-client-1.2.3/v0.10.40-darwin-x64'
        );
      });
    });
  });
});
