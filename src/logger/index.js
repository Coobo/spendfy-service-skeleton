var expressWinston = require('express-winston');
var loggers = require('@coobo/spendfy-logger');

const options = {
  development: {
    winstonInstance: loggers.api,
    expressFormat: false,
    msg: '{{req.url}}: {{res.statusCode}} in {{res.responseTime}}ms ',
    level: (req, res) => {
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
      WorkerID: res.get('WorkerID') || null
    })
  },
  staging: {
    winstonInstance: loggers.api,
    expressFormat: false,
    msg: '{{req.url}}: {{res.statusCode}} in {{res.responseTime}}ms ',
    level: (req, res) => {
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
      WorkerID: res.get('WorkerID') || null
    })
  },
  production: {
    winstonInstance: loggers.api,
    expressFormat: false,
    msg: '{{req.url}}: {{res.statusCode}} in {{res.responseTime}}ms ',
    level: (req, res) => {
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
      WorkerID: res.get('WorkerID') || null
    })
  },
  testing: {
    winstonInstance: loggers.api,
    expressFormat: false,
    msg: '{{req.url}}: {{res.statusCode}} in {{res.responseTime}}ms ',
    level: (req, res) => {
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
      WorkerID: res.get('WorkerID') || null
    })
  }
};

let logger = expressWinston.logger(options[process.env.NODE_ENV]);

module.exports = exports = logger;
