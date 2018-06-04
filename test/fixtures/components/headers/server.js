'use strict';

module.exports.data = function(context, callback) {
  context.setHeader('header1', 'Hello');
  context.setHeader('header2', 'This is a test');
  callback(null, {});
};
