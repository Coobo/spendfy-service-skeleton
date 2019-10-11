const container = require('awilix');
const requireAll = require('../utils/requireAll');
const esmRequire = require('../utils/esmRequire');
const esmResolver = require('../utils/esmResolver');

/**
 * A class wrapper around awilix container.
 */
class Container {
  constructor() {
    this._awilix = container;
    this._container = this._awilix.createContainer();

    this._container.register('requireAll', { resolve: () => requireAll });
    this._container.register('esmRequire', { resolve: () => esmRequire });
    this._container.register('esmResolver', { resolve: () => esmResolver });

    this._container.register({
      configPath: { resolve: () => 'src/config' },
      servicesPath: { resolve: () => 'src/services' },
      domainsPath: { resolve: () => 'src/domains' },
      controllersTestRegex: { resolve: () => /(.*)Controller\.js/i },
      modelsTestRegex: { resolve: () => /(.*)Model\.js/i },
      validatorsTestRegex: { resolve: () => /(.*)Validator\.js/i },
    });

    return this._container;
  }
}

module.exports = Container;
