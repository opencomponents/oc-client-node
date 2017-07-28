'use strict';

function GetComponentsData() {
  return (toDo, options, cb) => {
    if (toDo[0].component.name === 'good') {
      cb();
    }
    if (toDo[0].component.name === 'bad') {
      const message = 'something bad happened';
      toDo[0].result.error = message; // Q.: this is bad :(
      cb(message);
    }
  };
}

module.exports = GetComponentsData;
