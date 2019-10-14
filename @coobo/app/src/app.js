const fs = require('fs');
const path = require('path');
const { Config, Env } = require('@coobo/config');
const Server = require('@coobo/srvr');
const { Database, Factory, FakeLibrary } = require('@coobo/db');

class Application {
  constructor({
    appRoot,
    Container,
    esmRequire,
    asClass,
    asFunction,
    asValue,
  }) {
    this._container = Container;
    this._container.register({
      Config: asClass(Config).singleton(),
      Env: asClass(Env).singleton(),
      Server: asClass(Server).singleton(),
      Database: asFunction(Database).singleton(),
      Factory: asClass(Factory).singleton(),
      fake: asValue(FakeLibrary),
    });
    this._require = esmRequire;
    this._asClass = asClass;
    this._asFunction = asFunction;
    this.inProduction = process.env.NODE_ENV === 'production';
    this.inDev = !this.inProduction;

    this.appRoot = appRoot;
    this.appName = process.env.APP_NAME || 'spendfy-service';
    this.package = require(path.join(appRoot, 'package.json'));
    this.version = this.package.version || '0.0.0';
    this.coreVersion = this.package.dependencies['@coobo/app'];

    this.loadControllers();
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

  loadControllers() {
    const domainsPath = this.domainsPath();
    const domains = fs.readdirSync(domainsPath);
    for (const domain of domains) {
      const domainPath = path.join(domainsPath, domain);
      const files = fs.readdirSync(domainPath);
      for (const file of files) {
        const filePath = path.join(domainPath, file);
        if (this.seedersTest().test(file)) this.registerSeeder(filePath);
        if (this.validatorsTest().test(file)) this.registerValidator(filePath);
        if (this.modelsTest().test(file)) this.registerModel(filePath);
        if (this.controllersTest().test(file))
          this.registerController(filePath);
      }
    }
  }

  registerController(filePath) {
    const module = this._require(filePath);
    const parts =
      filePath.indexOf('/') > -1 ? filePath.split('/') : filePath.split('\\');
    parts.pop();
    const nameUgly = parts.pop();
    const name = `${nameUgly[0].toUpperCase()}${nameUgly
      .substr(1)
      .toLowerCase()}Controller`;
    this._container.register({ [name]: this._asClass(module).singleton() });
  }

  registerModel(filePath) {
    const module = this._require(filePath);
    const parts =
      filePath.indexOf('/') > -1 ? filePath.split('/') : filePath.split('\\');
    parts.pop();
    const nameUgly = parts.pop();
    const name = `${nameUgly[0].toUpperCase()}${nameUgly
      .substr(1)
      .toLowerCase()}Model`;
    this._container.register({ [name]: this._asFunction(module).singleton() });
  }

  registerValidator(filePath) {
    const module = this._require(filePath);
    const parts =
      filePath.indexOf('/') > -1 ? filePath.split('/') : filePath.split('\\');
    parts.pop();
    const nameUgly = parts.pop();
    const name = `${nameUgly[0].toUpperCase()}${nameUgly
      .substr(1)
      .toLowerCase()}Validator`;
    this._container.register({ [name]: this._asFunction(module).singleton() });
  }

  registerSeeder(filePath) {
    const module = this._require(filePath);
    const parts =
      filePath.indexOf('/') > -1 ? filePath.split('/') : filePath.split('\\');
    parts.pop();
    const nameUgly = parts.pop();
    const name = `${nameUgly[0].toUpperCase()}${nameUgly
      .substr(1)
      .toLowerCase()}Seeder`;
    this._container.register({ [name]: this._asFunction(module).singleton() });
  }
}

module.exports = Application;
