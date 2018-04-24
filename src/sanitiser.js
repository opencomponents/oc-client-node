'use strict';

const packageInfo = require('../package');
const _ = require('./utils/helpers');

const lowerHeaderKeys = function(headers) {
  const result = {};

  _.each(headers, (header, headerName) => {
    result[headerName.toLowerCase()] = header;
  });

  return result;
};

const getDefaultUserAgent = () =>
  `oc-client-${packageInfo.version}/${process.version}-${process.platform}-${
    process.arch
  }`;

const getTemplatesHeadersInfo = templates =>
  templates
    .map(template => {
      const info = template.getInfo();
      return `${info.type},${info.version}`;
    })
    .join(';');

const sanitiseDefaultOptions = function(options, config) {
  if (_.isFunction(options)) {
    options = {};
  }
  const optionsCopy = Object.assign({}, options);
  optionsCopy.headers = lowerHeaderKeys(optionsCopy.headers);
  optionsCopy.headers['user-agent'] =
    optionsCopy.headers['user-agent'] || getDefaultUserAgent();
  optionsCopy.headers.templates =
    optionsCopy.headers.templates || getTemplatesHeadersInfo(config.templates);

  optionsCopy.timeout = optionsCopy.timeout || 5;
  return optionsCopy;
};

module.exports = {
  sanitiseDefaultOptions,
  sanitiseConfiguration: function(conf) {
    const baseTemplates = [
      require('oc-template-es6'),
      require('oc-template-handlebars'),
      require('oc-template-jade')
    ];
    const confCopy = Object.assign({}, conf);
    confCopy.components = confCopy.components || {};
    confCopy.cache = confCopy.cache || {};
    confCopy.templates = confCopy.templates || [];
    confCopy.templates = _.uniqTemplates(
      confCopy.templates.concat(baseTemplates)
    );
    return confCopy;
  },

  sanitiseGlobalRenderOptions: function(options, config) {
    options = sanitiseDefaultOptions(options, config);
    options.headers.accept = 'application/vnd.oc.unrendered+json';

    options.container = options.container === true ? true : false;
    options.renderInfo = options.renderInfo === false ? false : true;

    if (!!config.registries && !config.registries.clientRendering) {
      options.disableFailoverRendering = true;
    }

    return options;
  },

  sanitiseGlobalGetInfoOptions: function(options, config) {
    options = sanitiseDefaultOptions(options, config);
    options.headers.accept = 'application/vnd.oc.info+json';
    return options;
  }
};
