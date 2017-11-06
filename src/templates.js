'use strict';

module.exports = {
  clientScript: ({ clientJs, unrenderedComponentTag }) =>
    `<script class="ocClientScript">${clientJs}</script>${unrenderedComponentTag}`,

  componentTag: ({ href, html, key, name, version }) =>
    `<oc-component href="${href}" data-hash="${key}" data-name="${name ||
      ''}" data-rendered="true" data-version="${version}">${html}</oc-component>`,

  componentUnrenderedTag: ({ href }) =>
    `<oc-component href="${href}"></oc-component>`,

  renderInfo: ({ name, version }) =>
    `<script>window.oc=window.oc||{};oc.renderedComponents=oc.renderedComponents||{};oc.renderedComponents["${name}"]="${version}";</script>`
};
