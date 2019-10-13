const awilix = require('awilix');

const esmRequire = require('../utils/esmRequire');
const esmResolver = require('../utils/esmResolver');
const requireAll = require('../utils/requireAll');

/**
 * A class wrapper around awilix container.
 */
class Container {
  constructor() {
    this._awilix = awilix;
    this._container = this._awilix.createContainer();

    this._container.register({ Container: this._container });
    this._container.register('requireAll', { resolve: () => requireAll });
    this._container.register('esmRequire', { resolve: () => esmRequire });
    this._container.register('esmResolver', { resolve: () => esmResolver });

    return this._container;
  }
}

module.exports = Container;
