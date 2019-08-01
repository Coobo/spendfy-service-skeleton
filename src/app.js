let express = require('express');
let bodyParser = require('body-parser');
let compression = require('compression');
let cors = require('cors');
let helmet = require('helmet');
let fileUpload = require('express-fileupload');
let middlewares = require('./middlewares');
let logger = require('./logger');

class App {
    /**
     *
     * @param {Object} [options={}] The options to configure the application
     * @param {Number} [options.port=3000] The port for the application listen to
     * @param {String} [options.mode=main] The mode in wich the app should run, can be main or worker
     * @param {Boolean} [options.enableRequestIdentifier=true] Enables the request identifier header
     * @param {Boolean} [options.enableCompression=true] Enables the compression middleware
     * @param {Boolean} [options.enableUpload=true] Enables the express-fileupload middleware
     * @param {Boolean} [options.enableCors=true] Enables CORS configuration
     * @param {Object} [options.cors]
     * @param {String|String[]|Boolean} [options.cors.origin=true] Sets CORS allowed origins
     * @param {String[]} [options.cors.allowedHeaders=[]] Sets CORS allowed Headers
     * @param {String[]} [options.cors.allowedMethods=[]] Sets CORS allowed Methods
     * @param {Boolean} [options.enableProxy=true] Enables Trust proxy directives
     * @param {Boolean} [options.enableLogger=true] Enables the @coobo/spendfy-logger default logger for API Express
     * @param {Boolean} [options.enableHelmet=true] Enables the helmet security directives
     * @param {String[]} [options.protectedEnvironments=[]] Sets the protected environments in wich the securities measures will be applied
     * @returns {Express.Application} The express Application fully configured
     */
    constructor(options = {}) {
        this.setProperties();
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
                enableLogger: true,
                enableHelmet: true,
                protectedEnvironments: []
            },
            options
        );
        this.app = express();
        this.configure(options);
        return this.app;
    }

    /**
     * Defines the class this. properties for the Application
     */
    setProperties() {
        /**
         * @name app
         * @type {Express.Application}
         * @description The actual Express App that will handle requests
         */
        this.app = null;

        /**
         * @name defaultAllowedMethods
         * @type {String[]}
         * @default ['OPTIONS','GET','POST','PUT','PATCH','DELETE']
         * @description The app's default allowed HTTP Methods in case CORS is enabled through options (DEFAULTS TO TRUE)
         */
        this.defaultAllowedMethods = process.env.ALLOWED_HTTP_METHODS
            ? JSON.parse(process.env.ALLOWED_HTTP_METHODS)
            : ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

        /**
         * @name defaultAllowedHeaders
         * @type {String[]}
         * @default ['Origin','X-Requested-With','Content-Type','Accept','Authorization','Needed-Permissions','RequestID']
         * @description The app's default allowed Headers in case CORS is enabled through options (DEFAULTS TO TRUE)
         */
        this.defaultAllowedHeaders = process.env.ALLOWED_HTTP_HEADERS
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
        this.defaultProtectedEnvironments = process.env.PROTECTED_ENVIRONMENTS
            ? JSON.parse(process.env.PROTECTED_ENVIRONMENTS)
            : ['production', 'staging'];

        this.middlewares = middlewares;
    }

    configure(options) {
        if (options.enableLogger === true) this.registerLogger();
        if (options.mode === 'worker') this.setAsWorker();
        if (options.enableRequestIdentifier === true)
            this.setRequestIdentifier();
        if (options.enableCors === true) this.setCors(options);
        if (options.enableCompression === true) this.setCompression();
        if (options.enableUpload === true) this.setUpload();
        if (options.enableProxy === true) this.setProxy();
        if (options.enableHelmet === true) this.setHelmetProtection();
        this.setProtection(options.protectedEnvironments);
        this.app.use(bodyParser.raw());
        this.app.use(bodyParser.text());
        this.app.use(
            bodyParser.urlencoded({
                limit: '50mb',
                extended: true,
                parameterLimit: 50000
            })
        );
        this.app.use(bodyParser.json({ limit: '50mb' }));
        this.app.get('/status', (req, res) => {
            res.status(200);
            res.send({ ok: true });
        });
    }

    /**
     * Adds middlewares to the Application
     * @param  {...Function} middlewares The middlewares that will be added to the application request handling pipeline
     * @returns {void}
     */
    addMiddleware(middleware) {
        this.app.use(middleware);
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
        this.addMiddleware(this.middlewares.workerIdentifier);
    }

    /**
     * Enables the request identifier middleware
     * @returns {void}
     */
    setRequestIdentifier() {
        this.addMiddleware(this.middlewares.requestIndentifier);
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
            methods: [
                ...this.defaultAllowedMethods,
                ...options.cors.allowedMethods
            ],
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
            [
                ...this.defaultProtectedEnvironments,
                ...protectedEnvironments
            ].indexOf(process.env.NODE_ENV) > -1
        ) {
            this.app.disable('x-powered-by');
        }
    }

    /**
     * Sets the helmet protection definition for the Application.
     * @returns {void}
     */
    setHelmetProtection() {
        this.app.use(helmet());
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

module.exports = exports = App;
