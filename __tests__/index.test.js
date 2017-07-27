'use strict';

const client = require('../src');
jest.mock('../src/components-renderer');
jest.mock('../src/get-components-info');
jest.mock('../src/warmup');

test('typeof client to equal "function"', () => {
  expect(typeof client).toEqual('function');
});

describe('client api', () => {
  const api = client();

  test('to match snapshot', () => {
    expect(api).toMatchSnapshot();
  });

  test('getComponentsInfo callback to have been called', () => {
    const callback = jest.fn();
    api.getComponentsInfo(null, callback);
    expect(callback).toHaveBeenCalled();
  });

  test('init callback to have been called', () => {
    const callback = jest.fn();
    api.init(null, callback);
    expect(callback).toHaveBeenCalled();
  });

  test('renderComponent (w/ 2 params) callback to have been called', () => {
    const callback = jest.fn();
    api.renderComponent('good', callback);
    expect(callback).toHaveBeenCalled();
  });

  test('renderComponent (w/ 3 params) callback to have been called', () => {
    const callback = jest.fn();
    api.renderComponent('bad', {}, callback);
    expect(callback).toHaveBeenCalled();
  });

  test('renderComponents (w/ 2 params) callback to have been called', () => {
    const callback = jest.fn();
    api.renderComponents([{ name: 'bad' }], callback);
    expect(callback).toHaveBeenCalled();
  });

  test('renderComponents (w/ 3 params) callback to have been called', () => {
    const callback = jest.fn();
    api.renderComponents([{ name: 'good' }], {}, callback);
    expect(callback).toHaveBeenCalled();
  });
});

test('error', () => {
  expect(() => {
    client({ registries: {} });
  }).toThrowErrorMatchingSnapshot();
});
