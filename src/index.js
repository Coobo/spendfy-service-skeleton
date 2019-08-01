const skeleton = exports;
const App = require('./app');

/** Main Application contructor */
skeleton.App = App;

let packageJSON = require('./../package.json');

/** Package Version */
skeleton.version = packageJSON.version;

/** Package Author */
skeleton.author = packageJSON.author;

/** Middlewares */
skeleton.middlewares = require('./middlewares');

/** API Logger */
skeleton.logger = require('./logger');
