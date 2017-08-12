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
  const copy = Object.assign({}, options);
  copy.headers = lowerHeaderKeys(copy.headers);
  copy.headers['user-agent'] =
    copy.headers['user-agent'] || getDefaultUserAgent();
  copy.headers.templates =
    copy.headers.templates || getTemplatesInfo(config.templates);

  copy.timeout = copy.timeout || 5;
  return copy;
};

module.exports = {
  sanitiseDefaultOptions,
  sanitiseConfiguration: function(conf) {
    const baseTemplates = ['oc-template-handlebars', 'oc-template-jade'];
    const copy = Object.assign({}, conf);
    copy.components = copy.components || {};
    copy.cache = copy.cache || {};
    copy.templates = copy.templates
      ? _.uniq(copy.templates.concat(baseTemplates))
      : baseTemplates;

    return copy;
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
