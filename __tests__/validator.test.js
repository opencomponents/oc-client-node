'use strict';

const validator = require('../src/validator');

test('validator api', () => {
  expect(validator).toHaveProperty('validateConfiguration'); // Q.: why an object arount this only function then?
  expect(validator).toMatchSnapshot();
});

const scenarios = [
  {
    description: 'conf is an empty object',
    conf: {},
    isValid: true // Q.: why this is valid?
  },
  {
    description: 'conf.registries is an empty array',
    conf: { registries: [] },
    isValid: false
  },
  {
    description: 'conf.registries is an empty object',
    conf: { registries: {} },
    isValid: false
  },
  {
    description: 'conf.registries is a valid object',
    conf: { registries: { serverRendering: 'http://registry.local:3030' } },
    isValid: true
  }
];

scenarios.forEach(({ description, conf, isValid }) => {
  test(description, () => {
    const result = validator.validateConfiguration(conf);
    expect(result.isValid).toEqual(isValid);
    expect(result).toMatchSnapshot();
  });
});
