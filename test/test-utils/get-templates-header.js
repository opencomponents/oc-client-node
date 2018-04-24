const templateVersions = {
  es6: require('oc-template-es6').getInfo().version,
  handlebars: require('oc-template-handlebars').getInfo().version,
  jade: require('oc-template-jade').getInfo().version
};

module.exports = Object.keys(templateVersions)
  .map(t => `oc-template-${t},${templateVersions[t]}`)
  .join(';');
