import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import logger from './logger';
import { requestIdentifier, workerIdentifier } from './middlewares';

class App {
  /**
   * @name app
   * @type {Express.Application}
   * @description The actual Express App that will handle requests
   */
  app;

  /**
   * @name defaultAllowedMethods
   * @type {String[]}
   * @default ['OPTIONS','GET','POST','PUT','PATCH','DELETE']
   * @description The app's default allowed HTTP Methods in case CORS is enabled through options (DEFAULTS TO TRUE)
   */
  defaultAllowedMethods = process.env.ALLOWED_HTTP_METHODS
    ? JSON.parse(process.env.ALLOWED_HTTP_METHODS)
    : ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

  /**
   * @name defaultAllowedHeaders
   * @type {String[]}
   * @default ['Origin','X-Requested-With','Content-Type','Accept','Authorization','Needed-Permissions','RequestID']
   * @description The app's default allowed Headers in case CORS is enabled through options (DEFAULTS TO TRUE)
   */
  defaultAllowedHeaders = process.env.ALLOWED_HTTP_HEADERS
    ? JSON.parse(process.env.ALLOWED_HTTP_HEADERS)
    : [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'Needed-Permissions',
        'RequestID'
      ];

  /**
   * @name defaultProtectedEnvironments
   * @type {String[]}
   * @default ['production','staging']
   * @description The app's default environments in which secure precautions should be taken
   */
  defaultProtectedEnvironments = process.env.PROTECTED_ENVIRONMENTS
    ? JSON.parse(process.env.PROTECTED_ENVIRONMENTS)
    : ['production', 'staging'];

  /**
   *
   * @param {Object} [options={}] The options to configure the application
   * @param {Number} [options.port=3000]
   * @param {String} [options.mode=main] The mode in wich the app should run, can be main or worker
   * @param {Boolean} [options.enableRequestIdentifier=true]
   * @param {Boolean} [options.enableCompression=true]
   * @param {Boolean} [options.enableUpload=true]
   * @param {Boolean} [options.enableCors=true]
   * @param {Object} [options.cors]
   * @param {String|String[]|Boolean} [options.cors.origin=true]
   * @param {String[]} [options.cors.allowedHeaders=[]]
   * @param {String[]} [options.cors.allowedMethods=[]]
   * @param {Boolean} [options.enableProxy=true]
   */
  constructor(options = {}) {
    // Setting default cors options
    options.cors = Object.assign(
      {},
      { origin: true, allowedHeaders: [], allowedMethods: [] },
      options.cors || {}
    );
    // Setting default options
    options = Object.assign(
      {},
      {
        port: process.env.PORT || 3000,
        mode: 'main',
        enableRequestIdentifier: true,
        enableCompression: true,
        enableUpload: true,
        enableCors: true,
        enableProxy: true,
        protectedEnvironments: []
      },
      options
    );
    this.app = express();
    this.configure(options);
  }

  configure(options) {
    this.registerLogger();
    if (options.mode === 'worker') this.setAsWorker();
    if (options.enableRequestIdentifier === true) this.setRequestIdentifier();
    if (options.enableCors === true) this.setCors(options);
    if (options.enableCompression === true) this.setCompression();
    if (options.enableUpload) this.setUpload();
    if (options.enableProxy) this.setProxy();
    this.setProtection(options.protectedEnvironments);
  }

  /**
   * Adds middlewares to the Application
   * @param  {...Function} middlewares The middlewares that will be added to the application request handling pipeline
   * @returns {void}
   */
  addMiddleware(...middlewares) {
    for (let middleware of middlewares) {
      if (typeof middleware === 'array') {
        middleware.map((middleware) => middlewares.push(middleware));
        continue;
      }
      this.app.use(middleware);
    }
  }

  /**
   * Sets the Express Logger as a middleware to log requests
   * @returns {void}
   */
  registerLogger() {
    this.addMiddleware(logger);
  }

  /**
   * Defines that the application is a Worker and sets the Worker ID to the Application's Response Object.
   * @returns {void}
   */
  setAsWorker() {
    this.addMiddleware(workerIdentifier);
  }

  /**
   * Enables the request identifier middleware
   * @returns {void}
   */
  setRequestIdentifier() {
    this.addMiddleware(requestIdentifier);
  }

  /**
   * Enables Request/Response compression middleware
   * @returns {void}
   */
  setCompression() {
    this.addMiddleware(compression());
  }

  /**
   * Turns on the express-file-upload middleware
   * @returns {void}
   */
  setUpload() {
    this.addMiddleware(fileUpload());
  }

  /**
   * Turns on the cors middleware
   * @param {Object} options Object conaining the app options
   * @param {Object} options.cors Property of options containing the cors specific configuration
   * @param {String|String[]|Boolean} options.cors.origin The allowed origins to connect to the service (true to allow all, array to allow many, string to specify)
   * @param {String[]} options.cors.allowedHeaders The allowed Headers on Requests, will be merged with the defaults
   * @param {String[]} options.cors.allowedMethods The allowed HTTP Methods on Requests, will be merged with the defaults
   * @return {void}
   */
  setCors(options) {
    const corsOptions = {
      origin: options.cors.origin,
      methods: [...this.defaultAllowedMethods, ...options.cors.allowedMethods],
      allowedHeaders: [
        ...this.defaultAllowedHeaders,
        ...options.cors.allowedHeaders
      ]
    };
    this.app.options('*', cors(corsOptions));
    this.addMiddleware(cors(corsOptions));
  }

  /**
   * Sets the default protection definition for the Application. (only in protected environments)
   * @returns {void}
   */
  setProtection(protectedEnvironments = []) {
    if (
      [...this.defaultProtectedEnvironments, ...protectedEnvironments].indexOf(
        process.env.NODE_ENV
      ) > -1
    ) {
      this.app.disable('x-powered-by');
    }
  }

  /**
   * Sets proxy trusting definitions
   * @returns {void}
   */
  setProxy() {
    this.app.set('trust proxy', true);
    this.app.set('trust proxy', 'loopback');
  }
}

export default App;
