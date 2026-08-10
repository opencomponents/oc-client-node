'use strict';

const expect = require('chai').expect;
const injectr = require('injectr');
const sinon = require('sinon');

describe('client', () => {
  let validatorStub, Client, init;

  const initialise = function() {
    validatorStub = sinon.stub();
    Client = injectr(
      '../../src/index.js',
      {
        './validator': { validateConfiguration: validatorStub }
      },
      { __dirname: '/something/', console: console }
    );
  };

  describe('when not correctly initialised', () => {
    before(() => {
      initialise();
      validatorStub.returns({ isValid: false, error: 'argh!' });
      init = function() {
        Client();
      };
    });

    it('should throw an exception', () => {
      expect(init).to.throw('argh!');
    });
  });

  describe('promise and callback APIs', () => {
    const warningStoreKey = Symbol.for('opencomponents.deprecation-warnings');
    let client;
    let renderComponents;
    let getComponentsInfo;
    let renderTemplate;
    let warmup;
    let emitWarning;
    let previousWarningStore;

    const rejectionOf = async promise => {
      try {
        await promise;
      } catch (error) {
        return error;
      }
      throw new Error('Expected promise to reject');
    };

    beforeEach(() => {
      initialise();
      validatorStub.returns({ isValid: true });
      renderComponents = sinon.stub().yields(null, ['<p>hello</p>'], [{}]);
      getComponentsInfo = sinon.stub().yields(null, [{ name: 'hello' }]);
      renderTemplate = sinon.stub().yields(null, '<p>template</p>');
      warmup = sinon.stub().yields(null, { hello: '<p>hello</p>' });
      previousWarningStore = process[warningStoreKey];
      delete process[warningStoreKey];
      emitWarning = sinon.stub(process, 'emitWarning');
      client = injectr(
        '../../src/index.js',
        {
          './validator': { validateConfiguration: validatorStub },
          './components-renderer': function() {
            return renderComponents;
          },
          './get-components-info': function() {
            return getComponentsInfo;
          },
          './template-renderer': function() {
            return renderTemplate;
          },
          './warmup': function() {
            return warmup;
          }
        },
        { __dirname: '/something/', console: console, process }
      )({});
    });

    afterEach(() => {
      emitWarning.restore();
      if (previousWarningStore) {
        process[warningStoreKey] = previousWarningStore;
      } else {
        delete process[warningStoreKey];
      }
    });

    it('returns the first success value from every promise API', async () => {
      expect(await client.init()).to.eql({ hello: '<p>hello</p>' });
      expect(await client.renderComponent('hello')).to.equal('<p>hello</p>');
      expect(await client.renderComponents([{ name: 'hello' }])).to.eql([
        '<p>hello</p>'
      ]);
      expect(await client.getComponentsInfo([{ name: 'hello' }])).to.eql([
        { name: 'hello' }
      ]);
      expect(await client.renderTemplate('template', {}, {})).to.equal(
        '<p>template</p>'
      );
      expect(emitWarning.called).to.be.false;
    });

    it('rejects with the original callback errors', async () => {
      const error = new Error('failed');
      warmup.yields(error);
      expect(await rejectionOf(client.init())).to.equal(error);

      renderComponents.yields([error], ['fallback'], [{}]);
      expect(await rejectionOf(client.renderComponent('hello'))).to.equal(
        error
      );
      expect(
        await rejectionOf(client.renderComponents([{ name: 'hello' }]))
      ).to.eql([error]);

      getComponentsInfo.yields([error]);
      expect(
        await rejectionOf(client.getComponentsInfo([{ name: 'hello' }]))
      ).to.eql([error]);

      renderTemplate.yields(error);
      expect(
        await rejectionOf(client.renderTemplate('template', {}, {}))
      ).to.equal(error);
    });

    it('preserves synchronous exceptions as promise rejection reasons', async () => {
      const error = new Error('synchronous failure');
      renderComponents.resetBehavior();
      renderComponents.throws(error);

      expect(await rejectionOf(client.renderComponent('hello'))).to.equal(
        error
      );
    });

    it('preserves direct callback behavior and warns once', () => {
      const callback = sinon.spy();

      expect(client.init(callback)).to.be.undefined;
      expect(client.renderComponent('hello', callback)).to.be.undefined;
      expect(client.renderComponents([{ name: 'hello' }], callback)).to.be
        .undefined;
      expect(client.getComponentsInfo([{ name: 'hello' }], callback)).to.be
        .undefined;
      expect(client.renderTemplate('template', {}, {}, callback)).to.be
        .undefined;

      expect(callback.callCount).to.equal(5);
      expect(callback.secondCall.args).to.eql([null, '<p>hello</p>', {}]);
      expect(emitWarning.calledOnce).to.be.true;
      expect(emitWarning.firstCall.args[0]).to.contain('Node.js oc-client');
      expect(emitWarning.firstCall.args[1]).to.equal('DeprecationWarning');
    });

    it('does not swallow exceptions thrown by legacy callbacks', () => {
      expect(() =>
        client.renderComponent('hello', () => {
          throw new Error('callback failed');
        })
      ).to.throw('callback failed');
    });

    it('shares warning identity with the core deprecation utility', () => {
      process[warningStoreKey] = new Set(['node-oc-client-callback-api']);

      client.renderComponent('hello', () => {});

      expect(emitWarning.called).to.be.false;
    });
  });
});
