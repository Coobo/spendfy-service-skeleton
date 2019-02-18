import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import logger from './logger';
import { requestIdentifier, workerIdentifier } from './middlewares';

class App {
  app;
  constructor(
    options = {
      origin: ['*'],
      port: process.env.PORT || 3000,
      mode: 'main',
      requestIdentifier: true
    }
  ) {
    this.app = express();
    this.registerLogger();
    if (options.mode === 'worker') this.setAsWorker();
    if (options.requestIdentifier === true)
      this.setRequestIdentifierMiddleware();
  }

  registerLogger() {
    this.app.use(logger);
  }

  setAsWorker() {
    this.app.use(workerIdentifier);
  }

  setRequestIdentifierMiddleware() {
    this.app.use(requestIdentifier);
  }
}

export default App;