'use strict';

const settings = require('./settings');
const _ = require('./utils/helpers');

module.exports = {
  validateConfiguration: function(conf) {
    const errorMessage = function(msg) {
      return {
        isValid: false,
        error: settings.configurationNotValid + msg
      };
    };

    if (!!conf.templates && !_.isArray(conf.templates)) {
      return errorMessage(settings.templatesIsNotArray);
    } else if (!!conf.templates && _.isArray(conf.templates)) {
      const validTemplates = conf.templates.every(template => {
        return template.getInfo && typeof template.getInfo === 'function';
      });
      if (!validTemplates) {
        return errorMessage(settings.templateIsNotValid);
      }
    }

    if (!!conf.registries && _.isArray(conf.registries)) {
      return errorMessage(settings.registriesIsNotObject);
    } else if (
      !!conf.registries &&
      !conf.registries.serverRendering &&
      !conf.registries.clientRendering
    ) {
      return errorMessage(settings.registriesEmpty);
    }

    return { isValid: true };
  }
};
