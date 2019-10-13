const {
  createContainer,
  asClass,
  asValue,
  asFunction,
  aliasTo,
} = require('awilix');

const esmRequire = require('../utils/esmRequire');
const esmResolver = require('../utils/esmResolver');
const requireAll = require('../utils/requireAll');

/**
 * A class wrapper around awilix container.
 */
class Container {
  constructor() {
    this._container = createContainer();

    this._container.register({ Container: asValue(this._container) });
    this._container.register('requireAll', asValue(requireAll));
    this._container.register('esmRequire', asValue(esmRequire));
    this._container.register('esmResolver', asValue(esmResolver));
    this._container.register('asClass', asValue(asClass));
    this._container.register('asValue', asValue(asValue));
    this._container.register('asFunction', asValue(asFunction));
    this._container.register('aliasTo', asValue(aliasTo));

    return this._container;
  }
}

module.exports = Container;
