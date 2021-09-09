'use strict';

module.exports = {
  clientSideRenderingFail: 'Client-side rendering failed',
  componentGetInfoFail: details => `Getting component info failed: ${details}`,
  configurationNotValid: 'Configuration is not valid: ',
  connectionError: (src, text) => `request ${src} failed (${text})`,
  clientRenderingOptionsNotSet: 'Client rendering options not set',
  emptyResponse: 'Empty response',
  genericError: 'Internal client error',
  legacyComponent:
    "The component can't be rendered because it was published with an older OC version",
  missingComponentName: 'The component name is missing',
  registriesEmpty: 'registries must contain at least one endpoint',
  registriesIsNotObject: 'registries must be an object',
  templatesIsNotArray: 'templates must be an array',
  templateIsNotValid: 'all templates must be a valid template package',
  serverSideRenderingFail: details =>
    `Server-side rendering failed: ${details}`,
  warmupFailed: (details, err) =>
    `Error warming up oc-client: request ${details} failed (${err})`
};
