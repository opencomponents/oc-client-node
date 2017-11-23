'use strict';

const expect = require('chai').expect;

describe('client : validator', () => {
  const validator = require('../../src/validator');

  describe('when validating configuration', () => {
    describe('when registries is an array', () => {
      const result = validator.validateConfiguration({
        registries: ['http://www.registries.com']
      });

      it('should error', () => {
        expect(result.isValid).to.be.false;
        expect(result.error).to.equal(
          'Configuration is not valid: registries must be an object'
        );
      });
    });

    describe("when registries doesn't have neither clientRendering or serverRendering properties", () => {
      const result = validator.validateConfiguration({
        registries: {}
      });

      it('should error', () => {
        expect(result.isValid).to.be.false;
        expect(result.error).to.equal(
          'Configuration is not valid: registries must contain at least one endpoint'
        );
      });
    });

    describe('when registries contains serverRendering only', () => {
      const result = validator.validateConfiguration({
        registries: {
          serverRendering: 'http://localhost:3030'
        }
      });

      it('should pass', () => {
        expect(result.isValid).to.be.true;
      });
    });

    describe('when registries contains clientRendering only', () => {
      const result = validator.validateConfiguration({
        registries: {
          clientRendering: 'http://localhost:3030'
        }
      });

      it('should pass', () => {
        expect(result.isValid).to.be.true;
      });
    });

    describe('when templates is not an array', () => {
      const result = validator.validateConfiguration({
        templates: 'oc-template-x'
      });

      it('should error', () => {
        expect(result.isValid).to.be.false;
        expect(result.error).to.equal(
          'Configuration is not valid: templates must be an array'
        );
      });
    });
    describe('when templates contain an invalid package', () => {
      const result = validator.validateConfiguration({
        templates: [
          {
            getInfo() {
              return { type: 'oc-template-x' };
            }
          },
          { type: 'oc-template-y' }
        ]
      });

      it('should error', () => {
        expect(result.isValid).to.be.false;
        expect(result.error).to.equal(
          'Configuration is not valid: all templates must be a valid template package'
        );
      });
    });
  });
});
