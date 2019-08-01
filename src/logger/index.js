let loggers = require('@coobo/spendfy-logger');
let expressWinston = loggers.expressLogger;

const options = {
    development: {
        winstonInstance: loggers.api,
        expressFormat: false,
        msg: '{{req.url}}: {{res.statusCode}} in {{res.responseTime}}ms ',
        level: (req) => {
            return req.method;
        },
        colorize: true,
        meta: true,
        requestWhitelist: [
            'url',
            'headers',
            'method',
            'httpVersion',
            'originalUrl',
            'query',
            'isAuthenticated'
        ],
        dynamicMeta: (req, res) => ({
            user: req.user ? req.user.id : null,
            WorkerId: res.get('WorkerId') || null,
            RequestId: res.get('RequestId') || null
        })
    },
    staging: {
        winstonInstance: loggers.api,
        expressFormat: false,
        msg: '{{req.url}}: {{res.statusCode}} in {{res.responseTime}}ms ',
        level: (req) => {
            return req.method;
        },
        colorize: true,
        meta: true,
        requestWhitelist: [
            'url',
            'headers',
            'method',
            'httpVersion',
            'originalUrl',
            'query',
            'isAuthenticated'
        ],
        dynamicMeta: (req, res) => ({
            user: req.user ? req.user.id : null,
            WorkerId: res.get('WorkerId') || null,
            RequestId: res.get('RequestId') || null
        })
    },
    production: {
        winstonInstance: loggers.api,
        expressFormat: false,
        msg: '{{req.url}}: {{res.statusCode}} in {{res.responseTime}}ms ',
        level: (req) => {
            return req.method;
        },
        colorize: true,
        meta: true,
        requestWhitelist: [
            'url',
            'headers',
            'method',
            'httpVersion',
            'originalUrl',
            'query',
            'isAuthenticated'
        ],
        dynamicMeta: (req, res) => ({
            user: req.user ? req.user.id : null,
            WorkerId: res.get('WorkerId') || null,
            RequestId: res.get('RequestId') || null
        })
    },
    testing: {
        winstonInstance: loggers.api,
        expressFormat: false,
        msg: '{{req.url}}: {{res.statusCode}} in {{res.responseTime}}ms ',
        level: (req) => {
            return req.method;
        },
        colorize: true,
        meta: true,
        requestWhitelist: [
            'url',
            'headers',
            'method',
            'httpVersion',
            'originalUrl',
            'query',
            'isAuthenticated'
        ],
        dynamicMeta: (req, res) => ({
            user: req.user ? req.user.id : null,
            WorkerId: res.get('WorkerId') || null,
            RequestId: res.get('RequestId') || null
        })
    }
};

let logger = expressWinston.logger(options[process.env.NODE_ENV]);

module.exports = exports = logger;
