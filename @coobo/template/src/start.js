const { join } = require('path');
const { Container, asValue, asClass } = require('@coobo/di');
const Application = require('@coobo/app');

/** @type {import('@coobo/di').Container} */
let container = Container;

container.register({ appRoot: asValue(join(__dirname, '../')) });
container.register({
    Application: asClass(Application).singleton()
});

/** @type {@import('@coobo/app')} */
const App = container.resolve('Application');

console.log(container.registrations);

global.App = App;
global.Env = container.resolve('Env');
global.use = container.resolve;

const s = container.resolve('UserSeeder');

console.log(s.model('User').make());
