'use strict';

function appendFunction(module, requireFn, window, filename) {
  if (!module.hot) return;

  var angular = window.angular || requireFn('angular');

  var moduleStack = window.__injularLoaderModuleStack__;
  if (angular.$injularUnproxify && module.hot.data && moduleStack.length === 0) {
    angular.$injularUnproxify();
  }

  if (module.__injularModuleCalled__) {
    module.hot.accept(function (err) {
      if (err) {
        console.error('Cannot apply hot update to ' + filename + ': ' + err.message);
      }
    });
  } else {
    module.hot.accept([]);
  }
}

module.exports = appendFunction;
