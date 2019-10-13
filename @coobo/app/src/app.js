const path = require('path');

class Application {
  constructor({ appRoot }) {
    this.inProduction = process.env.NODE_ENV === 'production';
    this.inDev = !this.inProduction;

    this.appRoot = appRoot;
    this.appName = process.env.APP_NAME || 'spendfy-service';
    this.package = require(path.join(appRoot, 'package.json'));
    this.version = this.package.version || '0.0.0';
    this.coreVersion = this.package.dependencies['@coobo/app'];
  }

  makePath(...paths) {
    return path.join(this.appRoot, ...paths);
  }

  configPath() {
    return path.join(this.appRoot, 'src/config');
  }

  servicesPath() {
    return path.join(this.appRoot, 'src/services');
  }

  domainsPath() {
    return path.join(this.appRoot, 'src/domains');
  }

  controllersTest() {
    return /(.*)Controller\.js/i;
  }

  modelsTest() {
    return /(.*)Model\.js/i;
  }

  validatorsTest() {
    return /(.*)Validator\.js/i;
  }

  seedersTest() {
    return /(.*)Seeder\.js/i;
  }
}

module.exports = Application;
