const mongoose = require('mongoose');

const database = require('./database');
const factory = require('./factory');
const fake = require('./fake');

module.exports = {
  /** @type {import('mongoose')} */
  mongoose,
  /** @type {import('./database')} */
  Database: database,
  /** @type {import('./factory')} */
  Factory: factory,
  /** @type {import('./fake')} */
  FakeLibrary: fake,
  /** @type {import('./database')} */
  default: database,
};
