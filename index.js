'use strict';

const loaderUtils = require('loader-utils');
const SourceNode = require('source-map').SourceNode;
const SourceMapConsumer = require('source-map').SourceMapConsumer;

const makeIdentitySourceMap = require('./makeIdentitySourceMap');
const prependFunction = require('./lib/prependFunction');
const appendFunction = require('./lib/appendFunction');

const prependString = prependFunction.toString().replace(/^\s+|\s*\n\s*/g, ' ');
const appendString = appendFunction.toString().replace(/^\s+|\s*\n\s*/g, ' ');

// eslint-disable-next-line consistent-return
module.exports = function injularLoader(source, map) {
  if (this.cacheable) {
    this.cacheable();
  }

  const options = loaderUtils.getOptions(this);
  const resourcePath = this.resourcePath;
  const separator = '\n\n';

  const angularString = options.requireAngular ? 'require("angular")' : 'window.angular';

  const prependText = [
    '/* INJULAR LOADER */',
    `(${prependString})(module, require, window, ${angularString});`,
    'try {',
    '(function () {',
  ].join(' ');

  const appendText = [
    '/* INJULAR LOADER */',
    '}).call(this);',
    '} finally {',
    `(${appendString})(module, require, window, ${angularString}, ${JSON.stringify(resourcePath)});`,
    '}',
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
