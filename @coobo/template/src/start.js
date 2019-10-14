const { join } = require('path');
const { Container, asValue, asClass, asFunction } = require('@coobo/di');
const { Config, Env } = require('@coobo/config');
const Application = require('@coobo/app');
const Server = require('@coobo/srvr');
const { Database, Factory, FakeLibrary } = require('@coobo/db');

/** @type {import('@coobo/di').Container} */
let container = Container;

container.register({ appRoot: asValue(join(__dirname, '../')) });
container.register({
    Application: asClass(Application).singleton(),
    Server: asClass(Server).singleton(),
    Env: asClass(Env).singleton(),
    Config: asClass(Config).singleton(),
    Database: asFunction(Database).singleton(),
    Factory: asClass(Factory).singleton(),
    fake: asValue(FakeLibrary)
});

const env = container.resolve('Env');
/** @type {@import('@coobo/app')} */
const App = container.resolve('Application');

App.loadControllers();
const UserModel = container.resolve('UserModel');

global.App = App;
global.Env = env;
global.use = container.resolve;
