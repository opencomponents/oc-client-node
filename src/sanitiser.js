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
  config = config || {};
  config.templates = config.templates || [
    'oc-template-handlebars',
    'oc-template-jade'
  ];
  options = options || {};
  options.headers = lowerHeaderKeys(options.headers);
  options.headers['user-agent'] =
    options.headers['user-agent'] || getDefaultUserAgent();
  options.headers.templates =
    options.headers.templates || getTemplatesInfo(config.templates);

  options.timeout = options.timeout || 5;
  return options;
};

module.exports = {
  sanitiseConfiguration: function(conf) {
    conf = conf || {};
    conf.components = conf.components || {};
    conf.cache = conf.cache || {};

    return conf;
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
