'use strict';

function prependFunction(module, requireFn, window) {
  if (!module.hot) return;

  var injular = requireFn('injular');
  var angular = window.angular || requireFn('angular');

  var loaderData = window.__injularLoaderData__;
  if (!loaderData) {
    loaderData = {
      injularData: {},
    };
    window.__injularLoaderData__ = loaderData;
    injular.attachToModule(angular.module('ng'), loaderData.injularData);
    var injularModule = angular.module;
    angular.module = function injularLoaderModule() {
      var moduleStack = window.__injularLoaderModuleStack__;
      var currentModule = moduleStack[moduleStack.length - 1];
      if (currentModule) {
        currentModule.__injularModuleCalled__ = true;
      }
      return injularModule.apply(this, arguments);
    };
  }

  if (module.hot.data && !angular.$injularUnproxify) {
    injular.proxifyAngular(angular, loaderData.injularData);
  }
}

module.exports = prependFunction;
