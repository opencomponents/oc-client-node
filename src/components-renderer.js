'use strict';

const Cache = require('nice-cache');

const GetComponentsData = require('./get-components-data');
const ProcessClientResponse = require('./process-client-responses');
const RenderComponents = require('./render-components');
const sanitiser = require('./sanitiser');
const _ = require('./utils/helpers');

module.exports = function(config, renderTemplate, templatesModules) {
  const cache = new Cache(config.cache);
  const getComponentsData = new GetComponentsData(config);
  const renderComponents = new RenderComponents(
    cache,
    renderTemplate,
    templatesModules
  );
  const processClientResponses = new ProcessClientResponse(cache, config);

  return function(components, options, callback) {
    options = sanitiser.sanitiseGlobalRenderOptions(options, config);

    const toDo = [];

    _.each(components, (component, i) => {
      component.version =
        component.version || config.components[component.name];
      toDo.push({
        component: component,
        container: component.container || options.container,
        pos: i,
        render: component.render || options.render || 'server',
        result: {}
      });
    });

    getComponentsData(toDo, options, () => {
      renderComponents(toDo, options, () => {
        processClientResponses(toDo, options, () => {
          const errors = [],
            results = [],
            details = [];
          let hasErrors = false;

          _.each(toDo, action => {
            if (action.result.error) {
              hasErrors = true;
            }
            errors.push(action.result.error || null);
            results.push(action.result.html);
            details.push({ headers: action.result.headers });
          });

          if (hasErrors) {
            callback(errors, results, details);
          } else {
            callback(null, results, details);
          }
        });
      });
    });
  };
};
