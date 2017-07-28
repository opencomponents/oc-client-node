'use strict';

const sanitiser = require('../src/sanitiser');

test('sanitiser api', () => {
  expect(sanitiser).toMatchSnapshot();
});

test('sanitiseConfiguration', () => {
  const result = sanitiser.sanitiseConfiguration();
  expect(result).toMatchSnapshot();
});

test('sanitiseGlobalGetInfoOptions', () => {
  const result = sanitiser.sanitiseGlobalGetInfoOptions();
  expect(result).toMatchSnapshot();
});

describe('sanitiseGlobalRenderOptions', () => {
  const scenarios = [
    {
      description: 'all empty',
      options: {},
      config: {}
    },
    {
      description: 'clientRendering is false',
      options: {},
      config: { registries: { clientRendering: false } }
    },
    {
      description: 'options is a function',
      options: jest.fn(),
      config: {}
    },
    {
      description: 'options is a function',
      options: jest.fn(),
      config: {}
    },
    {
      description: 'options w/ headers',
      options: { headers: { 'X-OT-Channel': 'MobileWeb' } },
      config: {}
    },
    {
      description: 'container is true and renderInfo is false',
      options: { container: true, renderInfo: false },
      config: {}
    }
  ];

  scenarios.forEach(({ description, options, config }) => {
    test(description, () => {
      const result = sanitiser.sanitiseGlobalRenderOptions(options, config);
      expect(result).toMatchSnapshot();
    });
  });
});
