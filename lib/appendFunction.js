'use strict';

function appendFunction(module, requireFn, window, angular, filepath) {
  if (!module.hot || !angular) return;

  var moduleStack = window.__injularLoaderModuleStack__;
  if (angular.$injularUnproxify && module.hot.data && moduleStack.length === 0) {
    angular.$injularUnproxify();
  }

  if (module.__injularModuleCalled__) {
    module.hot.accept(function (err) {
      if (err) {
        console.error('Cannot apply hot update to ' + filepath + ': ' + err.message + '\n\n' + err.stack);
        module.hot.decline();
      }
    });
  } else {
    module.hot.accept([]);
  }
}

module.exports = appendFunction;
