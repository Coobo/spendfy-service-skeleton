const get = require('lodash.get');
const mergeWith = require('lodash.mergewith');
const set = require('lodash.set');

class Config {
  constructor(container) {
    const requireAll = container.resolve('requireAll');
    const configPath = container.resolve('configPath');
    this._config = requireAll(configPath);
  }

  get(key, defaultValue = null) {
    return get(this._config, key, defaultValue);
  }

  merge(key, defaultValues, customizer = null) {
    return mergeWith(defaultValues, this.get(key), customizer);
  }

  set(key, value) {
    set(this._config, key, value);
  }

  defaults(key, value) {
    const existingValue = this.get(key);
    if (existingValue) {
      mergeWith(value, existingValue);
    }

    this.set(key, value);
  }
}

module.exports = Config;
