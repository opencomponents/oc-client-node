'use strict';

const htmlRenderer = require('./html-renderer');
const requireTemplate = require('./utils/require-template');

const isTemplateLegacy = t => !!{ handlebars: true, jade: true }[t];

module.exports = function() {
  return function(template, model, options, callback) {
    const { key } = options;
    let { templateType } = options;

    if (isTemplateLegacy(templateType)) {
      templateType = `oc-template-${templateType}`;
    }

    try {
      const ocTemplate = requireTemplate(templateType);
      ocTemplate.render({ key, model, template }, (err, html) => {
        options.html = html;
        return callback(err, htmlRenderer.renderedComponent(options));
      });
    } catch (err) {
      return callback(err);
    }
  };
};
