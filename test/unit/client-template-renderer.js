'use strict';

const expect = require('chai').expect;
const injectr = require('injectr');

describe('client : template-renderer', () => {
  let error, result;
  const TemplateRenderer = injectr('../../src/template-renderer.js', {
    './html-renderer': {
      renderedComponent: x => `<transformed>${x.html}</transformed>`
    }
  });

  const templateModules = {
    'working-template': {
      render: (x, cb) => {
        cb(null, '<div>hello</div>');
      }
    },
    'braking-template': {
      render: (x, cb) => {
        cb(new Error('Ouch'));
      }
    },
    'throwing-template': {
      render: (x, cb) => {
        throw new Error('Exception');
        cb(err, res);
      }
    }
  };

  const templateRenderer = new TemplateRenderer(templateModules);

  const next = done => (err, res) => {
    error = err;
    result = res;
    done();
  };

  describe('when rendering template succeeds', () => {
    beforeEach(done => {
      templateRenderer(
        null,
        null,
        { templateType: 'working-template' },
        next(done)
      );
    });

    it('should not error', () => {
      expect(error).to.be.null;
    });

    it('should return transformed result', () => {
      expect(result).to.equal('<transformed><div>hello</div></transformed>');
    });
  });

  describe('when rendering template fails', () => {
    beforeEach(done => {
      templateRenderer(
        null,
        null,
        { templateType: 'braking-template' },
        next(done)
      );
    });

    it('should return error', () => {
      expect(error.toString()).to.contain('Ouch');
    });
  });

  describe('when rendering template throws an error', () => {
    beforeEach(done => {
      templateRenderer(
        null,
        null,
        { templateType: 'throwing-template' },
        next(done)
      );
    });

    it('should catch and return error', () => {
      expect(error.toString()).to.contain('Exception');
    });
  });
});
