'use strict';

const TemplateRenderer = require('../src/template-renderer');

const templateRenderer = new TemplateRenderer(); // Q.: this is totally unecessary

test('TemplateRenderer ctor', () => {
  expect(typeof templateRenderer).toEqual('function');
});

const scenarios = [
  {
    description: 'bad template type',
    template: null,
    model: null,
    options: { templateType: 'unsupported' }
  },
  {
    description: 'jade',
    template: null,
    model: null,
    options: { templateType: 'jade' }
  },
  {
    description: 'handlebars',
    template: null,
    model: null,
    options: { templateType: 'handlebars' }
  }
];

scenarios.forEach(({ description, template, model, options }) => {
  test(description, () => {
    const callback = jest.fn();
    templateRenderer(template, model, options, callback);
    expect(callback).toHaveBeenCalled();
    expect(callback.mock.calls).toMatchSnapshot();
  });
});
