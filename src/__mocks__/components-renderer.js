'use strict';

function ComponentsRenderer() {
  return (components, options, callback) => {
    const component = components[0];
    if (component.name === 'good') {
      callback(null, []);
    }
    if (component.name === 'bad') {
      callback([], []);
    }
  };
}

module.exports = ComponentsRenderer;
