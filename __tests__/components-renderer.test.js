'use strict';

const ComponentsRenderer = require('../src/components-renderer');
jest.mock('../src/get-components-data');

test('ComponentsRenderer (factory) is a function', () => {
  expect(typeof ComponentsRenderer).toEqual('function');
});

test('componentsRenderer (instance) is a function api', () => {
  const config = {};
  const componentsRenderer = new ComponentsRenderer(config);
  expect(typeof componentsRenderer).toEqual('function');
});

test('componentsRenderer happy path', () => {
  const config = {};
  const componentsRenderer = new ComponentsRenderer(config);
  const components = [
    {
      name: 'good',
      version: '1.0.0'
    }
  ];
  const callback = jest.fn();
  componentsRenderer(components, null, callback);
  expect(callback).toHaveBeenCalled();
  expect(callback.mock.calls).toMatchSnapshot();
});

test('componentsRenderer has errors', () => {
  const config = {
    components: {
      'bad': '1.0.0'
    }
  };
  const componentsRenderer = new ComponentsRenderer(config);
  const components = [
    {
      name: 'bad'
    }
  ];
  const callback = jest.fn();
  componentsRenderer(components, null, callback);
  expect(callback).toHaveBeenCalled();
  expect(callback.mock.calls).toMatchSnapshot();
});
