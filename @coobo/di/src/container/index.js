const container = require('awilix');

/**
 * A class wrapper around awilix container.
 */
class Container {
  constructor() {
    this._awilix = container;
    this._container = this._awilix.createContainer();

    return this._container;
  }
}

module.exports = Container;
