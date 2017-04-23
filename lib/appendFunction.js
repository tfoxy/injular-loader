'use strict';

function appendFunction(module, requireFn, window, filename) {
  if (!module.hot) return;

  var angular = window.angular || requireFn('angular');

  var loaderData = window.__injularLoaderData__;
  loaderData.moduleStack.pop();
  if (angular.$injularUnproxify && module.hot.data && loaderData.moduleStack.length === 0) {
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
