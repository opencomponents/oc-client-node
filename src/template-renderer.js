'use strict';

const emptyResponseHandler = require('oc-empty-response-handler');
const htmlRenderer = require('./html-renderer');

const isTemplateLegacy = t => t === 'handlebars' || t === 'jade';

module.exports = function(templateModules) {
  return function(template, model, options, callback) {
    if (emptyResponseHandler.shouldRenderAsEmpty(model)) {
      return callback(null, '');
    }

    const { key } = options;
    let { templateType } = options;

    if (isTemplateLegacy(templateType)) {
      templateType = `oc-template-${templateType}`;
    }

    try {
      const ocTemplate = templateModules[templateType];
      ocTemplate.render({ key, model, template }, (err, html) => {
        options.html = html;
        return callback(err, htmlRenderer.renderedComponent(options));
      });
    } catch (err) {
      return callback(err);
    }
  };
};
