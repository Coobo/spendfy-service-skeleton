const {
  asClass,
  asValue,
  asFunction,
  aliasTo,
  InjectionMode,
  Lifetime,
  RESOLVER,
  createContainer,
} = require('awilix');

const container = require('./container');

module.exports = {
  /** @type {import('./container').Container} */
  Container: container,
  /** @type {import('awilix').AwilixContainer} */
  AwilixContainer: createContainer(),
  /** @type {import('awilix').asClass} */
  asClass,
  /** @type {import('awilix').asValue} */
  asValue,
  /** @type {import('awilix').asFunction} */
  asFunction,
  /** @type {import('awilix').aliasTo} */
  aliasTo,
  /** @type {import('awilix').InjectionMode} */
  InjectionMode,
  /** @type {import('awilix').Lifetime} */
  Lifetime,
  /** @type {import('awilix').RESOLVER} */
  RESOLVER,
};
