'use strict';

// const loaderUtils = require('loader-utils');
const SourceNode = require('source-map').SourceNode;
const SourceMapConsumer = require('source-map').SourceMapConsumer;

const makeIdentitySourceMap = require('./makeIdentitySourceMap');

// eslint-disable-next-line consistent-return
module.exports = function injularLoader(source, map) {
  const resourcePath = this.resourcePath;
  const separator = '\n\n';

  if (this.cacheable) {
    this.cacheable();
  }

  const prependText = [
    '/* INJULAR LOADER moduleStack */',
    'if (typeof __injularLoaderModuleStack__ === "undefined") __injularLoaderModuleStack__ = [];',
    '__injularLoaderModuleStack__.push(module);',
  ].join(' ');

  const appendText = [
    '/* INJULAR LOADER moduleStack */',
    '__injularLoaderModuleStack__.pop();',
  ].join(' ');

  if (this.sourceMap === false) {
    return this.callback(null, [
      prependText,
      source,
      appendText,
    ].join(separator));
  }

  if (!map) {
    // eslint-disable-next-line no-param-reassign
    map = makeIdentitySourceMap(source, resourcePath);
  }

  const node = new SourceNode(null, null, null, [
    new SourceNode(null, null, resourcePath, prependText),
    SourceNode.fromStringWithSourceMap(source, new SourceMapConsumer(map)),
    new SourceNode(null, null, resourcePath, appendText),
  ]).join(separator);

  const result = node.toStringWithSourceMap();

  this.callback(null, result.code, result.map.toString());
};
