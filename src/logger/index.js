import expressWinston from 'express-winston';
import { api } from '@coobo/spendfy-logger';

const options = {
  development: {
    winstonInstance: api,
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
    winstonInstance: api,
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
    winstonInstance: api,
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

export default logger;