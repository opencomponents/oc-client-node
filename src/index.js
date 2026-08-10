'use strict';

const ComponentsRenderer = require('./components-renderer');
const GetComponentsInfo = require('./get-components-info');

const sanitiser = require('./sanitiser');
const TemplateRenderer = require('./template-renderer');
const validator = require('./validator');
const Warmup = require('./warmup');
const _ = require('./utils/helpers');

const warningStoreKey = Symbol.for('opencomponents.deprecation-warnings');
const callbackWarningId = 'node-oc-client-callback-api';

const warnAboutCallbacks = () => {
  const warned = process[warningStoreKey] || new Set();
  process[warningStoreKey] = warned;
  if (warned.has(callbackWarningId)) {
    return;
  }

  warned.add(callbackWarningId);
  process.emitWarning(
    'The callback API of the Node.js oc-client is deprecated and will be removed in OpenComponents v1 - use the returned promises instead.',
    'DeprecationWarning'
  );
};

const toComponent = (componentName, options) => ({
  name: componentName,
  version: options.version,
  parameters: options.parameters || options.params
});

module.exports = function(conf) {
  const config = sanitiser.sanitiseConfiguration(conf);
  const validationResult = validator.validateConfiguration(config);
  const templateModules = config.templates.reduce((hash, template) => {
    hash[template.getInfo().type] = template;
    return hash;
  }, {});

  const renderTemplate = new TemplateRenderer(templateModules);
  const renderComponents = new ComponentsRenderer(
    config,
    renderTemplate,
    templateModules
  );
  const getComponentsInfo = new GetComponentsInfo(config);

  if (!validationResult.isValid) {
    throw new Error(validationResult.error);
  }

  return {
    supportsPromiseApi: true,
    init: function(options, callback) {
      if (_.isFunction(options)) {
        callback = options;
        options = {};
      }
      options = options || {};

      if (_.isFunction(callback)) {
        warnAboutCallbacks();
        const _renderComponents = options.renderComponents || renderComponents;
        return new Warmup(config, _renderComponents)(options, callback);
      }

      return new Promise((resolve, reject) => {
        const _renderComponents = options.renderComponents || renderComponents;
        const warmup = new Warmup(config, _renderComponents);
        warmup(options, (error, result) =>
          error ? reject(error) : resolve(result)
        );
      });
    },
    renderComponent: function(componentName, options, callback) {
      if (_.isFunction(options)) {
        callback = options;
        options = {};
      }
      options = options || {};
      const components = [toComponent(componentName, options)];

      if (_.isFunction(callback)) {
        warnAboutCallbacks();
        return renderComponents(
          components,
          options,
          (errors, results, details) =>
            callback(errors ? errors[0] : null, results[0], details[0])
        );
      }

      return new Promise((resolve, reject) => {
        renderComponents(components, options, (errors, results) =>
          errors ? reject(errors[0]) : resolve(results[0])
        );
      });
    },
    renderComponents: function(components, options, callback) {
      if (_.isFunction(options)) {
        callback = options;
        options = {};
      }

      if (_.isFunction(callback)) {
        warnAboutCallbacks();
        return renderComponents(components, options, callback);
      }

      return new Promise((resolve, reject) => {
        renderComponents(components, options, (errors, results) =>
          errors ? reject(errors) : resolve(results)
        );
      });
    },
    getComponentsInfo: function(components, callback) {
      if (_.isFunction(callback)) {
        warnAboutCallbacks();
        return getComponentsInfo(components, callback);
      }

      return new Promise((resolve, reject) => {
        getComponentsInfo(components, (error, result) =>
          error ? reject(error) : resolve(result)
        );
      });
    },
    renderTemplate: function(template, model, options, callback) {
      if (_.isFunction(callback)) {
        warnAboutCallbacks();
        return renderTemplate(template, model, options, callback);
      }

      return new Promise((resolve, reject) => {
        renderTemplate(template, model, options, (error, html) =>
          error ? reject(error) : resolve(html)
        );
      });
    }
  };
};
