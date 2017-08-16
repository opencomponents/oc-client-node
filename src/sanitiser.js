'use strict';

const format = require('stringformat');

const packageInfo = require('../package');
const _ = require('./utils/helpers');

const lowerHeaderKeys = function(headers) {
  const result = {};

  _.each(headers, (header, headerName) => {
    result[headerName.toLowerCase()] = header;
  });

  return result;
};

const getDefaultUserAgent = function() {
  return format(
    'oc-client-{0}/{1}-{2}-{3}',
    packageInfo.version,
    process.version,
    process.platform,
    process.arch
  );
};

const getTemplatesInfo = templates =>
  templates.reduce((templatesHash, template) => {
    templatesHash[template] = require(template).getInfo().version;
    return templatesHash;
  }, {});

const sanitiseDefaultOptions = function(options, config) {
  if (_.isFunction(options)) {
    options = {};
  }
  const optionsCopy = Object.assign({}, options);
  optionsCopy.headers = lowerHeaderKeys(optionsCopy.headers);
  optionsCopy.headers['user-agent'] =
    optionsCopy.headers['user-agent'] || getDefaultUserAgent();
  optionsCopy.headers.templates =
    optionsCopy.headers.templates || getTemplatesInfo(config.templates);

  optionsCopy.timeout = optionsCopy.timeout || 5;
  return optionsCopy;
};

module.exports = {
  sanitiseDefaultOptions,
  sanitiseConfiguration: function(conf) {
    const baseTemplates = ['oc-template-handlebars', 'oc-template-jade'];
    const confCopy = Object.assign({}, conf);
    confCopy.components = confCopy.components || {};
    confCopy.cache = confCopy.cache || {};
    confCopy.templates = confCopy.templates
      ? _.uniq(confCopy.templates.concat(baseTemplates))
      : baseTemplates;

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
